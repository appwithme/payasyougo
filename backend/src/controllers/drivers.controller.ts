import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { decimalToNumber } from '../services/wallet';

function mapDriverPublic(driver: {
  id: string;
  uniqueCode: string;
  vehicleInfo: string;
  rating: number;
  walletBalance: any;
  todayEarnings: any;
  totalTrips: number;
  user: { fullName: string; phone: string | null; email: string | null };
}) {
  return {
    id: driver.uniqueCode,
    driverRecordId: driver.id,
    name: driver.user.fullName,
    phone: driver.user.phone || '',
    email: driver.user.email || '',
    vehicle: driver.vehicleInfo,
    rating: driver.rating,
    walletBalance: decimalToNumber(driver.walletBalance),
    todayEarnings: decimalToNumber(driver.todayEarnings),
    totalTrips: driver.totalTrips,
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
  return mapDriverPublic(driver);
}
