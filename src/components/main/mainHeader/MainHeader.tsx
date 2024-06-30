import { Button, Input, Select, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { parse } from 'papaparse';
import { Transaction, useTransactions } from '../../../utils/context/TransactionContext';
import './MainHeader.css';

interface MainHeaderProps {
  onUpload: () => void;
  onStatusChange: React.Dispatch<React.SetStateAction<string>>;
  onTypeChange: React.Dispatch<React.SetStateAction<string>>;
}

export const MainHeader: React.FC<MainHeaderProps> = ({ onUpload, onStatusChange, onTypeChange }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = useState<File | null>(null);
  const { mutation } = useTransactions();
  const toast = useToast();

  const handleExport = () => alert('Export');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (file) {
      if (file.type !== 'text/csv') {
        toast({
          title: 'Can\'t upload file: wrong format',
          position: 'top-right',
          isClosable: true,
          status: 'error',
        }); return;
      }

      parse(file, {
        complete: (result) => {
          console.log('Parsed CSV:', result.data);
          //eslint-disable-next-line
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
