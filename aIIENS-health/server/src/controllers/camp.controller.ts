import { Request, Response, NextFunction } from 'express';
import { MedicalCamp } from '../models/MedicalCamp.model';
import { CampRegistration } from '../models/CampRegistration.model';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/apiResponse';


export const createCamp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const campData = req.body;

    const camp = await MedicalCamp.create({
      ...campData,
      hostUserId: userId,
      status: 'DRAFT',
      registeredCount: 0,
      attendedCount: 0
    });

    sendSuccess(res, {
      statusCode: 201,
      message: 'Medical camp draft created successfully',
      data: camp
    });
  } catch (error) {
    next(error);
  }
};

export const updateCamp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    
    // Make sure only the host can update, and only if it's not yet approved/published
    const camp = await MedicalCamp.findOne({ _id: id, hostUserId: userId });
    
    if (!camp) {
      throw new AppError('Camp not found or you do not have permission', 404);
    }
    
    if (['PUBLISHED', 'REGISTRATION_OPEN', 'COMPLETED', 'CLOSED'].includes(camp.status)) {
      throw new AppError('Cannot edit camp after it has been published or approved.', 403);
    }

    Object.assign(camp, req.body);
    await camp.save();

    sendSuccess(res, {
      statusCode: 200,
      message: 'Camp updated successfully',
      data: camp
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicCamps = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { city, service, status, page = 1, limit = 10 } = req.query;
    
    // Only return camps that are meant to be visible to the public
    const filter: any = {
      status: { $in: ['PUBLISHED', 'REGISTRATION_OPEN', 'COMPLETED'] }
    };

    if (status && filter.status.$in.includes(status as string)) {
      filter.status = status;
    }
    if (city) filter['location.city'] = new RegExp(city as string, 'i');
    if (service) filter.services = service;

    const camps = await MedicalCamp.find(filter)
      .populate('hostUserId', 'name')
      .sort({ startDate: 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await MedicalCamp.countDocuments(filter);

    sendSuccess(res, {
      statusCode: 200,
      message: 'Public camps retrieved',
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

export const getCampDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const camp = await MedicalCamp.findById(id).populate('hostUserId', 'name');

    if (!camp) {
      throw new AppError('Camp not found', 404);
    }

    sendSuccess(res, {
      statusCode: 200,
      message: 'Camp details retrieved',
      data: camp
    });
  } catch (error) {
    next(error);
  }
};

export const registerForCamp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const { registrantName, registrantAge, registrantGender, contactPhone, servicesRequested } = req.body;

    const camp = await MedicalCamp.findById(id);

    if (!camp) {
      throw new AppError('Camp not found', 404);
    }

    if (camp.status !== 'REGISTRATION_OPEN') {
      throw new AppError(`Registrations are not open for this camp (Status: ${camp.status})`, 400);
    }

    if (camp.registeredCount >= camp.capacity) {
      throw new AppError('Camp has reached maximum capacity', 400);
    }

    const existingRegistration = await CampRegistration.findOne({ campId: id, userId });
    if (existingRegistration) {
      throw new AppError('You are already registered for this camp', 400);
    }

    const registration = await CampRegistration.create({
      campId: id,
      userId,
      registrantName,
      registrantAge,
      registrantGender,
      contactPhone,
      servicesRequested,
      status: 'registered'
    });

    const updatedCamp = await MedicalCamp.findByIdAndUpdate(
      id,
      { $inc: { registeredCount: 1 } },
      { new: true }
    );

    if (updatedCamp!.registeredCount > updatedCamp!.capacity) {
      throw new AppError('Camp has reached maximum capacity during your registration', 400);
    }

    sendSuccess(res, {
      statusCode: 201,
      message: 'Successfully registered for camp',
      data: registration
    });
  } catch (error) {
    next(error);
  }
};
