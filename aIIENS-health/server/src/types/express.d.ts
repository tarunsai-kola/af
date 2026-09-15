import { JwtPayload } from './common';

declare global {
  namespace Express {
    interface Request {
      /**
       * Populated by the `authenticate` middleware after JWT verification.
       * Undefined on public routes.
       */
      user?: JwtPayload;
      /**
       * Request-scoped correlation ID for tracing.
       */
      requestId?: string;
    }
  }
}

// This file is a module augmentation — it must export something
export {};
