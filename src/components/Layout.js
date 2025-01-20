import React from 'react';
import { Box, Container, useColorModeValue } from '@chakra-ui/react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bgColor}>
      <Navbar />
      <Container maxW="6xl" py={8}>
        {children}
      </Container>
    </Box>
  );
} 