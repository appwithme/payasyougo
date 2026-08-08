import { Role, TransactionStatus } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { chargeMobileMoney, verifyTransaction } from '../services/paystack';
import {
  completePaymentAndCreditWallet,
  decimalToNumber,
  markPaymentFailed,
} from '../services/wallet';
import { normalizePhone, normalizeProviderLabel, PAYSTACK_TEST_MTN_NUMBER, toPaystackProvider } from '../utils/helpers';
import { handleTransferWebhook } from './withdrawals.controller';

const initiateSchema = z.object({
  driverCode: z.string().min(3),
  from: z.string().min(1),
  to: z.string().min(1),
  provider: z.string().min(2),
  momoPhone: z.string().min(9),
  amount: z.number().positive().optional(),
});

function formatTxn(tx: {
  id: string;
  amount: any;
  status: TransactionStatus;
  paymentRef: string | null;
  provider: string | null;
  passengerRating: number | null;
  createdAt: Date;
  route: { fromLocation: string; toLocation: string };
  driver: { uniqueCode: string; user: { fullName: string } };
  passenger: { id: string; fullName: string };
}) {
  const date = tx.createdAt.toISOString().slice(0, 10);
  const time = tx.createdAt.toLocaleTimeString('en-GH', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    id: tx.id,
    kind: 'trip' as const,
    amount: decimalToNumber(tx.amount),
    from: tx.route.fromLocation,
    to: tx.route.toLocation,
    date,
    time,
    status: tx.status.toLowerCase() as 'completed' | 'pending' | 'failed',
    paymentRef: tx.paymentRef || undefined,
    provider: tx.provider || undefined,
    driverName: tx.driver.user.fullName,
    driverId: tx.driver.uniqueCode,
    passengerName: tx.passenger.fullName,
    passengerId: tx.passenger.id,
    passengerRating: tx.passengerRating ?? undefined,
  };
}

