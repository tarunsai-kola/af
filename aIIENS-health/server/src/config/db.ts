import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

async function connectWithRetry(attempt: number = 1): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(
      { uri: env.MONGODB_URI.replace(/\/\/.*@/, '//[credentials]@') },
      'MongoDB connected successfully',
    );
  } catch (error) {
    logger.error({ err: error, attempt }, `MongoDB connection attempt ${attempt} failed`);

    if (attempt < MAX_RETRIES) {
      logger.info({ nextAttemptIn: RETRY_DELAY_MS }, `Retrying connection...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      await connectWithRetry(attempt + 1);
    } else {
      logger.error('MongoDB connection failed after maximum retries. Exiting.');
      process.exit(1);
    }
  }
}

export async function connectDB(): Promise<void> {
  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected. Attempting to reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });

  mongoose.connection.on('error', (err: Error) => {
    logger.error({ err }, 'MongoDB connection error');
  });

  await connectWithRetry();
}

export async function disconnectDB(): Promise<void> {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
}
