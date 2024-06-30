import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import './MainTable.css';

const fetchTransactions = async () => {
  const response = await fetch('http://localhost:4000/transactions');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export interface IServerTransactionData {
  id: number;
  type: string;
  clientName: string;
  amount: string;
  status: string;
}

interface Props {
  selectedStatus?: string;
  selectedType?: string;
  currentPage: number;
  itemsPerPage: number;
  setTotalItemsNumber: React.Dispatch<React.SetStateAction<number>>;
  setDataToExport: React.Dispatch<React.SetStateAction<IServerTransactionData[]>>;
}

export const MainTable: React.FC<Props> = ({ selectedStatus, selectedType, currentPage, itemsPerPage, setTotalItemsNumber, setDataToExport }) => {
  const { data: transactions, isLoading, error } = useQuery<IServerTransactionData[]>('transactions', fetchTransactions);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [filteredTransactions, setFilteredTransactions] = useState<IServerTransactionData[]>([]);

  const handleEditItem = (id: number) => alert(id);

  const handleRemoveItem = (id: number) => alert(id);

  useEffect(() => {
    if (transactions) {
      const filteredData = transactions.filter((transaction) => {
        if (selectedStatus && transaction.status.toLowerCase() !== selectedStatus.toLowerCase()) return false;
        if (selectedType && transaction.type.toLowerCase() !== selectedType.toLowerCase()) return false;
        return true;
      });
      setFilteredTransactions(filteredData);
      setTotalItemsNumber(filteredData.length);
      setDataToExport(filteredData);
    }
  }, [transactions, selectedStatus, selectedType, setTotalItemsNumber, setDataToExport]);

  const handleSort = (column: string) => {
    if (column === sortBy) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(column);
      setSortAsc(true);
    }
  };

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'status') {
      return sortAsc ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
    } else if (sortBy === 'type') {
      return sortAsc ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type);
    } else if (sortBy === 'clientName') {
      return sortAsc ? a.clientName.localeCompare(b.clientName) : b.clientName.localeCompare(a.clientName);
    }
    return 0;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  return (
    <Table variant="simple" className="main-table">
      <Thead>
        <Tr>
          <Th>
            <Button variant='link' onClick={() => handleSort('status')}>
              Status {sortBy === 'status' && (sortAsc ? '▲' : '▼')}
            </Button>
          </Th>
          <Th>
            <Button variant='link' onClick={() => handleSort('type')}>
              Type {sortBy === 'type' && (sortAsc ? '▲' : '▼')}
            </Button>
          </Th>
          <Th>
            <Button variant='link' onClick={() => handleSort('clientName')}>
              Client Name {sortBy === 'clientName' && (sortAsc ? '▲' : '▼')}
            </Button>
          </Th>
          <Th>
            Amount
          </Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {paginatedTransactions.length ? (
          paginatedTransactions.map((transaction: IServerTransactionData) => (
            <Tr key={transaction.id}>
              <Td>{transaction.status}</Td>
              <Td>{transaction.type}</Td>
              <Td>{transaction.clientName}</Td>
              <Td>{transaction.amount}</Td>
              <Td>
                <Button sx={{ border: 'none' }} variant='ghost' onClick={() => handleEditItem(transaction.id)}>Edit</Button>
                <Button sx={{ border: 'none' }} variant='ghost' colorScheme='red' onClick={() => handleRemoveItem(transaction.id)}>Delete</Button>
              </Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan={5} sx={{ textAlign: 'center' }}>No data available</Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};
