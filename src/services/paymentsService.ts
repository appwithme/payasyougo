import { apiRequest } from './apiClient';
import { MoMoProvider, Transaction } from '../types';

export type InitiatePaymentResult = {
  paymentId: string;
  reference: string;
  status: string;
  displayText?: string;
  transaction: Transaction;
};

export type PaymentResult = {
  success: boolean;
  transaction?: Transaction;
  transactionRef?: string;
  provider?: string;
  amountPaid?: number;
  status: 'completed' | 'failed';
  error?: string;
};

export async function initiateMoMoPayment(input: {
  driverCode: string;
  from: string;
  to: string;
  provider: MoMoProvider;
  momoPhone: string;
  amount: number;
}): Promise<InitiatePaymentResult> {
  return apiRequest('/api/payments/initiate', {
    method: 'POST',
    body: input,
  });
}

export async function pollPaymentStatus(paymentId: string): Promise<{
  paymentId: string;
  status: string;
  transaction: Transaction;
}> {
  return apiRequest(`/api/payments/${paymentId}/status`);
}

/** Poll until completed/failed or timeout */
export async function waitForPayment(
  paymentId: string,
  opts: { intervalMs?: number; timeoutMs?: number; onTick?: (status: string) => void } = {}
): Promise<Transaction> {
  const intervalMs = opts.intervalMs ?? 2500;
  const timeoutMs = opts.timeoutMs ?? 90000;
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const result = await pollPaymentStatus(paymentId);
    opts.onTick?.(result.status);
    if (result.status === 'completed') return result.transaction;
    if (result.status === 'failed') {
      throw new Error('Payment failed or was cancelled');
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  throw new Error('Timed out waiting for MoMo approval');
}

function providerLabel(provider: MoMoProvider): string {
  if (provider === 'TELECEL') return 'Telecel Cash';
  return 'MTN MoMo';
}

/** Initiate + poll MoMo payment for the confirm-trip UI flow */
export async function processMoMoPayment(args: {
  provider: MoMoProvider;
  phone: string;
  amount: number;
  driverCode: string;
  from: string;
  to: string;
  onStatus?: (msg: string) => void;
}): Promise<PaymentResult> {
  try {
    args.onStatus?.(`Authorizing on ${providerLabel(args.provider)}…`);
    const initiated = await initiateMoMoPayment({
      driverCode: args.driverCode,
      from: args.from,
      to: args.to,
      provider: args.provider,
      momoPhone: args.phone,
      amount: args.amount,
    });

    if (initiated.status === 'completed') {
      return {
        success: true,
        transaction: initiated.transaction,
        transactionRef: initiated.reference,
        provider: args.provider,
        amountPaid: args.amount,
        status: 'completed',
      };
    }

    args.onStatus?.(initiated.displayText || 'Waiting for MoMo prompt...');
    const transaction = await waitForPayment(initiated.paymentId, {
      onTick: (status) => args.onStatus?.(`Payment ${status}...`),
    });

    return {
      success: true,
      transaction,
      transactionRef: transaction.paymentRef,
      provider: args.provider,
      amountPaid: args.amount,
      status: 'completed',
    };
  } catch (err: any) {
    return {
      success: false,
      status: 'failed',
      error: err?.message || 'Payment failed',
    };
  }
}

export async function rateDriverTrip(
  transactionId: string,
  stars: number
): Promise<{
  transaction: Transaction;
  driverRating: number;
  ratingCount: number;
  yourRating: number;
}> {
  return apiRequest(`/api/transactions/${encodeURIComponent(transactionId)}/rate`, {
    method: 'POST',
    body: { stars },
  });
}
