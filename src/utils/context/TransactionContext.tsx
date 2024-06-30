import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchTransactions, postTransactions } from '../transactionUtils';

export interface Transaction {
  id: number;
  status: string;
  type: string;
  clientName: string;
  amount: number;
}

interface TransactionContextType {
  transactions: Transaction[] | undefined;
  isLoading: boolean;
  mutation: {
    mutate: (transactions: Transaction[]) => void;
  };
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery<Transaction[]>('transactions', fetchTransactions);

  const mutation = useMutation(postTransactions, {
    onSuccess: () => {
      queryClient.invalidateQueries('transactions');
    }
  });

  return (
    <TransactionContext.Provider value={{ transactions, isLoading, mutation }}>
      {children}
    </TransactionContext.Provider>
  );
};

//eslint-disable-next-line
export const useTransactions = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
