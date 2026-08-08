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
