import { generateTransactionId } from '../data/mockData';
import { MoMoProvider } from '../types';

interface MoMoPaymentArgs {
  provider: MoMoProvider;
  phone: string;
  amount: number;
}

interface PaymentResult {
  success: boolean;
  transactionRef?: string;
  provider?: string;
  amountPaid?: number;
  status: 'completed' | 'failed';
  error?: string;
}

const MOCK_MODE = process.env.EXPO_PUBLIC_MOCK_MODE !== 'false';

class PaymentService {
  async processMoMoPayment({ provider, phone, amount }: MoMoPaymentArgs): Promise<PaymentResult> {
    if (MOCK_MODE) {
      return this._mockProcessMoMo({ provider, phone, amount });
    }
    throw new Error('Live payment gateway not yet configured.');
  }

  private _mockProcessMoMo({ provider, phone, amount }: MoMoPaymentArgs): Promise<PaymentResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (amount <= 0) {
          resolve({ success: false, error: 'Invalid payment amount', status: 'failed' });
          return;
        }

        if (Math.random() > 0.05) {
          resolve({
            success: true,
            transactionRef: `MOMO_${generateTransactionId()}`,
            provider,
            amountPaid: amount,
            status: 'completed',
          });
        } else {
          resolve({
            success: false,
            error: 'User cancelled the MoMo prompt or insufficient funds',
            status: 'failed',
          });
        }
      }, 2500);
    });
  }
}

export default new PaymentService();
