import { Role, TransactionStatus } from '@prisma/client';
import { z } from 'zod';
import { isWithdrawDemoMode } from '../config/env';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import {
  createMobileMoneyRecipient,
  initiateTransfer,
  verifyTransfer,
} from '../services/paystack';
import {
  attachWithdrawalRecipient,
  completeWithdrawal,
  createPendingWithdrawal,
  decimalToNumber,
  failAndRefundWithdrawal,
} from '../services/wallet';
import {
  normalizePhone,
  normalizeProviderLabel,
  PAYSTACK_TEST_MTN_NUMBER,
  toPaystackMomoBankCode,
} from '../utils/helpers';
import { myWallet } from './drivers.controller';

const withdrawSchema = z.object({
  amount: z.number().positive(),
  provider: z.string().min(2),
  momoPhone: z.string().min(9),
});

const MIN_WITHDRAW_GHS = 1;

function formatWithdrawal(row: {
  id: string;
  amount: any;
  status: TransactionStatus;
  provider: string | null;
  momoPhone: string | null;
  paystackRef: string | null;
  failureReason: string | null;
  createdAt: Date;
}) {
  return {
    id: row.id,
    amount: decimalToNumber(row.amount),
    status: row.status.toLowerCase() as 'pending' | 'completed' | 'failed',
    provider: row.provider || undefined,
    momoPhone: row.momoPhone || undefined,
    reference: row.paystackRef || undefined,
    failureReason: row.failureReason || undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function initiateWithdrawal(userId: string, body: unknown) {
  const input = withdrawSchema.parse(body);
  const amount = Math.round(input.amount * 100) / 100;
  const momoPhone = normalizePhone(input.momoPhone);
  const providerLabel = normalizeProviderLabel(input.provider);
  const demoMode = isWithdrawDemoMode();

  if (amount < MIN_WITHDRAW_GHS) {
    throw new AppError(`Minimum withdrawal is GH₵${MIN_WITHDRAW_GHS.toFixed(2)}`);
  }

  const bankCode = toPaystackMomoBankCode(input.provider);

  if (bankCode !== 'MTN' && momoPhone === PAYSTACK_TEST_MTN_NUMBER) {
    throw new AppError(
      '0551234987 is Paystack’s MTN test number. Select MTN MoMo for test withdrawals.',
      400
    );
  }

  const driver = await prisma.driver.findUnique({
    where: { userId },
    include: { user: true },
  });
  if (!driver || driver.user.role !== Role.DRIVER) {
    throw new AppError('Driver profile not found', 404);
  }

  const balance = decimalToNumber(driver.walletBalance);
  if (amount > balance + 0.001) {
    throw new AppError(`Insufficient balance. Available: GH₵${balance.toFixed(2)}`);
  }

  const reference = demoMode
    ? `wd_test_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    : `wd_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  let withdrawal;
  try {
    withdrawal = await createPendingWithdrawal({
      driverId: driver.id,
      amountGhs: amount,
      provider: providerLabel,
      momoPhone,
      paystackRef: reference,
    });
  } catch (err: any) {
    throw new AppError(err?.message || 'Could not reserve withdrawal amount', 400);
  }

  // sk_test_ / WITHDRAW_DEMO_MODE: Paystack Starter cannot Transfer — simulate MoMo payout.
  if (demoMode) {
    await completeWithdrawal({
      withdrawalId: withdrawal.id,
      paystackRef: reference,
      transferCode: `TEST_TRF_${withdrawal.id.slice(0, 8)}`,
      recipientCode: `TEST_RCP_${momoPhone}`,
    });

    const fresh = await prisma.withdrawal.findUniqueOrThrow({
      where: { id: withdrawal.id },
    });
    const wallet = await myWallet(userId);

    return {
      withdrawalId: fresh.id,
      reference: fresh.paystackRef || reference,
      status: fresh.status.toLowerCase(),
      displayText: `Test withdrawal of GH₵${amount.toFixed(2)} sent to ${providerLabel} ${momoPhone}.`,
      demo: true,
      withdrawal: formatWithdrawal(fresh),
      wallet,
    };
  }

  try {
    const recipient = await createMobileMoneyRecipient({
      name: driver.user.fullName,
      phone: momoPhone,
      provider: input.provider,
    });
    await attachWithdrawalRecipient(withdrawal.id, recipient.recipientCode);

    const transfer = await initiateTransfer({
      amountGhs: amount,
      recipientCode: recipient.recipientCode,
      reference,
      reason: `PayAsYouGo wallet withdrawal (${driver.uniqueCode})`,
    });

    if (transfer.transferCode) {
      await prisma.withdrawal.update({
        where: { id: withdrawal.id },
        data: { transferCode: transfer.transferCode },
      });
    }

    if (transfer.status === 'success') {
      await completeWithdrawal({
        withdrawalId: withdrawal.id,
        paystackRef: transfer.reference || reference,
        transferCode: transfer.transferCode,
        recipientCode: recipient.recipientCode,
      });
    } else if (transfer.status === 'failed' || transfer.status === 'reversed') {
      await failAndRefundWithdrawal({
        withdrawalId: withdrawal.id,
        reason: `Transfer ${transfer.status}`,
        paystackRef: transfer.reference || reference,
        transferCode: transfer.transferCode,
      });
    }

    const fresh = await prisma.withdrawal.findUniqueOrThrow({
      where: { id: withdrawal.id },
    });
    const wallet = await myWallet(userId);

    return {
      withdrawalId: fresh.id,
      reference: fresh.paystackRef || reference,
      status: fresh.status.toLowerCase(),
      displayText:
        fresh.status === TransactionStatus.COMPLETED
          ? 'Withdrawal sent to your MoMo wallet.'
          : fresh.status === TransactionStatus.FAILED
            ? fresh.failureReason || 'Withdrawal failed.'
            : 'Withdrawal processing. Funds will arrive shortly.',
      withdrawal: formatWithdrawal(fresh),
      wallet,
    };
  } catch (err: any) {
    const raw = err?.message || 'Transfer failed';
    const reason = friendlyPayoutError(raw);
    try {
      await failAndRefundWithdrawal({
        withdrawalId: withdrawal.id,
        reason,
        paystackRef: reference,
      });
    } catch (refundErr: any) {
      console.error('[withdraw] refund failed', refundErr?.message || refundErr);
    }
    throw new AppError(reason, 502);
  }
}

function friendlyPayoutError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('expired transaction') || lower.includes('transaction already closed')) {
    return 'Withdrawal timed out. Your balance was not taken — try again.';
  }
  if (
    lower.includes('third party payout') ||
    lower.includes('starter business') ||
    lower.includes('you cannot initiate')
  ) {
    return 'Paystack starter accounts cannot send MoMo payouts. Use sk_test_ keys (demo withdrawals) or enable Transfers.';
  }
  if (lower.includes('insufficient') && lower.includes('balance')) {
    return 'Paystack payout balance is too low. Fund your Paystack balance first.';
  }
  if (lower.includes('prisma') || lower.includes('transaction api')) {
    return 'Could not complete withdrawal. Please try again.';
  }
  return message;
}

