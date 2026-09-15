import { Router, Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse';

const router = Router();

/**
 * GET /api/health
 * Returns server + database health status.
 */
router.get('/', (_req: Request, res: Response) => {
  sendSuccess(res, {
    message: 'AIIENS Health API is running',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV ?? 'development',
      version: '1.0.0',
    },
  });
});

export default router;
