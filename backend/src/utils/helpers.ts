import { prisma } from '../lib/prisma';

export async function nextDriverCode(): Promise<string> {
  const count = await prisma.driver.count();
  return `DRV${String(count + 1).padStart(3, '0')}`;
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('233') && digits.length >= 12) {
    return `0${digits.slice(3)}`;
  }
  if (digits.startsWith('0')) return digits;
  if (digits.length === 9) return `0${digits}`;
  return digits;
}

/** Ghana MoMo local format Paystack expects, e.g. 0551234987 */
export function toPaystackPhone(phone: string): string {
  const local = normalizePhone(phone);
  if (!/^0\d{9}$/.test(local)) {
    throw new Error('Enter a valid Ghana MoMo number (10 digits, e.g. 05XXXXXXXX)');
  }
  return local;
}

/** Map app MoMo provider labels to Paystack mobile_money.provider */
export function toPaystackProvider(provider: string): 'mtn' | 'vod' | 'atl' {
  const key = provider.toUpperCase();
  if (key === 'MTN') return 'mtn';
  if (key === 'TELECEL' || key === 'VODAFONE') return 'vod';
  if (key === 'AIRTELTIGO' || key === 'AT' || key === 'ATL') return 'atl';
  throw new Error(`Unsupported MoMo provider: ${provider}`);
}

/** Bank/telco codes for Paystack Ghana MoMo transfer recipients */
export function toPaystackMomoBankCode(provider: string): 'MTN' | 'VOD' | 'ATL' {
  const key = provider.toUpperCase();
  if (key === 'MTN') return 'MTN';
  if (key === 'TELECEL' || key === 'VODAFONE' || key === 'VOD') return 'VOD';
  if (key === 'AIRTELTIGO' || key === 'AT' || key === 'ATL') return 'ATL';
  throw new Error(`Unsupported MoMo provider: ${provider}`);
}

/** Canonical label stored on transactions */
export function normalizeProviderLabel(provider: string): string {
  const key = provider.toUpperCase();
  if (key === 'MTN') return 'MTN';
  if (key === 'TELECEL' || key === 'VODAFONE') return 'TELECEL';
  if (key === 'AIRTELTIGO' || key === 'AT' || key === 'ATL') return 'AIRTELTIGO';
  return key;
}

/** Paystack sandbox MTN MoMo number — only valid with provider mtn */
export const PAYSTACK_TEST_MTN_NUMBER = '0551234987';
