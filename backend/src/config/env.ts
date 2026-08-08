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
  /** Force simulated MoMo payouts (also auto-on for sk_test_ keys) */
  WITHDRAW_DEMO_MODE: z
    .string()
    .optional()
    .transform((v) => v === 'true' || v === '1'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid backend environment:', parsed.error.flatten().fieldErrors);
  throw new Error('Missing or invalid environment variables. Copy .env.example to .env and fill values.');
}

export const env = parsed.data;

/** Test keys (and optional flag) skip Paystack Transfers — Starter accounts block them. */
export function isWithdrawDemoMode(): boolean {
  if (env.WITHDRAW_DEMO_MODE) return true;
  return env.PAYSTACK_SECRET_KEY.trim().toLowerCase().startsWith('sk_test_');
}
