import { apiRequest } from './apiClient';
import { Driver, MoMoProvider } from '../types';

export type WithdrawalRecord = {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  provider?: string;
  momoPhone?: string;
  reference?: string;
  failureReason?: string;
  createdAt: string;
};

export type WithdrawResult = {
  withdrawalId: string;
  reference: string;
  status: string;
  displayText?: string;
  withdrawal: WithdrawalRecord;
  wallet: Driver;
};

export async function initiateWithdrawal(input: {
  amount: number;
  provider: MoMoProvider;
  momoPhone: string;
}): Promise<WithdrawResult> {
  return apiRequest('/api/drivers/me/withdraw', {
    method: 'POST',
    body: input,
  });
}

export async function pollWithdrawalStatus(withdrawalId: string): Promise<{
  withdrawalId: string;
  status: string;
  withdrawal: WithdrawalRecord;
  wallet: Driver;
}> {
  return apiRequest(`/api/drivers/me/withdrawals/${encodeURIComponent(withdrawalId)}`);
}

/** Poll until completed/failed or timeout */
export async function waitForWithdrawal(
  withdrawalId: string,
  opts: { intervalMs?: number; timeoutMs?: number; onTick?: (status: string) => void } = {}
): Promise<{ withdrawal: WithdrawalRecord; wallet: Driver }> {
  const intervalMs = opts.intervalMs ?? 2500;
  const timeoutMs = opts.timeoutMs ?? 90000;
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const result = await pollWithdrawalStatus(withdrawalId);
    opts.onTick?.(result.status);
    if (result.status === 'completed') {
      return { withdrawal: result.withdrawal, wallet: result.wallet };
    }
    if (result.status === 'failed') {
      throw new Error(result.withdrawal.failureReason || 'Withdrawal failed');
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  throw new Error('Timed out waiting for withdrawal. Check your balance and try again.');
}
