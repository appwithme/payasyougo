import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { signToken } from '../utils/jwt';
import { nextDriverCode, normalizePhone } from '../utils/helpers';
import { AppError } from '../middleware/errorHandler';
import { decimalToNumber } from '../services/wallet';

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

function mapUser(user: {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  role: Role;
  driver?: {
    id: string;
    uniqueCode: string;
    vehicleInfo: string;
    rating: number;
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
      phone: user.phone,
      email: user.email || '',
      vehicle: user.driver.vehicleInfo,
      rating: user.driver.rating,
      walletBalance: decimalToNumber(user.driver.walletBalance),
      todayEarnings: decimalToNumber(user.driver.todayEarnings),
      totalTrips: user.driver.totalTrips,
      role: 'driver' as const,
      avatar: null,
    };
  }

  return {
    id: user.id,
    name: user.fullName,
    phone: user.phone,
    email: user.email || '',
    role: 'passenger' as const,
    avatar: null,
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

  const token = signToken({ sub: user.id, role: user.role, phone: user.phone });
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

  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) throw new AppError('Incorrect password', 401);

  const token = signToken({ sub: user.id, role: user.role, phone: user.phone });
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
