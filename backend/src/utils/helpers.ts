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
  if (key === 'VODAFONE' || key === 'TELECEL') return 'vod';
  if (key === 'AIRTELTIGO' || key === 'AT' || key === 'ATL') return 'atl';
  throw new Error(`Unsupported MoMo provider: ${provider}`);
}
