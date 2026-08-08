import { apiRequest } from './apiClient';
import { MoMoProvider, Transaction } from '../types';

export type InitiatePaymentResult = {
  paymentId: string;
  reference: string;
  status: string;
  displayText?: string;
  transaction: Transaction;
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
