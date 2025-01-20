import React from 'react';
import {
  Box,
  Container,
  IconButton,
  useColorMode,
  useColorModeValue,
  Flex
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const Layout = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bgColor}>
      <Flex
        as="header"
        position="fixed"
        w="full"
        top={0}
        zIndex={10}
        bg={useColorModeValue('white', 'gray.800')}
        borderBottom="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        py={2}
        px={4}
      >
        <Container maxW="container.xl" display="flex" justifyContent="flex-end">
          <IconButton
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            aria-label="Toggle color mode"
          />
        </Container>
      </Flex>
      <Box pt="60px">
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 