import { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';

interface Transaction {
  id: number;
  status: string;
  type: string;
  clientName: string;
  amount: number;
}

//eslint-disable-next-line
const TransactionContext = createContext<any>(null);

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery<Transaction[]>('transactions', () =>
    Promise.resolve([]) // Initial empty array
  );

  const mutation = useMutation((newTransactions: Transaction[]) => {
    return Promise.resolve(newTransactions);
  }, {
    onSuccess: (newTransactions) => {
      queryClient.setQueryData('transactions', (old: Transaction[] | undefined) => {
        return [...(old || []), ...newTransactions];
      });
    }
  });

  return (
    <TransactionContext.Provider value={{ transactions, isLoading, mutation }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  return useContext(TransactionContext);
};
