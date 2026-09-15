import pino from 'pino';
import { env } from './env';

const isDev = env.NODE_ENV === 'development';

export const logger = pino({
  level: isDev ? 'debug' : 'info',
  base: {
    service: 'aiiens-health-api',
    env: env.NODE_ENV,
  },
});
