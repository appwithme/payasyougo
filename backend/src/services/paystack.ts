import crypto from 'crypto';
import { env } from '../config/env';
import {
  toPaystackProvider,
  toPaystackPhone,
  toPaystackMomoBankCode,
} from '../utils/helpers';

const PAYSTACK_BASE = 'https://api.paystack.co';

type ChargeArgs = {
  email: string;
  amountGhs: number;
  phone: string;
  provider: string;
  reference: string;
  metadata?: Record<string, unknown>;
};

export type ChargeResult = {
  reference: string;
  status: string;
  display_text?: string;
  gateway_response?: string;
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
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

const PENDING_STATUSES = new Set([
  'pay_offline',
  'pending',
  'send_otp',
  'open_url',
  'ongoing',
]);

function friendlyChargeError(message: string | undefined, httpStatus: number): string {
  const msg = (message || '').trim();
  const lower = msg.toLowerCase();

  if (lower.includes('test mobile money') || lower.includes('test transaction')) {
    return 'Test mode: use Paystack’s test MTN number 0551234987';
  }
  if (!msg || lower === 'charge attempted') {
    return 'Could not start the MoMo charge. Check the number matches your selected network and try again.';
  }
  if (lower.includes('invalid') && lower.includes('phone')) {
    return 'That Mobile Money number looks invalid. Use a Ghana number like 05XXXXXXXX.';
  }
  if (lower.includes('currency') || lower.includes('ghs')) {
    return 'This Paystack account may not be set up for Ghana MoMo (GHS).';
  }
  if (httpStatus === 401 || lower.includes('invalid key')) {
    return 'Paystack keys look invalid. Check PAYSTACK_SECRET_KEY on the server.';
  }
  return msg;
}

export async function chargeMobileMoney(args: ChargeArgs): Promise<ChargeResult> {
  const amountPesewas = Math.round(args.amountGhs * 100);
  const phone = toPaystackPhone(args.phone);
  const provider = toPaystackProvider(args.provider);

  const body = {
    email: args.email,
    amount: amountPesewas,
    currency: 'GHS',
    reference: args.reference,
    metadata: args.metadata,
    mobile_money: {
      phone,
      provider,
    },
  };

  const { ok, status: httpStatus, data } = await paystackFetch('/charge', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const payload = data?.data;
  const txnStatus = typeof payload?.status === 'string' ? payload.status.toLowerCase() : '';

  // Success path: API ok + boolean status true (message is often "Charge attempted")
  if (ok && data?.status === true && payload) {
    return {
      reference: payload.reference || args.reference,
      status: txnStatus || 'pending',
      display_text:
        payload.display_text ||
        'Approve the MoMo prompt on your phone to complete payment.',
      gateway_response: payload.gateway_response,
    };
  }

  // Some gateways return useful payload even when HTTP is awkward — treat offline pending as success
  if (payload?.reference && PENDING_STATUSES.has(txnStatus)) {
    return {
      reference: payload.reference,
      status: txnStatus,
      display_text:
        payload.display_text ||
        'Approve the MoMo prompt on your phone to complete payment.',
      gateway_response: payload.gateway_response,
    };
  }

  console.error('[paystack] charge failed', {
    httpStatus,
    message: data?.message,
    payload,
    phone,
    provider,
  });

  throw new Error(
    friendlyChargeError(payload?.message || data?.message, httpStatus)
  );
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

function friendlyTransferError(message: string | undefined, httpStatus: number): string {
  const msg = (message || '').trim();
  const lower = msg.toLowerCase();

  if (lower.includes('balance') || lower.includes('insufficient')) {
    return 'Payout balance is too low on Paystack. Try again later or contact support.';
  }
  if (lower.includes('otp') || lower.includes('transfer has been queued')) {
    return 'Transfer needs approval in the Paystack dashboard. Disable Transfer OTP for automatic payouts.';
  }
  if (lower.includes('recipient') || lower.includes('account')) {
    return 'Could not create MoMo recipient. Check the number matches the selected network.';
  }
  if (httpStatus === 401 || lower.includes('invalid key')) {
    return 'Paystack keys look invalid. Check PAYSTACK_SECRET_KEY on the server.';
  }
  return msg || 'Could not send withdrawal to Mobile Money.';
}

export async function createMobileMoneyRecipient(args: {
  name: string;
  phone: string;
  provider: string;
}): Promise<{ recipientCode: string }> {
  const phone = toPaystackPhone(args.phone);
  const bankCode = toPaystackMomoBankCode(args.provider);

  const { ok, status: httpStatus, data } = await paystackFetch('/transferrecipient', {
    method: 'POST',
    body: JSON.stringify({
      type: 'mobile_money',
      name: args.name,
      account_number: phone,
      bank_code: bankCode,
      currency: 'GHS',
    }),
  });

  const recipientCode = data?.data?.recipient_code as string | undefined;
  if (ok && data?.status === true && recipientCode) {
    return { recipientCode };
  }

  console.error('[paystack] create recipient failed', {
    httpStatus,
    message: data?.message,
    phone,
    bankCode,
  });
  throw new Error(friendlyTransferError(data?.message, httpStatus));
}

export type TransferResult = {
  reference: string;
  transferCode?: string;
  status: string;
};

export async function initiateTransfer(args: {
  amountGhs: number;
  recipientCode: string;
  reference: string;
  reason: string;
}): Promise<TransferResult> {
  const amountPesewas = Math.round(args.amountGhs * 100);
  // Paystack requires lowercase alphanumeric + _ -
  const reference = args.reference.toLowerCase();

  const { ok, status: httpStatus, data } = await paystackFetch('/transfer', {
    method: 'POST',
    body: JSON.stringify({
      source: 'balance',
      amount: amountPesewas,
      recipient: args.recipientCode,
      reason: args.reason,
      currency: 'GHS',
      reference,
    }),
  });

  const payload = data?.data;
  if (ok && data?.status === true && payload) {
    return {
      reference: payload.reference || reference,
      transferCode: payload.transfer_code,
      status: String(payload.status || 'pending').toLowerCase(),
    };
  }

  console.error('[paystack] transfer failed', {
    httpStatus,
    message: data?.message,
    payload,
  });
  throw new Error(friendlyTransferError(payload?.message || data?.message, httpStatus));
}

export async function verifyTransfer(reference: string) {
  const { ok, data } = await paystackFetch(
    `/transfer/verify/${encodeURIComponent(reference.toLowerCase())}`
  );
  if (!ok || !data.status) {
    throw new Error(data?.message || 'Paystack transfer verify failed');
  }
  return data.data as {
    status: string;
    reference: string;
    transfer_code?: string;
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
