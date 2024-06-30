import axios from 'axios';
import { Transaction } from './context/TransactionContext';

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await axios.get<Transaction[]>('http://localhost:4000/transactions');
  return response.data;
};

export const postTransactions = async (transactions: Transaction[]) => {
  await axios.post('http://localhost:4000/transactions', { transactions });
};
