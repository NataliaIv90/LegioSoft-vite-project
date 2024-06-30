import { useState } from 'react';
import { MainHeader } from "./mainHeader/MainHeader";
import { MainTable, IServerTransactionData } from "./mainTable/MainTable";
import { Pagination } from "./pagination/Pagination";

export const Main = () => {
	const [selectedStatus, setSelectedStatus] = useState<string>('');
	const [selectedType, setSelectedType] = useState<string>('');
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [itemsPerPage] = useState<number>(20);
	const [totalItemsNumber, setTotalItemsNumber] = useState<number>(1);
	const [dataToExport, setDataToExport] = useState<IServerTransactionData[]>([]);

	const handleUploadComplete = () => {
		console.log('fileUploaded');
	};

	return (
		<div className="main">
			<MainHeader
				onUpload={handleUploadComplete}
				onStatusChange={setSelectedStatus}
				onTypeChange={setSelectedType}
				dataToExport={dataToExport}
			/>
			<MainTable
				setDataToExport={setDataToExport}
				selectedStatus={selectedStatus}
				selectedType={selectedType}
				currentPage={currentPage}
				itemsPerPage={itemsPerPage}
				setTotalItemsNumber={setTotalItemsNumber}
			/>
			<Pagination
				currentPage={currentPage}
				itemsPerPage={itemsPerPage}
				totalItems={totalItemsNumber}
				onPageChange={(page) => setCurrentPage(page)}
			/>
		</div>
	);
};
