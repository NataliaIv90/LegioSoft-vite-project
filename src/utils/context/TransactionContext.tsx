import { createContext, useContext, useState, ReactNode } from 'react';
import { useMutation, useQueryClient } from 'react-query';

interface Transaction {
  id: number;
  status: string;
  type: string;
  clientName: string;
  amount: number;
}

interface TransactionContextType {
  transactions: Transaction[];
  //eslint-disable-next-line
  mutation: any;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const queryClient = useQueryClient();

  const mutation = useMutation<Transaction[], unknown, Transaction[]>((newTransactions) => {
    setTransactions((prev) => [...prev, ...newTransactions]);
    return Promise.resolve(newTransactions);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('transactions');
    }
  });

  return (
    <TransactionContext.Provider value={{ transactions, mutation }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
