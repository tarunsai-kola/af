import { createApp } from '../src/app';
import { connectDB } from '../src/config/db';
import { logger } from '../src/config/logger';

const app = createApp();

// Initialize DB connection for serverless function
connectDB()
  .then(() => logger.info('MongoDB connected in serverless function'))
  .catch((err) => logger.error('Failed to connect to MongoDB in serverless function', err));

export default app;
