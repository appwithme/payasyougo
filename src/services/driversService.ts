import { apiRequest } from './apiClient';
import { Driver } from '../types';

export async function lookupDriver(code: string): Promise<Driver> {
  return apiRequest(`/api/drivers/${encodeURIComponent(code.toUpperCase())}`);
}

export async function fetchMyWallet(): Promise<Driver> {
  return apiRequest('/api/drivers/me/wallet');
}
