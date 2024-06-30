import { Button, Input, Select, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { parse } from 'papaparse';
import { Transaction, useTransactions } from '../../../utils/context/TransactionContext';
import './MainHeader.css';
import { IServerTransactionData } from '../mainTable/MainTable';

interface MainHeaderProps {
  onUpload: () => void;
  onStatusChange: React.Dispatch<React.SetStateAction<string>>;
  onTypeChange: React.Dispatch<React.SetStateAction<string>>;
  dataToExport: IServerTransactionData[];
}

export const MainHeader: React.FC<MainHeaderProps> = ({ onUpload, onStatusChange, onTypeChange, dataToExport }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = useState<File | null>(null);
  const { mutation } = useTransactions();
  const toast = useToast();

  useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(file.name);
      }
    };
  }, [file]);

  const handleExport = () => {
    if (dataToExport.length === 0) {
      toast({
        title: 'No data to export.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const csvContent = convertToCSV(dataToExport);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'transactions.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('CSV export is not supported in this browser.');
    }
  };

  const convertToCSV = (data: IServerTransactionData[]) => {
    const header = Object.keys(data[0]);
    const csv = [
      header.join(','), // Header row
      ...data.map((row) => header.map((fieldName) => JSON.stringify(row[fieldName])).join(',')),
    ].join('\r\n');
    return csv;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (file) {
      if (file.type !== 'text/csv') {
        toast({
          title: "Can't upload file: wrong format",
          position: 'top-right',
          isClosable: true,
          status: 'error',
        });
        return;
      }

      parse(file, {
        complete: (result) => {
          console.log('Parsed CSV:', result.data);
          const transactions = result.data.map((tx: any) => ({
            id: tx.TransactionId,
            status: tx.Status,
            type: tx.Type,
            clientName: tx.ClientName,
            amount: tx.Amount,
          }));
          mutation.mutate(transactions as Transaction[]);
        },
        header: true,
        skipEmptyLines: true,
      });

      toast({
        title: 'File upload status: success',
        position: 'top-right',
        isClosable: true,
      });
      onStatusChange('');
      onTypeChange('');
      onClose();
      onUpload();
      setFile(null); // Reset the file input after upload
    }
  };

  return (
    <div className='main-header-btns'>
      {isOpen && (
        <div className='modal'>
          <div className='modal-content'>
            <Button onClick={onClose}>Close</Button>
            <Input className='modal-input' type="file" accept=".csv" onChange={handleFileChange} />
            <Button onClick={handleFileUpload}>Upload</Button>
          </div>
        </div>
      )}
      <Select
        placeholder='Status'
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value='pending'>Pending</option>
        <option value='completed'>Completed</option>
        <option value='cancelled'>Cancelled</option>
      </Select>
      <Select
        placeholder='Type'
        onChange={(e) => onTypeChange(e.target.value)}
      >
        <option value='refill'>Refill</option>
        <option value='withdrawal'>Withdrawal</option>
      </Select>
      <Button className='btn' onClick={onOpen}>Import</Button>
      <Button className='btn' onClick={handleExport}>Export</Button>
    </div>
  );
};
