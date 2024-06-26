import { Box, Button, VStack } from '@chakra-ui/react';

export const AsideMenu = () => (
    <Box className='menu' px={4} py={4} w='200px' h='100vh'>
        <VStack align='stretch'>
            <Button
                w='100%'
            >
                Transactions
            </Button>
        </VStack>
    </Box >
);
