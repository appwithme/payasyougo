import { apiRequest } from './apiClient';
import { RouteInfo } from '../types';

export async function fetchRoutes(): Promise<{ locations: string[]; routes: RouteInfo[] }> {
  return apiRequest('/api/routes', { auth: false });
}

export async function fetchFare(from: string, to: string): Promise<RouteInfo> {
  const q = `from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
  return apiRequest(`/api/routes/fare?${q}`, { auth: false });
}
