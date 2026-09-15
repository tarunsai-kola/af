import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import { env } from './config/env';
import { requestLogger } from './middleware/requestLogger';
import { globalRateLimiter } from './middleware/rateLimiter';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import apiRouter from './routes/index';

export function createApp(): Application {
  const app = express();

  // Trust proxy for rate limiting behind load balancers (AWS ALB, Nginx, etc)
  app.set('trust proxy', 1);

  // ── Security headers ──────────────────────────────────────────────────────
  app.use(helmet());

  // ── CORS ──────────────────────────────────────────────────────────────────
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,              // Allow cookies
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
      exposedHeaders: ['X-Request-ID'],
    }),
  );

  // ── Body parsers (Strict Size Limits) ───────────────────────────────────────
  // Limit to 10kb to prevent payload DoS
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // ── Data Sanitization ───────────────────────────────────────────────────────
  // Prevent NoSQL query injection
  app.use(mongoSanitize());
  
  // Prevent XSS
  app.use(xss());

  // ── Cookie parser ──────────────────────────────────────────────────────────
  app.use(cookieParser());

  // ── Structured request logging ─────────────────────────────────────────────
  app.use(requestLogger);

  // ── Global rate limiter ────────────────────────────────────────────────────
  app.use(globalRateLimiter);

  // ── API routes ─────────────────────────────────────────────────────────────
  app.use('/api', apiRouter);

  // ── 404 catch-all ──────────────────────────────────────────────────────────
  app.use(notFound);

  // ── Centralized error handler ──────────────────────────────────────────────
  app.use(errorHandler);

  return app;
}
