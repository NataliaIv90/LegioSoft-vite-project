import React from 'react';
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

    const handleEditItem = (id: number) => {
        console.log('Edit clicked for ID:', id);
    }

    const handleRemoveItem = (id: number) => {
        console.log('Delete clicked for ID:', id);
    }

    // Filter transactions based on selectedStatus and selectedType
    const filteredTransactions = transactions?.filter((transaction) => {
        if (selectedStatus && transaction.status.toLowerCase() !== selectedStatus.toLowerCase()) return false;
        if (selectedType && transaction.type.toLowerCase() !== selectedType.toLowerCase()) return false;
        return true;
    });

    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>Error: {JSON.stringify(error)}</div>;

    if (!transactions) return <div>No data available</div>;

    return (
        <Table variant="simple" className="main-table">
            <Thead>
                <Tr>
                    <Th>Status</Th>
                    <Th>Type</Th>
                    <Th>Client Name</Th>
                    <Th>Amount</Th>
                    <Th>Actions</Th>
                </Tr>
            </Thead>
            <Tbody>
                {filteredTransactions?.map((transaction: IServerTransactionData) => (
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
