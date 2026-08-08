import { initiateMoMoPayment, waitForPayment } from './paymentsService';
import { MoMoProvider, Transaction } from '../types';

export type PaymentResult = {
  success: boolean;
  transaction?: Transaction;
  transactionRef?: string;
  provider?: string;
  amountPaid?: number;
  status: 'completed' | 'failed';
  error?: string;
};

class PaymentService {
  private providerLabel(provider: MoMoProvider): string {
    if (provider === 'TELECEL') return 'Telecel Cash';
    return 'MTN MoMo';
  }

  async processMoMoPayment(args: {
    provider: MoMoProvider;
    phone: string;
    amount: number;
    driverCode: string;
    from: string;
    to: string;
    onStatus?: (msg: string) => void;
  }): Promise<PaymentResult> {
    try {
      args.onStatus?.(`Authorizing on ${this.providerLabel(args.provider)}…`);
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
}

export default new PaymentService();
