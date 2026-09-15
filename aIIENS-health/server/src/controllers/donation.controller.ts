import { Request, Response, NextFunction } from 'express';
import { Donation } from '../models/Donation.model';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/apiResponse';

export const getDonation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const roles = (req as any).user.roles;

    const donation = await Donation.findById(id).populate('campaignId', 'title slug');

    if (!donation) {
      throw new AppError('Donation not found', 404);
    }

    // Authorization: User must be the donor or an ADMIN/FINANCE_OFFICER
    const isOwner = donation.userId.toString() === userId;
    const isAdmin = roles.some((r: string) => ['ADMIN', 'SUPER_ADMIN', 'FINANCE_OFFICER'].includes(r));

    if (!isOwner && !isAdmin) {
      throw new AppError('Not authorized to view this donation receipt', 403);
    }

    sendSuccess(res, {
      statusCode: 200,
      message: 'Donation retrieved',
      data: donation
    });
  } catch (error) {
    next(error);
  }
};
