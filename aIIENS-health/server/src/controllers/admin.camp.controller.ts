import { Request, Response, NextFunction } from 'express';
import { MedicalCamp } from '../models/MedicalCamp.model';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/apiResponse';

export const getAllCampsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const filter: any = {};
    if (status) filter.status = status;

    const camps = await MedicalCamp.find(filter)
      .populate('hostUserId', 'name email')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await MedicalCamp.countDocuments(filter);

    sendSuccess(res, {
      statusCode: 200,
      message: 'Admin camps retrieved',
      data: camps,
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

export const verifyCampStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const camp = await MedicalCamp.findById(id);

    if (!camp) {
      throw new AppError('Camp not found', 404);
    }

    camp.status = status;
    if (notes) {
      camp.notes = camp.notes ? `${camp.notes}\nAdmin Note: ${notes}` : `Admin Note: ${notes}`;
    }

    await camp.save();

    sendSuccess(res, {
      statusCode: 200,
      message: `Camp status updated to ${status}`,
      data: camp
    });
  } catch (error) {
    next(error);
  }
};
