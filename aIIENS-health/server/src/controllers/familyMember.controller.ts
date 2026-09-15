import { Request, Response, NextFunction } from 'express';
import { FamilyMember } from '../models';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/apiResponse';

// ─── Get My Family Members ────────────────────────────────────────────────────

export const getMyFamilyMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const members = await FamilyMember.find({ userId }).sort({ createdAt: -1 });

    sendSuccess(res, {
      statusCode: 200,
      message: 'Family members retrieved',
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Create Family Member ─────────────────────────────────────────────────────

export const createFamilyMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { name, email, phone, dateOfBirth, bloodGroup, relation } = req.body;

    if (!name || !phone || !dateOfBirth || !relation) {
      throw new AppError('Name, phone, date of birth, and relation are required', 400);
    }

    const member = await FamilyMember.create({
      userId,
      name,
      email: email || null,
      phone,
      dateOfBirth: new Date(dateOfBirth),
      bloodGroup: bloodGroup || null,
      relation,
    });

    sendSuccess(res, {
      statusCode: 201,
      message: 'Family member added successfully',
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Update Family Member ─────────────────────────────────────────────────────

export const updateFamilyMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const { name, email, phone, dateOfBirth, bloodGroup, relation } = req.body;

    const member = await FamilyMember.findOne({ _id: id, userId });
    if (!member) {
      throw new AppError('Family member not found', 404);
    }

    if (name) member.name = name;
    if (email !== undefined) member.email = email;
    if (phone) member.phone = phone;
    if (dateOfBirth) member.dateOfBirth = new Date(dateOfBirth);
    if (bloodGroup !== undefined) member.bloodGroup = bloodGroup;
    if (relation) member.relation = relation;

    await member.save();

    sendSuccess(res, {
      statusCode: 200,
      message: 'Family member updated successfully',
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Delete Family Member ─────────────────────────────────────────────────────

export const deleteFamilyMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const member = await FamilyMember.findOneAndDelete({ _id: id, userId });
    if (!member) {
      throw new AppError('Family member not found', 404);
    }

    sendSuccess(res, {
      statusCode: 200,
      message: 'Family member removed successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
