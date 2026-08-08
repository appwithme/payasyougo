import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { signToken } from '../utils/jwt';
import { nextDriverCode, normalizePhone } from '../utils/helpers';
import { AppError } from '../middleware/errorHandler';
import { decimalToNumber } from '../services/wallet';
import { verifyGoogleIdToken, GoogleProfile } from '../services/googleAuth';

const registerSchema = z.object({
  role: z.enum(['PASSENGER', 'DRIVER']),
  fullName: z.string().min(2),
  phone: z.string().min(9),
  email: z.string().email().optional().or(z.literal('')),
  password: z.string().min(6),
  vehicleInfo: z.string().optional(),
});

const loginSchema = z.object({
  phone: z.string().min(9),
  password: z.string().min(1),
});

const googleSchema = z.object({
  idToken: z.string().min(10),
});

const googleCodeSchema = z.object({
  code: z.string().min(5),
  redirectUri: z.string().url(),
});

const avatarSchema = z.object({
  avatarUrl: z.string().min(1).max(2_500_000),
});

function isGoogleHostedAvatar(url?: string | null) {
  if (!url) return true;
  return url.includes('googleusercontent.com') || url.includes('ggpht.com');
}

function mapUser(user: {
  id: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  avatarUrl?: string | null;
  role: Role;
  driver?: {
    id: string;
    uniqueCode: string;
    vehicleInfo: string;
    rating: number;
    ratingCount: number;
    walletBalance: any;
    todayEarnings: any;
    totalTrips: number;
  } | null;
}) {
  if (user.role === Role.DRIVER && user.driver) {
    return {
      id: user.driver.uniqueCode,
      userId: user.id,
      driverRecordId: user.driver.id,
      name: user.fullName,
      phone: user.phone || '',
      email: user.email || '',
      vehicle: user.driver.vehicleInfo,
      rating: user.driver.rating,
      ratingCount: user.driver.ratingCount,
      walletBalance: decimalToNumber(user.driver.walletBalance),
      todayEarnings: decimalToNumber(user.driver.todayEarnings),
      totalTrips: user.driver.totalTrips,
      role: 'driver' as const,
      avatar: user.avatarUrl || null,
    };
  }

  return {
    id: user.id,
    name: user.fullName,
    phone: user.phone || '',
    email: user.email || '',
    role: 'passenger' as const,
    avatar: user.avatarUrl || null,
  };
}

export async function register(body: unknown) {
  const input = registerSchema.parse(body);
  const phone = normalizePhone(input.phone);

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) throw new AppError('An account with this phone already exists', 409);

  if (input.role === 'DRIVER' && !input.vehicleInfo?.trim()) {
    throw new AppError('Vehicle info is required for drivers');
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const uniqueCode = input.role === 'DRIVER' ? await nextDriverCode() : undefined;

  const user = await prisma.user.create({
    data: {
      fullName: input.fullName.trim(),
      phone,
      email: input.email || null,
      passwordHash,
      role: input.role as Role,
      ...(input.role === 'DRIVER'
        ? {
            driver: {
              create: {
                uniqueCode: uniqueCode!,
                vehicleInfo: input.vehicleInfo!.trim(),
              },
            },
          }
        : {}),
    },
    include: { driver: true },
  });

  const token = signToken({ sub: user.id, role: user.role, phone: user.phone || '' });
  return { token, user: mapUser(user) };
}

export async function login(body: unknown) {
  const input = loginSchema.parse(body);
  const phone = normalizePhone(input.phone);

  const user = await prisma.user.findUnique({
    where: { phone },
    include: { driver: true },
  });
  if (!user) throw new AppError('No account found with this phone number', 404);

  if (!user.passwordHash) {
    throw new AppError('This account uses Google sign-in. Continue with Google.', 401);
  }

  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) throw new AppError('Incorrect password', 401);

  const token = signToken({ sub: user.id, role: user.role, phone: user.phone || '' });
  return { token, user: mapUser(user) };
}

/** Passenger-only Google sign-in / sign-up */
export async function loginWithGoogle(body: unknown) {
  const input = googleSchema.parse(body);
  const profile = await verifyGoogleIdToken(input.idToken);
  return finishGooglePassengerLogin(profile);
}

/** Exchange auth code (Web client + secret) then sign in */
export async function loginWithGoogleCode(body: unknown) {
  const input = googleCodeSchema.parse(body);
  const clientId = process.env.GOOGLE_WEB_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret || clientId.includes('replace')) {
    throw new AppError('Google client secret is not configured on the API', 503);
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: input.code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: input.redirectUri,
      grant_type: 'authorization_code',
    }).toString(),
  });

  const tokenJson: any = await tokenRes.json();
  if (!tokenRes.ok || !tokenJson.id_token) {
    throw new AppError(tokenJson?.error_description || 'Google code exchange failed', 401);
  }

  const profile = await verifyGoogleIdToken(tokenJson.id_token);
  return finishGooglePassengerLogin(profile);
}

async function finishGooglePassengerLogin(profile: GoogleProfile) {
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { googleId: profile.sub },
        ...(profile.email ? [{ email: profile.email }] : []),
      ],
    },
    include: { driver: true },
  });

  if (user) {
    if (user.role !== Role.PASSENGER) {
      throw new AppError('Google sign-in is only available for passengers', 403);
    }
    const shouldSyncPhoto = Boolean(profile.picture) && isGoogleHostedAvatar(user.avatarUrl);
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        googleId: profile.sub,
        email: profile.email || user.email,
        fullName: profile.name || user.fullName,
        ...(shouldSyncPhoto ? { avatarUrl: profile.picture } : {}),
      },
      include: { driver: true },
    });
  } else {
    user = await prisma.user.create({
      data: {
        fullName: profile.name || profile.email || 'Passenger',
        email: profile.email || null,
        googleId: profile.sub,
        avatarUrl: profile.picture || null,
        phone: null,
        passwordHash: null,
        role: Role.PASSENGER,
      },
      include: { driver: true },
    });
  }

  const token = signToken({ sub: user.id, role: user.role, phone: user.phone || '' });
  return { token, user: mapUser(user) };
}

export async function me(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { driver: true },
  });
  if (!user) throw new AppError('User not found', 404);
  return mapUser(user);
}

const profileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().min(9).optional().or(z.literal('')),
});

export async function updateProfile(userId: string, body: unknown) {
  const raw = (body ?? {}) as Record<string, unknown>;
  if ('email' in raw) {
    throw new AppError('Email cannot be changed', 400);
  }

  const input = profileSchema.parse(body);

  const data: {
    fullName?: string;
    phone?: string | null;
  } = {};

  if (typeof input.fullName === 'string' && input.fullName.trim()) {
    data.fullName = input.fullName.trim();
  }

  if (typeof input.phone === 'string') {
    if (!input.phone.trim()) {
      data.phone = null;
    } else {
      const phone = normalizePhone(input.phone);
      const taken = await prisma.user.findFirst({
        where: { phone, NOT: { id: userId } },
      });
      if (taken) throw new AppError('That phone number is already in use', 409);
      data.phone = phone;
    }
  }

  if (Object.keys(data).length === 0) {
    throw new AppError('No profile fields to update');
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    include: { driver: true },
  });

  return mapUser(user);
}

export async function updateAvatar(userId: string, body: unknown) {
  const input = avatarSchema.parse(body);
  const url = input.avatarUrl.trim();

  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:image/')) {
    throw new AppError('Avatar must be an image URL or data URI', 400);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: url },
    include: { driver: true },
  });

  return mapUser(user);
}
