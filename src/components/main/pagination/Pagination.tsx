import React from 'react';
import { Button, ButtonGroup } from '@chakra-ui/react';

interface PaginationProps {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, itemsPerPage = 10, totalItems, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (!totalItems) return;
    return (
        <ButtonGroup variant="outline" spacing="6" className="pagination">
            <Button onClick={() => onPageChange(1)} disabled={currentPage === 1}>First</Button>
            <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
            {Array.from({ length: totalPages }, (_, index) => (
                <Button
                    key={index + 1}
                    onClick={() => onPageChange(index + 1)}
                    disabled={currentPage === index + 1}>
                    {index + 1}
                </Button>
            ))}
            <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</Button>
            <Button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>Last</Button>
        </ButtonGroup>
    );
};
