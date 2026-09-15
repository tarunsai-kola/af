import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Error as MongooseError } from 'mongoose';
import { MongoServerError } from 'mongodb';
import { AppError } from '../utils/AppError';
import { logger } from '../config/logger';
import { env } from '../config/env';
import { ApiErrorResponse, FieldError } from '../types/common';

function buildErrorResponse(
  message: string,
  errors?: FieldError[],
  stack?: string,
): ApiErrorResponse {
  return {
    success: false,
    message,
    ...(errors && errors.length > 0 && { errors }),
    ...(env.NODE_ENV === 'development' && stack && { stack }),
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // ── Operational / known errors ──────────────────────────────────────────────

  if (err instanceof AppError) {
    logger.warn({ statusCode: err.statusCode, message: err.message, errors: err.errors }, 'AppError');
    res.status(err.statusCode).json(buildErrorResponse(err.message, err.errors, err.stack));
    return;
  }

  // ── Zod validation errors ────────────────────────────────────────────────────

  if (err instanceof ZodError) {
    const fieldErrors: FieldError[] = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    logger.warn({ errors: fieldErrors }, 'Validation error');
    res.status(422).json(buildErrorResponse('Validation failed', fieldErrors));
    return;
  }

  // ── Mongoose validation errors ────────────────────────────────────────────────

  if (err instanceof MongooseError.ValidationError || (err as Error)?.name === 'ValidationError') {
    const mongooseErr = err as any;
    const fieldErrors: FieldError[] = Object.values(mongooseErr.errors || {}).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
    res.status(422).json(buildErrorResponse('Validation failed', fieldErrors));
    return;
  }

  // ── Mongoose cast error (invalid ObjectId, etc.) ──────────────────────────────

  if (err instanceof MongooseError.CastError || (err as Error)?.name === 'CastError') {
    const mongooseErr = err as any;
    res.status(400).json(buildErrorResponse(`Invalid value for field: ${mongooseErr.path}`));
    return;
  }

  // ── MongoDB duplicate key error (E11000) ──────────────────────────────────────

  if (err instanceof MongoServerError && err.code === 11000) {
    const field = Object.keys(err.keyValue as Record<string, unknown>)[0];
    res.status(409).json(buildErrorResponse(`A record with this ${field} already exists`));
    return;
  }

  // ── JSON syntax error (malformed request body) ────────────────────────────────

  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json(buildErrorResponse('Invalid JSON in request body'));
    return;
  }

  // ── Unknown / programming errors ──────────────────────────────────────────────

  const errObj = err instanceof Error ? err : new Error(typeof err === 'object' && err !== null ? JSON.stringify(err) : String(err));
  logger.error({ err: errObj }, 'Unhandled error');

  res.status(500).json(
    buildErrorResponse(
      env.NODE_ENV === 'production' ? 'An unexpected error occurred' : errObj.message,
      undefined,
      env.NODE_ENV === 'development' ? errObj.stack : undefined,
    ),
  );
}
