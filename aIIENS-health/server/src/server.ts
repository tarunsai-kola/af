import http from 'http';
import { env } from './config/env';
import { connectDB, disconnectDB } from './config/db';
import { logger } from './config/logger';
import { createApp } from './app';

async function bootstrap() {
  // Validate env (throws on missing required vars)
  logger.info('Starting AIIENS Health API...');

  // Connect to MongoDB
  await connectDB();

  // Create Express app
  const app = createApp();
  const server = http.createServer(app);

  // Start HTTP server
  server.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        env: env.NODE_ENV,
        clientUrl: env.CLIENT_URL,
      },
      `AIIENS Health API listening on port ${env.PORT}`,
    );
  });

  // ── Graceful shutdown ────────────────────────────────────────────────────────
  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutdown signal received. Closing server...');

    server.close(async () => {
      logger.info('HTTP server closed');
      await disconnectDB();
      logger.info('Graceful shutdown complete');
      process.exit(0);
    });

    // Force exit if graceful shutdown takes too long
    setTimeout(() => {
      logger.error('Forcefully shutting down after timeout');
      process.exit(1);
    }, 10_000).unref();
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));

  process.on('unhandledRejection', (reason: unknown) => {
    logger.error({ reason }, 'Unhandled Promise Rejection');
    void shutdown('unhandledRejection');
  });

  process.on('uncaughtException', (err: Error) => {
    logger.fatal({ err }, 'Uncaught Exception');
    void shutdown('uncaughtException');
  });
}

void bootstrap();
