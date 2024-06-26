import { ChakraProvider, Grid, GridItem } from '@chakra-ui/react';
import './App.css';
import { AsideMenu } from './components/menu/AsideMenu';
import theme from './theme/theme';
import { Main } from './components/main/Main';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Grid templateColumns="1fr 4fr" minH="100vh">
        <GridItem>
          <AsideMenu />
        </GridItem>
        <GridItem>
          <Main />
        </GridItem>
      </Grid>
    </ChakraProvider>
  );
}

export default App;
