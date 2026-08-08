import { Decimal } from '@prisma/client/runtime/library';
import { TransactionStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';

export function decimalToNumber(value: Decimal | number | string): number {
  return Number(value);
}

export async function completePaymentAndCreditWallet(opts: {
  transactionId: string;
  paystackRef: string;
  paymentRef?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.transaction.findUnique({
      where: { id: opts.transactionId },
    });

    if (!existing) {
      throw new Error('Transaction not found');
    }

    if (existing.status === TransactionStatus.COMPLETED) {
      return existing;
    }

    if (existing.status === TransactionStatus.FAILED) {
      throw new Error('Cannot complete a failed transaction');
    }

    const updated = await tx.transaction.update({
      where: { id: opts.transactionId },
      data: {
        status: TransactionStatus.COMPLETED,
        paystackRef: opts.paystackRef,
        paymentRef: opts.paymentRef || opts.paystackRef,
      },
    });

    await tx.driver.update({
      where: { id: existing.driverId },
      data: {
        walletBalance: { increment: existing.amount },
        todayEarnings: { increment: existing.amount },
        totalTrips: { increment: 1 },
      },
    });

    return updated;
  });
}

export async function markPaymentFailed(transactionId: string, paystackRef?: string) {
  return prisma.transaction.update({
    where: { id: transactionId },
    data: {
      status: TransactionStatus.FAILED,
      ...(paystackRef ? { paystackRef } : {}),
    },
  });
}

/** Reserve funds by creating a PENDING withdrawal and debiting the wallet atomically. */
export async function createPendingWithdrawal(opts: {
  driverId: string;
  amountGhs: number;
  provider: string;
  momoPhone: string;
  paystackRef: string;
}) {
  return prisma.$transaction(
    async (tx) => {
      const debited = await tx.driver.updateMany({
        where: {
          id: opts.driverId,
          walletBalance: { gte: opts.amountGhs },
        },
        data: {
          walletBalance: { decrement: opts.amountGhs },
        },
      });

      if (debited.count === 0) {
        throw new Error('Insufficient wallet balance');
      }

      return tx.withdrawal.create({
        data: {
          driverId: opts.driverId,
          amount: opts.amountGhs,
          status: TransactionStatus.PENDING,
          provider: opts.provider,
          momoPhone: opts.momoPhone,
          paystackRef: opts.paystackRef,
        },
      });
    },
    { maxWait: 10_000, timeout: 20_000 }
  );
}

export async function completeWithdrawal(opts: {
  withdrawalId: string;
  paystackRef?: string;
  transferCode?: string;
  recipientCode?: string;
}) {
  return prisma.$transaction(
    async (tx) => {
      const existing = await tx.withdrawal.findUnique({
        where: { id: opts.withdrawalId },
      });
      if (!existing) throw new Error('Withdrawal not found');
      if (existing.status === TransactionStatus.COMPLETED) return existing;
      if (existing.status === TransactionStatus.FAILED) {
        throw new Error('Cannot complete a failed withdrawal');
      }

      return tx.withdrawal.update({
        where: { id: opts.withdrawalId },
        data: {
          status: TransactionStatus.COMPLETED,
          ...(opts.paystackRef ? { paystackRef: opts.paystackRef } : {}),
          ...(opts.transferCode ? { transferCode: opts.transferCode } : {}),
          ...(opts.recipientCode ? { recipientCode: opts.recipientCode } : {}),
          failureReason: null,
        },
      });
    },
    { maxWait: 10_000, timeout: 20_000 }
  );
}

/** Mark withdrawal failed and refund the reserved wallet amount (idempotent). */
export async function failAndRefundWithdrawal(opts: {
  withdrawalId: string;
  reason?: string;
  paystackRef?: string;
  transferCode?: string;
}) {
  return prisma.$transaction(
    async (tx) => {
      const existing = await tx.withdrawal.findUnique({
        where: { id: opts.withdrawalId },
      });
      if (!existing) throw new Error('Withdrawal not found');
      if (existing.status === TransactionStatus.FAILED) return existing;
      if (existing.status === TransactionStatus.COMPLETED) {
        throw new Error('Cannot fail a completed withdrawal');
      }

      const updated = await tx.withdrawal.update({
        where: { id: opts.withdrawalId },
        data: {
          status: TransactionStatus.FAILED,
          failureReason: (opts.reason || 'Transfer failed').slice(0, 500),
          ...(opts.paystackRef ? { paystackRef: opts.paystackRef } : {}),
          ...(opts.transferCode ? { transferCode: opts.transferCode } : {}),
        },
      });

      await tx.driver.update({
        where: { id: existing.driverId },
        data: {
          walletBalance: { increment: existing.amount },
        },
      });

      return updated;
    },
    { maxWait: 10_000, timeout: 20_000 }
  );
}

export async function attachWithdrawalRecipient(
  withdrawalId: string,
  recipientCode: string
) {
  return prisma.withdrawal.update({
    where: { id: withdrawalId },
    data: { recipientCode },
  });
}
