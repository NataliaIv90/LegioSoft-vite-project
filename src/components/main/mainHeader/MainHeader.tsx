import { Button, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { parse } from 'papaparse';
import { useTransactions } from '../../../utils/context/TransactionContext';

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

      parse(file, {
        complete: (result) => {
          console.log('Parsed CSV:', result.data);
          mutation.mutate(result.data); // Save parsed data using mutation
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
          <Button onClick={handleFileUpload}>Upload</Button>
        </div>
      )}
    </div>
  );
};
