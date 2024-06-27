import { Button, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { parse } from 'papaparse';
import { useTransactions } from '../../../utils/context/TransactionContext';

interface TransactionCSV {
  TransactionId: string;
  Status: string;
  Type: string;
  ClientName: string;
  Amount: string;
}

export const MainHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = useState<File | null>(null);
  const { mutation } = useTransactions();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (file) {
      if (file.type !== 'text/csv') {
        console.error('Wrong format');
        return;
      }

      parse<TransactionCSV>(file, {
        complete: (result) => {
          const transactions = result.data.map((row) => ({
            id: Number(row.TransactionId),
            status: row.Status,
            type: row.Type,
            clientName: row.ClientName,
            amount: parseFloat(row.Amount.replace('$', '')),
          }));
          mutation.mutate(transactions);
        },
        header: true,
        skipEmptyLines: true,
      });
      onClose();
    }
  };

  return (
    <div>
      <Button onClick={onOpen}>Import</Button>
      {isOpen && (
        <div>
          <Input type="file" accept=".csv" onChange={handleFileChange} />
          <Button onClick={handleFileUpload}>Upload file</Button>
        </div>
      )}
    </div>
  );
};
