import { ChakraProvider, Grid, GridItem } from '@chakra-ui/react';
import './App.css';
import { AsideMenu } from '../menu/AsideMenu';
import theme from '../../theme/theme';
import { Main } from '../main/Main';
import { TransactionProvider } from '../../utils/context/TransactionContext';
import { QueryClientProvider } from 'react-query';
import queryClient from '../../utils/queryClient';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <TransactionProvider>
          <Grid templateColumns="1fr 4fr" minH="100vh">
            <GridItem>
              <AsideMenu />
            </GridItem>
            <GridItem>
              <Main />
            </GridItem>
          </Grid>
        </TransactionProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