function formatWithdrawalTxn(w: {
  id: string;
  amount: any;
  status: TransactionStatus;
  provider: string | null;
  momoPhone: string | null;
  paystackRef: string | null;
  createdAt: Date;
}) {
  const date = w.createdAt.toISOString().slice(0, 10);
  const time = w.createdAt.toLocaleTimeString('en-GH', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const network = w.provider || 'Mobile Money';
  const phone = w.momoPhone || '';

  return {
    id: w.id,
    kind: 'withdrawal' as const,
    amount: decimalToNumber(w.amount),
    from: 'Wallet',
    to: phone ? `${network} ${phone}` : network,
    date,
    time,
    status: w.status.toLowerCase() as 'completed' | 'pending' | 'failed',
    paymentRef: w.paystackRef || undefined,
    provider: w.provider || undefined,
    passengerName: 'Withdrawal',
  };
}

const includeTxn = {
  route: true,
  driver: { include: { user: true } },
  passenger: true,
} as const;

export async function initiatePayment(passengerUserId: string, body: unknown) {
  const input = initiateSchema.parse(body);
  const momoPhone = normalizePhone(input.momoPhone);

  const passenger = await prisma.user.findUnique({ where: { id: passengerUserId } });
  if (!passenger || passenger.role !== Role.PASSENGER) {
    throw new AppError('Only passengers can initiate payments', 403);
  }

  const driver = await prisma.driver.findUnique({
    where: { uniqueCode: input.driverCode.toUpperCase() },
    include: { user: true },
  });
  if (!driver) throw new AppError('Driver not found', 404);

  const route = await prisma.route.findFirst({
    where: {
      fromLocation: input.from,
      toLocation: input.to,
      active: true,
    },
  });
  if (!route) throw new AppError('Route not found', 404);

  const fare = decimalToNumber(route.fare);
  if (input.amount != null && Math.abs(input.amount - fare) > 0.01) {
    throw new AppError('Amount does not match route fare');
  }

  const paystackProvider = toPaystackProvider(input.provider);
  const providerLabel = normalizeProviderLabel(input.provider);

  // Paystack sandbox only documents an MTN test number — don't pretend Telecel works with it
  if (
    paystackProvider !== 'mtn' &&
    momoPhone === PAYSTACK_TEST_MTN_NUMBER
  ) {
    throw new AppError(
      '0551234987 is Paystack’s MTN test number. Select MTN MoMo for test payments, or use a real Telecel number with live keys.',
      400
    );
  }

  const reference = `PAY_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const txn = await prisma.transaction.create({
    data: {
      passengerId: passenger.id,
      driverId: driver.id,
      routeId: route.id,
      amount: fare,
      status: TransactionStatus.PENDING,
      provider: providerLabel,
      momoPhone,
      paystackRef: reference,
    },
  });

  try {
    const charge = await chargeMobileMoney({
      email: passenger.email || `${passenger.phone}@payasyougo.app`,
      amountGhs: fare,
      phone: momoPhone,
      provider: input.provider,
      reference,
      metadata: {
        transactionId: txn.id,
        driverCode: driver.uniqueCode,
        from: route.fromLocation,
        to: route.toLocation,
      },
    });

    // MoMo is completed offline — pay_offline / pending means prompt was sent
    if (charge.status === 'success') {
      await completePaymentAndCreditWallet({
        transactionId: txn.id,
        paystackRef: charge.reference || reference,
        paymentRef: charge.reference || reference,
      });
    }

    const fresh = await prisma.transaction.findUniqueOrThrow({
      where: { id: txn.id },
      include: includeTxn,
    });

    const pending =
      fresh.status === TransactionStatus.PENDING ||
      charge.status === 'pay_offline' ||
      charge.status === 'pending' ||
      charge.status === 'send_otp';

    return {
      paymentId: txn.id,
      reference,
      status: fresh.status.toLowerCase(),
      displayText:
        charge.display_text ||
        (pending
          ? 'Approve the MoMo prompt on your phone'
          : 'Payment processing'),
      transaction: formatTxn(fresh),
    };
  } catch (err: any) {
    await markPaymentFailed(txn.id, reference);
    throw new AppError(err?.message || 'Failed to initiate Paystack MoMo charge', 502);
  }
}

export async function paymentStatus(userId: string, paymentId: string) {
  const txn = await prisma.transaction.findUnique({
    where: { id: paymentId },
    include: includeTxn,
  });
  if (!txn) throw new AppError('Payment not found', 404);

  const isPassenger = txn.passengerId === userId;
  const driver = await prisma.driver.findUnique({ where: { userId } });
  const isDriver = driver?.id === txn.driverId;
  if (!isPassenger && !isDriver) throw new AppError('Forbidden', 403);

  // Poll Paystack if still pending
  if (txn.status === TransactionStatus.PENDING && txn.paystackRef) {
    try {
      const verified = await verifyTransaction(txn.paystackRef);
      if (verified.status === 'success') {
        await completePaymentAndCreditWallet({
          transactionId: txn.id,
          paystackRef: verified.reference,
          paymentRef: verified.reference,
        });
      } else if (verified.status === 'failed' || verified.status === 'abandoned') {
        await markPaymentFailed(txn.id, verified.reference);
      }
    } catch {
      // leave pending; client can retry
    }
  }

  const fresh = await prisma.transaction.findUniqueOrThrow({
    where: { id: paymentId },
    include: includeTxn,
  });

  return {
    paymentId: fresh.id,
    status: fresh.status.toLowerCase(),
    transaction: formatTxn(fresh),
  };
}

export async function handleWebhookEvent(event: any) {
  const eventName = event?.event as string | undefined;
  const data = event?.data;
  if (!data?.reference) return { handled: false };

  if (typeof eventName === 'string' && eventName.startsWith('transfer.')) {
    return handleTransferWebhook(event);
  }

  const txn = await prisma.transaction.findFirst({
    where: { paystackRef: data.reference },
  });
  if (!txn) {
    // Fallback: some accounts emit transfer updates without a transfer.* event name
    const transferResult = await handleTransferWebhook(event);
    if (transferResult.handled) return transferResult;
    return { handled: false, reason: 'unknown_reference' };
  }

  if (eventName === 'charge.success' || data.status === 'success') {
    await completePaymentAndCreditWallet({
      transactionId: txn.id,
      paystackRef: data.reference,
      paymentRef: data.reference,
    });
    return { handled: true, status: 'completed' };
  }

  if (data.status === 'failed') {
    await markPaymentFailed(txn.id, data.reference);
    return { handled: true, status: 'failed' };
  }

  return { handled: false };
}

export async function listTransactions(userId: string, role: Role) {
  if (role === Role.PASSENGER) {
    const rows = await prisma.transaction.findMany({
      where: { passengerId: userId },
      include: includeTxn,
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(formatTxn);
  }

  const driver = await prisma.driver.findUnique({ where: { userId } });
  if (!driver) throw new AppError('Driver profile not found', 404);

  const [rows, withdrawals] = await Promise.all([
    prisma.transaction.findMany({
      where: { driverId: driver.id },
      include: includeTxn,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.withdrawal.findMany({
      where: { driverId: driver.id },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const merged = [
    ...rows.map((tx) => ({ at: tx.createdAt.getTime(), item: formatTxn(tx) })),
    ...withdrawals.map((w) => ({
      at: w.createdAt.getTime(),
      item: formatWithdrawalTxn(w),
    })),
  ].sort((a, b) => b.at - a.at);

  return merged.map((m) => m.item);
}

const rateSchema = z.object({
  stars: z.number().int().min(1).max(5),
});

/** Passenger rates the driver after a completed trip. Updates live average. */
export async function rateTransaction(
  passengerUserId: string,
  transactionId: string,
  body: unknown
) {
  const { stars } = rateSchema.parse(body);

  const txn = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { driver: true },
  });
  if (!txn) throw new AppError('Trip not found', 404);
  if (txn.passengerId !== passengerUserId) throw new AppError('Forbidden', 403);
  if (txn.status !== TransactionStatus.COMPLETED) {
    throw new AppError('You can only rate completed trips');
  }
  if (txn.passengerRating != null) {
    throw new AppError('This trip was already rated');
  }

  const previousCount = txn.driver.ratingCount;
  const previousAvg = txn.driver.rating;
  const nextCount = previousCount + 1;
  const nextAvg =
    previousCount === 0
      ? stars
      : Math.round(((previousAvg * previousCount + stars) / nextCount) * 10) / 10;

  const [updatedTxn] = await prisma.$transaction([
    prisma.transaction.update({
      where: { id: txn.id },
      data: {
        passengerRating: stars,
        ratedAt: new Date(),
      },
      include: includeTxn,
    }),
    prisma.driver.update({
      where: { id: txn.driverId },
      data: {
        rating: nextAvg,
        ratingCount: nextCount,
      },
    }),
  ]);

  return {
    transaction: formatTxn(updatedTxn),
    driverRating: nextAvg,
    ratingCount: nextCount,
    yourRating: stars,
  };
}
