import { useState } from 'react';
import { MainHeader } from "./mainHeader/MainHeader";
import { MainTable } from "./mainTable/MainTable";
import { Pagination } from "./pagination/Pagination";

export const Main = () => {
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');

    const handleUploadComplete = () => {
        console.log('fileUploaded');
    };

    return (
        <div className="main">
            <MainHeader
                onUpload={handleUploadComplete}
                onStatusChange={setSelectedStatus}
                onTypeChange={setSelectedType}
            />
            <MainTable selectedStatus={selectedStatus} selectedType={selectedType} />
            <Pagination />
        </div>
    );
};
