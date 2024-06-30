import React, { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { useQuery } from 'react-query';

const fetchTransactions = async () => {
    const response = await fetch('http://localhost:4000/transactions'); // Adjust URL as per your server setup
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
}

export const MainTable: React.FC<Props> = ({ selectedStatus, selectedType }) => {
    const { data: transactions, isLoading, error } = useQuery<IServerTransactionData[]>('transactions', fetchTransactions);
    const [sortBy, setSortBy] = useState<string>(''); // Column to sort by
    const [sortAsc, setSortAsc] = useState<boolean>(true); // Sort direction

    const handleEditItem = (id: number) => {
        console.log('Edit clicked for ID:', id);
    };

    const handleRemoveItem = (id: number) => {
        console.log('Delete clicked for ID:', id);
    };

    // Filter transactions based on selectedStatus and selectedType
    const filteredTransactions = transactions?.filter((transaction) => {
        if (selectedStatus && transaction.status.toLowerCase() !== selectedStatus.toLowerCase()) return false;
        if (selectedType && transaction.type.toLowerCase() !== selectedType.toLowerCase()) return false;
        return true;
    });

    // Function to handle sorting
    const handleSort = (column: string) => {
        if (column === sortBy) {
            setSortAsc(!sortAsc); // Toggle sort direction if same column clicked
        } else {
            setSortBy(column);
            setSortAsc(true); // Default to ascending order on new column
        }
    };

    // Sort function
    const sortedTransactions = [...(filteredTransactions || [])].sort((a, b) => {
        if (sortBy === 'status') {
            return sortAsc ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
        } else if (sortBy === 'type') {
            return sortAsc ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type);
        } else if (sortBy === 'clientName') {
            return sortAsc ? a.clientName.localeCompare(b.clientName) : b.clientName.localeCompare(a.clientName);
        }
        return 0;
    });

    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>Error: {JSON.stringify(error)}</div>;

    if (!transactions) return <div>No data available</div>;

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
                {sortedTransactions.map((transaction: IServerTransactionData) => (
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
                ))}
            </Tbody>
        </Table>
    );
};
