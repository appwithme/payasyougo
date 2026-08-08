import crypto from 'crypto';
import { env } from '../config/env';
import { toPaystackProvider } from '../utils/helpers';

const PAYSTACK_BASE = 'https://api.paystack.co';

type ChargeArgs = {
  email: string;
  amountGhs: number;
  phone: string;
  provider: string;
  reference: string;
  metadata?: Record<string, unknown>;
};

async function paystackFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

export async function chargeMobileMoney(args: ChargeArgs) {
  const amountPesewas = Math.round(args.amountGhs * 100);
  const body = {
    email: args.email,
    amount: amountPesewas,
    currency: 'GHS',
    reference: args.reference,
    metadata: args.metadata,
    mobile_money: {
      phone: args.phone,
      provider: toPaystackProvider(args.provider),
    },
  };

  const { ok, data } = await paystackFetch('/charge', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!ok || !data.status) {
    const message = data?.message || 'Paystack charge failed';
    throw new Error(message);
  }

  return data.data as {
    reference: string;
    status: string;
    display_text?: string;
    gateway_response?: string;
  };
}

export async function verifyTransaction(reference: string) {
  const { ok, data } = await paystackFetch(`/transaction/verify/${encodeURIComponent(reference)}`);
  if (!ok || !data.status) {
    throw new Error(data?.message || 'Paystack verify failed');
  }
  return data.data as {
    status: string;
    reference: string;
    amount: number;
    gateway_response?: string;
  };
}

export function verifyPaystackSignature(rawBody: Buffer | string, signature: string | undefined): boolean {
  if (!signature) return false;
  const hash = crypto
    .createHmac('sha512', env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest('hex');
  return hash === signature;
}
