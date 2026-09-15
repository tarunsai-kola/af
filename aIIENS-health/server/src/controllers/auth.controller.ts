import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User, AuditEvent, Donor } from '../models';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/apiResponse';
import {
  signAccessToken,
  signRefreshToken,
  createCookieOptions,
} from '../utils/jwt';

// ─── Register ─────────────────────────────────────────────────────────────────

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, phone, dateOfBirth, bloodGroup } = req.body;

    if (!name || !email || !password || !phone) {
      throw new AppError('Name, email, phone, and password are required', 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      phone,
      dateOfBirth: dateOfBirth || null,
      bloodGroup: bloodGroup || null,
      isDonor: !!bloodGroup, // Auto-mark as donor if blood group provided
      passwordHash,
      roles: ['PUBLIC_USER'],
    });

    // Auto-create a Donor profile if blood group + DOB are provided
    if (bloodGroup && dateOfBirth) {
      try {
        await Donor.create({
          userId: user._id,
          bloodGroup,
          dateOfBirth: new Date(dateOfBirth),
          gender: 'prefer_not_to_say', // Can be updated later in profile
          contact: {
            address: '',
            city: '',
            state: '',
            pincode: '000000',
          },
          eligibility: { isEligible: true, disqualifyingConditions: [] },
          availability: 'available',
          consent: {
            dataProcessingConsented: true,
            consentedAt: new Date(),
            consentVersion: '1.0',
          },
        });
      } catch (_donorErr) {
        // Non-fatal — donor profile can be completed later
        console.warn('[register] Could not auto-create donor profile:', _donorErr);
      }
    }

    sendSuccess(res, {
      statusCode: 201,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          bloodGroup: user.bloodGroup,
          roles: user.roles,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      await AuditEvent.create({
        action: 'LOGIN',
        objectType: 'User',
        source: 'api',
        changeSummary: `Failed login attempt for email: ${email}`,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      await AuditEvent.create({
        action: 'LOGIN',
        objectType: 'User',
        source: 'api',
        changeSummary: `Failed login attempt for email: ${email}`,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
      throw new AppError('Invalid email or password', 401);
    }

    if (user.status === 'suspended') {
      throw new AppError('Account is suspended', 403);
    }

    // Generate tokens
    const payload = { userId: user._id.toString(), roles: user.roles };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, createCookieOptions(true));

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    await AuditEvent.create({
      actorUserId: user._id,
      action: 'LOGIN',
      objectType: 'User',
      objectId: user._id,
      source: 'api',
      changeSummary: `User logged in`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    sendSuccess(res, {
      statusCode: 200,
      message: 'Login successful',
      data: {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          bloodGroup: user.bloodGroup,
          isDonor: user.isDonor,
          roles: user.roles,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('refreshToken');
    
    if (req.user) {
      await AuditEvent.create({
        actorUserId: req.user.userId,
        action: 'LOGOUT',
        objectType: 'User',
        objectId: req.user.userId,
        source: 'api',
        changeSummary: `User logged out`,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
    }

    sendSuccess(res, {
      statusCode: 200,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ─── Refresh Token ────────────────────────────────────────────────────────────

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new AppError('No refresh token provided', 401);
    }

    let decoded;
    try {
      // We need jsonwebtoken here to verify, but it's handled in utils
      const jwt = require('jsonwebtoken');
      const { env } = require('../config/env');
      decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as any;
    } catch (err) {
      res.clearCookie('refreshToken');
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.status === 'suspended') {
      res.clearCookie('refreshToken');
      throw new AppError('User not found or suspended', 401);
    }

    const payload = { userId: user._id.toString(), roles: user.roles };
    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    res.cookie('refreshToken', newRefreshToken, createCookieOptions(true));

    sendSuccess(res, {
      statusCode: 200,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new AppError('Email is required', 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      sendSuccess(res, { statusCode: 200, message: 'If that email exists, a reset link has been sent.' });
      return;
    }

    // Generate reset token (in a real app, generate a random hex string, hash it, save to DB, and send unhashed via email)
    // For demo purposes, we will use a simple JWT that expires in 15 mins.
    const jwt = require('jsonwebtoken');
    const { env } = require('../config/env');
    const resetToken = jwt.sign({ userId: user._id }, env.JWT_SECRET, { expiresIn: '15m' });

    // Mock sending email
    console.log(`\n\n[MOCK EMAIL] Password Reset Link: ${env.CLIENT_URL}/reset-password?token=${resetToken}\n\n`);

    sendSuccess(res, { statusCode: 200, message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    next(error);
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      throw new AppError('Token and new password are required', 400);
    }

    const jwt = require('jsonwebtoken');
    const { env } = require('../config/env');
    
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as any;
    } catch (err) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.passwordChangedAt = new Date();
    await user.save();

    await AuditEvent.create({
      actorUserId: user._id,
      action: 'update',
      objectType: 'User',
      objectId: user._id,
      source: 'api',
      changeSummary: `Password reset`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    sendSuccess(res, { statusCode: 200, message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── Me (Get Current User) ────────────────────────────────────────────────────

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    sendSuccess(res, {
      statusCode: 200,
      message: 'Current user profile',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          bloodGroup: user.bloodGroup,
          dateOfBirth: user.dateOfBirth,
          isDonor: user.isDonor,
          roles: user.roles,
          status: user.status,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
