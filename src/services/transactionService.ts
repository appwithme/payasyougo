import { Transaction } from '../types';
import { generateTransactionId } from '../data/mockData';

interface TransactionArgs {
  passengerId: string;
  passengerName: string;
  driverId: string;
  driverName: string;
  from: string;
  to: string;
  fare: number;
  paymentRef?: string;
  provider?: string;
}

class TransactionService {
  createTransactionRecord({
    passengerId,
    passengerName,
    driverId,
    driverName,
    from,
    to,
    fare,
    paymentRef,
    provider,
  }: TransactionArgs): { driverRecord: Transaction; passengerRecord: Transaction } {
    const txnId = generateTransactionId();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const baseRecord: Partial<Transaction> = {
      id: txnId,
      amount: fare,
      from,
      to,
      date: dateStr,
      time: timeStr,
      status: 'completed',
      paymentRef,
      provider,
    };

    const driverRecord: Transaction = {
      ...baseRecord,
      passengerName,
      passengerId,
    } as Transaction;

    const passengerRecord: Transaction = {
      ...baseRecord,
      driverName,
      driverId,
    } as Transaction;

    return {
      driverRecord,
      passengerRecord,
    };
  }
}

export default new TransactionService();
