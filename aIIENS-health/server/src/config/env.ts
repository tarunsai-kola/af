import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from server root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z
    .string()
    .default('5000')
    .transform((val) => parseInt(val, 10)),

  // Database
  MONGODB_URI: z.string().url({ message: 'MONGODB_URI must be a valid MongoDB connection URL' }),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters long'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SECRET: z.string().min(32, 'COOKIE_SECRET must be at least 32 characters long').optional(),


  // CORS
  CLIENT_URL: z.string().url({ message: 'CLIENT_URL must be a valid URL' }).default('http://localhost:5173'),

  // Cookies
  COOKIE_SECURE: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
  COOKIE_SAME_SITE: z.enum(['strict', 'lax', 'none']).default('lax'),

  // Storage
  STORAGE_PROVIDER: z.enum(['local', 's3', 'gcs']).default('local'),
  STORAGE_LOCAL_DIR: z.string().default('uploads'),

  // S3-compatible storage (required when STORAGE_PROVIDER=s3)
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().default('ap-south-1'),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),

  // Payment
  PAYMENT_PROVIDER: z.enum(['stripe', 'razorpay']).optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),

  // Impact Metrics
  IMPACT_METRICS_MODE: z.enum(['live', 'precomputed']).default('live'),

  // Audit Retention (seconds, default ≈ 7 years for healthcare compliance)
  AUDIT_RETENTION_SECONDS: z
    .string()
    .default('220752000')
    .transform((val) => parseInt(val, 10)),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .default('900000')
    .transform((val) => parseInt(val, 10)),
  RATE_LIMIT_MAX: z
    .string()
    .default('1000')
    .transform((val) => parseInt(val, 10)),
}).superRefine((data, ctx) => {
  if (data.NODE_ENV === 'production') {
    if (data.STORAGE_PROVIDER !== 's3') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'STORAGE_PROVIDER must be s3 in production',
        path: ['STORAGE_PROVIDER'],
      });
    }
  }

  if (data.STORAGE_PROVIDER === 's3') {
    if (!data.S3_ENDPOINT) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'S3_ENDPOINT is required when STORAGE_PROVIDER=s3', path: ['S3_ENDPOINT'] });
    }
    if (!data.S3_BUCKET) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'S3_BUCKET is required when STORAGE_PROVIDER=s3', path: ['S3_BUCKET'] });
    }
    if (!data.S3_ACCESS_KEY) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'S3_ACCESS_KEY is required when STORAGE_PROVIDER=s3', path: ['S3_ACCESS_KEY'] });
    }
    if (!data.S3_SECRET_KEY) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'S3_SECRET_KEY is required when STORAGE_PROVIDER=s3', path: ['S3_SECRET_KEY'] });
    }
  }

  if (data.PAYMENT_PROVIDER === 'razorpay') {
    if (!data.RAZORPAY_WEBHOOK_SECRET) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'RAZORPAY_WEBHOOK_SECRET is required when PAYMENT_PROVIDER=razorpay', path: ['RAZORPAY_WEBHOOK_SECRET'] });
    }
  }
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌  Invalid environment variables:\n');
    result.error.issues.forEach((issue) => {
      console.error(`   • ${issue.path.join('.')}: ${issue.message}`);
    });
    console.error('\nCheck your .env file against .env.example and restart the server.\n');
    process.exit(1);
  }

  return result.data;
}

export const env = validateEnv();
export type Env = typeof env;