export async function withdrawalStatus(userId: string, withdrawalId: string) {
  const driver = await prisma.driver.findUnique({ where: { userId } });
  if (!driver) throw new AppError('Driver profile not found', 404);

  const row = await prisma.withdrawal.findUnique({ where: { id: withdrawalId } });
  if (!row || row.driverId !== driver.id) {
    throw new AppError('Withdrawal not found', 404);
  }

  // Demo refs never hit Paystack verify
  if (
    row.status === TransactionStatus.PENDING &&
    row.paystackRef &&
    !row.paystackRef.startsWith('wd_test_')
  ) {
    try {
      const verified = await verifyTransfer(row.paystackRef);
      const status = String(verified.status || '').toLowerCase();
      if (status === 'success') {
        await completeWithdrawal({
          withdrawalId: row.id,
          paystackRef: verified.reference,
          transferCode: verified.transfer_code,
        });
      } else if (
        status === 'failed' ||
        status === 'reversed' ||
        status === 'abandoned'
      ) {
        await failAndRefundWithdrawal({
          withdrawalId: row.id,
          reason: `Transfer ${status}`,
          paystackRef: verified.reference,
          transferCode: verified.transfer_code,
        });
      }
    } catch {
      // leave pending; client can retry
    }
  }

  const fresh = await prisma.withdrawal.findUniqueOrThrow({
    where: { id: withdrawalId },
  });
  const wallet = await myWallet(userId);

  return {
    withdrawalId: fresh.id,
    status: fresh.status.toLowerCase(),
    withdrawal: formatWithdrawal(fresh),
    wallet,
  };
}

export async function handleTransferWebhook(event: any) {
  const eventName = event?.event as string | undefined;
  const data = event?.data;
  const reference = data?.reference as string | undefined;
  if (!reference) return { handled: false };

  const withdrawal = await prisma.withdrawal.findFirst({
    where: { paystackRef: reference.toLowerCase() },
  });
  if (!withdrawal) return { handled: false, reason: 'unknown_transfer_reference' };

  if (
    eventName === 'transfer.success' ||
    String(data?.status || '').toLowerCase() === 'success'
  ) {
    await completeWithdrawal({
      withdrawalId: withdrawal.id,
      paystackRef: reference.toLowerCase(),
      transferCode: data?.transfer_code,
    });
    return { handled: true, status: 'completed' };
  }

  if (
    eventName === 'transfer.failed' ||
    eventName === 'transfer.reversed' ||
    ['failed', 'reversed'].includes(String(data?.status || '').toLowerCase())
  ) {
    await failAndRefundWithdrawal({
      withdrawalId: withdrawal.id,
      reason: eventName || `Transfer ${data?.status}`,
      paystackRef: reference.toLowerCase(),
      transferCode: data?.transfer_code,
    });
    return { handled: true, status: 'failed' };
  }

  return { handled: false };
}
