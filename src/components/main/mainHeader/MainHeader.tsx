// import { Button, Input, Select } from '@chakra-ui/react';
// import { useState } from 'react';
// import { useDisclosure } from '@chakra-ui/react';
// import { parse } from 'papaparse';
// import { useTransactions } from '../../../utils/context/TransactionContext';
// import './MainHeader.css';

// export const MainHeader = () => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [file, setFile] = useState<File | null>(null);
//   const { mutation } = useTransactions();

//   const handleExport = () => alert('Export');

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const handleFileUpload = () => {
//     if (file) {
//       if (file.type !== 'text/csv') {
//         console.error('Wrong format');
//         return;
//       }

//       parse(file, {
//         complete: (result) => {
//           console.log('Parsed CSV:', result.data);
//           mutation.mutate(result.data); // Save parsed data using mutation
//         },
//         header: true,
//         skipEmptyLines: true,
//       });
//       onClose();
//     }
//   };

//   return (
//     <div className='main-header-btns'>
//       {isOpen && (
//         <div className='modal'>
//           <div className='modal-content'>
//             <Button onClick={onClose}>Close</Button>
//             <Input className='modal-input' type="file" accept=".csv" onChange={handleFileChange} />
//             <Button onClick={handleFileUpload}>Upload</Button>
//           </div>
//         </div>
//       )}
//       <Select placeholder='Status'>
//         <option value='pending'>Pending</option>
//         <option value='completed'>Completed</option>
//         <option value='cancelled'>Cancelled</option>
//       </Select>
//       <Select placeholder='Type'>
//         <option value='refill'>Refill</option>
//         <option value='withdrawal'>Withdrawal</option>
//       </Select>
//       <Button className='btn' onClick={onOpen}>Import</Button>
//       <Button className='btn' onClick={handleExport}>Export</Button>
//     </div>
//   );
// };

import { Button, Input, Select } from '@chakra-ui/react';
import { useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { parse } from 'papaparse';
import { Transaction, useTransactions } from '../../../utils/context/TransactionContext';
import './MainHeader.css';

export const MainHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = useState<File | null>(null);
  const { mutation } = useTransactions();

  const handleExport = () => alert('Export');

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
      onClose();
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
      <Select placeholder='Status'>
        <option value='pending'>Pending</option>
        <option value='completed'>Completed</option>
        <option value='cancelled'>Cancelled</option>
      </Select>
      <Select placeholder='Type'>
        <option value='refill'>Refill</option>
        <option value='withdrawal'>Withdrawal</option>
      </Select>
      <Button className='btn' onClick={onOpen}>Import</Button>
      <Button className='btn' onClick={handleExport}>Export</Button>
    </div>
  );
};
