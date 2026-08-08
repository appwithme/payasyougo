import { fetchFare } from './routesService';
import { RouteInfo, Transaction } from '../types';

/**
 * Resolve a bookable route for an existing trip.
 * Prefers live fare from API; falls back to the trip amount if the DB is briefly down.
 */
export async function resolveRebookRoute(trip: Transaction): Promise<RouteInfo> {
  try {
    return await fetchFare(trip.from, trip.to);
  } catch {
    return {
      id: `rebook-${trip.from}-${trip.to}`.replace(/\s+/g, '-').toLowerCase(),
      from: trip.from,
      to: trip.to,
      fare: Number(trip.amount) || 0,
    };
  }
}
