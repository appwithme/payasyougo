import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(8),
  JWT_EXPIRES_IN: z.string().default('7d'),
  PAYSTACK_SECRET_KEY: z.string().min(1),
  PAYSTACK_PUBLIC_KEY: z.string().optional(),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default('*'),
  PUBLIC_API_URL: z.string().optional(),
  // Optional until you paste Google OAuth client IDs
  GOOGLE_WEB_CLIENT_ID: z.string().optional(),
  GOOGLE_IOS_CLIENT_ID: z.string().optional(),
  GOOGLE_ANDROID_CLIENT_ID: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid backend environment:', parsed.error.flatten().fieldErrors);
  throw new Error('Missing or invalid environment variables. Copy .env.example to .env and fill values.');
}

export const env = parsed.data;
