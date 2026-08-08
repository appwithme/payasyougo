import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { decimalToNumber } from '../services/wallet';

function mapDriverPublic(driver: {
  id: string;
  uniqueCode: string;
  vehicleInfo: string;
  rating: number;
  ratingCount: number;
  walletBalance: any;
  todayEarnings: any;
  totalTrips: number;
  user: {
    fullName: string;
    phone: string | null;
    email: string | null;
    avatarUrl?: string | null;
  };
}) {
  return {
    id: driver.uniqueCode,
    driverRecordId: driver.id,
    name: driver.user.fullName,
    phone: driver.user.phone || '',
    email: driver.user.email || '',
    vehicle: driver.vehicleInfo,
    rating: driver.rating,
    ratingCount: driver.ratingCount,
    walletBalance: decimalToNumber(driver.walletBalance),
    todayEarnings: decimalToNumber(driver.todayEarnings),
    totalTrips: driver.totalTrips,
    avatar: driver.user.avatarUrl || null,
  };
}

export async function lookupByCode(code: string) {
  const driver = await prisma.driver.findUnique({
    where: { uniqueCode: code.toUpperCase() },
    include: { user: true },
  });
  if (!driver) throw new AppError('No driver found with this ID', 404);
  return mapDriverPublic(driver);
}

export async function myWallet(userId: string) {
  const driver = await prisma.driver.findUnique({
    where: { userId },
    include: { user: true },
  });
  if (!driver) throw new AppError('Driver profile not found', 404);
  return {
    ...mapDriverPublic(driver),
    ghanaCardNumber: driver.ghanaCardNumber || undefined,
    ghanaCardVerified: Boolean(driver.ghanaCardVerified),
    licenseNumber: driver.licenseNumber || undefined,
    licenseVerified: Boolean(driver.licenseVerified),
  };
}
