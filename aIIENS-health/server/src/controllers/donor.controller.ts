import { Request, Response, NextFunction } from 'express';
import { Donor } from '../models/Donor.model';
import { User } from '../models/User.model';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/apiResponse';

export const registerDonor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId || (req as any).user?.id;
    const { bloodGroup, dateOfBirth, gender, contact, eligibility, consent } = req.body;

    const existingDonor = await Donor.findOne({ userId });
    if (existingDonor) {
      throw new AppError('You are already registered as a donor.', 400);
    }

    const donor = await Donor.create({
      userId,
      bloodGroup,
      dateOfBirth,
      gender,
      contact,
      eligibility,
      consent,
      verificationStatus: 'unverified',
      availability: 'available'
    });

    // Optionally update user roles to include DONOR
    await User.findByIdAndUpdate(userId, { $addToSet: { roles: 'DONOR' } });

    sendSuccess(res, {
      statusCode: 201,
      message: 'Donor registration successful.',
      data: donor
    });
  } catch (error) {
    next(error);
  }
};

export const getMyDonorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId || (req as any).user?.id;
    const donor = await Donor.findOne({ userId });

    if (!donor) {
      throw new AppError('Donor profile not found.', 404);
    }

    sendSuccess(res, {
      statusCode: 200,
      message: 'Donor profile retrieved',
      data: donor
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId || (req as any).user?.id;
    const { availability } = req.body;

    const donor = await Donor.findOneAndUpdate(
      { userId },
      { availability },
      { new: true, runValidators: true }
    );

    if (!donor) {
      throw new AppError('Donor profile not found.', 404);
    }

    sendSuccess(res, {
      statusCode: 200,
      message: 'Availability updated',
      data: donor
    });
  } catch (error) {
    next(error);
  }
};

export const searchDonors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bloodGroup, pincode, city, page = 1, limit = 10 } = req.query;
    const filter: any = { 
      availability: 'available',
      // Depending on rules, you might only return 'verified' donors here. We'll return all available for MVP.
    };

    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (pincode) filter['contact.pincode'] = pincode;
    if (city) filter['contact.city'] = new RegExp(city as string, 'i');

    const donors = await Donor.find(filter)
      .populate('userId', 'name phone')
      .select('bloodGroup contact.city contact.pincode contact.emergencyContactPhone availability verificationStatus donationCount')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Donor.countDocuments(filter);

    sendSuccess(res, {
      statusCode: 200,
      message: 'Donors retrieved',
      data: donors,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        hasNextPage: Number(page) < Math.ceil(total / Number(limit)),
        hasPrevPage: Number(page) > 1
      }
    });
  } catch (error) {
    next(error);
  }
};
