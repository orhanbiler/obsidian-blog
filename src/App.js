import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import AppRoutes from './AppRoutes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Flex direction="column" minH="100vh">
      <Navbar />
      <Box flex="1">
        <AppRoutes />
      </Box>
      <Footer />
    </Flex>
  );
}

export default App; 