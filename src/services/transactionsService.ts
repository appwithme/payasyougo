import { apiRequest } from './apiClient';
import { Transaction } from '../types';

export async function fetchTransactions(): Promise<Transaction[]> {
  const res = await apiRequest<{ transactions: Transaction[] }>('/api/transactions');
  return res.transactions;
}
