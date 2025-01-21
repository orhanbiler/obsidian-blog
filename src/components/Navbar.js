import React from 'react';
import {
  Box,
  Flex,
  Container,
  IconButton,
  useColorMode,
  useColorModeValue,
  Heading,
  HStack,
  Link as ChakraLink
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={100}
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      shadow="sm"
    >
      <Container maxW="container.xl" py={4}>
        <Flex justify="space-between" align="center">
          <Link to="/blog">
            <Heading size="md" cursor="pointer">
              Orhan Biler
            </Heading>
          </Link>

          <HStack spacing={8}>
            <ChakraLink as={Link} to="/blog" fontWeight="medium">
              Blog
            </ChakraLink>
            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              aria-label="Toggle color mode"
            />
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar; 