import React from 'react';
import { Box, Flex, ChakraProvider } from '@chakra-ui/react';
import { Analytics } from '@vercel/analytics/react';
import theme from './theme';
import AppRoutes from './AppRoutes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Flex direction="column" minH="100vh">
        <Navbar />
        <Box flex="1">
          <AppRoutes />
        </Box>
        <Footer />
      </Flex>
      <Analytics />
    </ChakraProvider>
  );
}

export default App; 