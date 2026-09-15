import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../utils/AppError';

export const validateObjectId = (paramName: string = 'id') => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const id = req.params[paramName];
    
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError(`Invalid ${paramName} format`, 400));
    }
    
    next();
  };
};
