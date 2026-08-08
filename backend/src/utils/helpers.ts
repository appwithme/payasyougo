import { prisma } from '../lib/prisma';

export async function nextDriverCode(): Promise<string> {
  const count = await prisma.driver.count();
  return `DRV${String(count + 1).padStart(3, '0')}`;
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\s+/g, '').replace(/^\+233/, '0');
}

/** Map app MoMo provider labels to Paystack mobile_money.provider */
export function toPaystackProvider(provider: string): 'mtn' | 'vod' | 'tgo' {
  const key = provider.toUpperCase();
  if (key === 'MTN') return 'mtn';
  if (key === 'VODAFONE' || key === 'TELECEL') return 'vod';
  if (key === 'AIRTELTIGO' || key === 'AT') return 'tgo';
  throw new Error(`Unsupported MoMo provider: ${provider}`);
}
