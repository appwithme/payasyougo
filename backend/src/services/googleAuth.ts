import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';

export type GoogleProfile = {
  sub: string;
  email?: string;
  email_verified?: string | boolean;
  name?: string;
  picture?: string;
  aud: string;
};

/**
 * Verify a Google ID token via Google's tokeninfo endpoint.
 * Accepts web / iOS / Android client IDs configured in env.
 */
export async function verifyGoogleIdToken(idToken: string): Promise<GoogleProfile> {
  const audiences = [
    env.GOOGLE_WEB_CLIENT_ID,
    env.GOOGLE_IOS_CLIENT_ID,
    env.GOOGLE_ANDROID_CLIENT_ID,
  ].filter((v): v is string => !!v && !v.includes('replace'));

  if (audiences.length === 0) {
    throw new AppError(
      'Google sign-in is not configured. Set GOOGLE_*_CLIENT_ID in backend/.env',
      503
    );
  }

  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
  );
  if (!res.ok) {
    throw new AppError('Invalid Google token', 401);
  }

  const data = (await res.json()) as GoogleProfile;
  if (!data.sub || !audiences.includes(data.aud)) {
    throw new AppError('Google token audience mismatch', 401);
  }

  return data;
}
