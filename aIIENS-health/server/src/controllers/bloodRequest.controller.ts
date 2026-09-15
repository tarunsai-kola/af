import { Request, Response, NextFunction } from 'express';
import { BloodRequest } from '../models/BloodRequest.model';
import { BloodRequestStatus } from '../models/constants';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/apiResponse';

// ─── Create Blood Request ─────────────────────────────────────────────────────

export const createBloodRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { bloodGroup, units, urgency, location, contactName, contactPhone, notes, requiredBy } = req.body;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Default expiry to 7 days

    const bloodRequest = await BloodRequest.create({
      requestedByUserId: userId,
      bloodGroup,
      units,
      urgency,
      location,
      contactName,
      contactPhone,
      notes,
      requiredBy: requiredBy ? new Date(requiredBy) : null,
      expiresAt,
      status: 'VALIDATING', // Requires admin verification before becoming ACTIVE
    });

    sendSuccess(res, {
      statusCode: 201,
      message: 'Blood emergency raised successfully',
      data: bloodRequest,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get All Blood Requests (public feed) ────────────────────────────────────

export const getBloodRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bloodGroup, city, urgency, status = 'ACTIVE', page = 1, limit = 10 } = req.query;
    const filter: any = {};

    if (status !== 'all') {
      filter.status = status;
    }
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (urgency) filter.urgency = urgency;
    if (city) filter['location.city'] = new RegExp(city as string, 'i');

    const requests = await BloodRequest.find(filter)
      .populate('requestedByUserId', 'name')
      .sort({ urgency: -1, createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await BloodRequest.countDocuments(filter);

    sendSuccess(res, {
      statusCode: 200,
      message: 'Blood requests retrieved',
      data: requests,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        hasNextPage: Number(page) < Math.ceil(total / Number(limit)),
        hasPrevPage: Number(page) > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get My Blood Requests ────────────────────────────────────────────────────

export const getMyBloodRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;

    const requests = await BloodRequest.find({ requestedByUserId: userId })
      .sort({ createdAt: -1 });

    const total = requests.length;

    sendSuccess(res, {
      statusCode: 200,
      message: 'Your blood requests retrieved',
      data: requests,
      meta: {
        total,
        page: 1,
        limit: total,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Blood Request Details ────────────────────────────────────────────────

export const getBloodRequestDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const request = await BloodRequest.findById(id)
      .populate('requestedByUserId', 'name phone');

    if (!request) {
      throw new AppError('Blood request not found', 404);
    }

    sendSuccess(res, {
      statusCode: 200,
      message: 'Blood request details retrieved',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Cancel Blood Request ─────────────────────────────────────────────────────

export const cancelBloodRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const request = await BloodRequest.findOne({ _id: id, requestedByUserId: userId });
    if (!request) {
      throw new AppError('Blood request not found or not authorized', 404);
    }

    if (request.status === ('FULFILLED' as BloodRequestStatus)) {
      throw new AppError('Cannot cancel a fulfilled request', 400);
    }

    request.status = 'CANCELLED' as BloodRequestStatus;
    await request.save();

    sendSuccess(res, {
      statusCode: 200,
      message: 'Blood request cancelled',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};
