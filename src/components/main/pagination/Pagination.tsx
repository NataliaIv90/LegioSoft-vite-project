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

    if (!totalItems) return null;

    // Determine the start and end pages
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    return (
        <ButtonGroup variant="outline" spacing="2" className="pagination">
            <Button
                onClick={() => onPageChange(1)} isDisabled={currentPage === 1}>First</Button>
            <Button
                onClick={() => {
                    if (currentPage > 1) onPageChange(currentPage - 1)
                }}
                isDisabled={currentPage === 1}
            >
                Previous
            </Button>

            {startPage > 1 && (
                <Button
                    onClick={() => onPageChange(1)}
                >
                    1
                </Button>
            )}

            {startPage > 2 && <span>...</span>}

            {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
                <Button
                    key={startPage + index}
                    onClick={() => onPageChange(startPage + index)}
                    isDisabled={currentPage === startPage + index}
                    isActive={currentPage === startPage + index}
                >
                    {startPage + index}
                </Button>
            ))}

            {endPage < totalPages - 1 && <span>...</span>}

            {endPage < totalPages && (
                <Button
                    onClick={() => onPageChange(totalPages)}
                >
                    {totalPages}
                </Button>
            )}

            <Button
                onClick={() => {
                    if (currentPage < totalPages) onPageChange(currentPage + 1)
                }}
                isDisabled={currentPage === totalPages}
            >
                Next
            </Button>
            <Button
                onClick={() => onPageChange(totalPages)}
                isDisabled={currentPage === totalPages}
            >
                Last
            </Button>
        </ButtonGroup>
    );
};
