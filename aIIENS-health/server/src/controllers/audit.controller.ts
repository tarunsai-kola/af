import { Request, Response, NextFunction } from 'express';
import { AuditEvent } from '../models/AuditEvent.model';
import { sendSuccess } from '../utils/apiResponse';

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      actor, 
      action, 
      objectType, 
      objectId,
      startDate,
      endDate
    } = req.query;

    const filter: any = {};

    if (actor) filter.actorUserId = actor;
    if (action) filter.action = action;
    if (objectType) filter.objectType = objectType;
    if (objectId) filter.objectId = objectId;

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate as string);
      if (endDate) filter.timestamp.$lte = new Date(endDate as string);
    }

    const logs = await AuditEvent.find(filter)
      .populate('actorUserId', 'name email role')
      .sort({ timestamp: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await AuditEvent.countDocuments(filter);

    sendSuccess(res, {
      statusCode: 200,
      message: 'Audit logs retrieved successfully',
      data: logs,
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
