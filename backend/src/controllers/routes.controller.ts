import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { decimalToNumber } from '../services/wallet';

export async function listRoutes() {
  const routes = await prisma.route.findMany({
    where: { active: true },
    orderBy: [{ fromLocation: 'asc' }, { toLocation: 'asc' }],
  });

  const locations = Array.from(
    new Set(routes.flatMap((r) => [r.fromLocation, r.toLocation]))
  ).sort();

  return {
    locations,
    routes: routes.map((r) => ({
      id: r.id,
      from: r.fromLocation,
      to: r.toLocation,
      fare: decimalToNumber(r.fare),
    })),
  };
}

export async function getFare(from?: string, to?: string) {
  if (!from || !to) throw new AppError('from and to query params are required');

  const route = await prisma.route.findFirst({
    where: {
      fromLocation: from,
      toLocation: to,
      active: true,
    },
  });

  if (!route) throw new AppError('No fare found for this route', 404);

  return {
    id: route.id,
    from: route.fromLocation,
    to: route.toLocation,
    fare: decimalToNumber(route.fare),
  };
}
