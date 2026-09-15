import { Response } from 'express';
import { ApiSuccessResponse, PaginationMeta } from '../types/common';

/**
 * Send a consistent success response envelope.
 */
export function sendSuccess<T>(
  res: Response,
  {
    statusCode = 200,
    message,
    data,
    meta,
  }: {
    statusCode?: number;
    message: string;
    data?: T;
    meta?: PaginationMeta;
  },
): Response<ApiSuccessResponse<T>> {
  const body: ApiSuccessResponse<T> = {
    success: true,
    message,
    data: data as T,
    ...(meta && { meta }),
  };
  return res.status(statusCode).json(body);
}
