import React from 'react';
import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
  Icon,
  Divider,
  VStack,
  HStack
} from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverColor = useColorModeValue('teal.600', 'teal.300');
  const bgColor = useColorModeValue('white', 'gray.900');

  const handleLatestPosts = () => {
    navigate('/blog', { state: { showLatest: true } });
  };

  return (
    <Box
      bg={bgColor}
      color={textColor}
      borderTop="1px"
      borderColor={borderColor}
      mt="auto"
    >
      <Container maxW="container.xl" py={10}>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={8}
          justify="space-between"
          align="start"
        >
          {/* Branding Section */}
          <VStack align="start" spacing={3}>
            <Text fontSize="lg" fontWeight="bold" color={useColorModeValue('gray.700', 'white')}>
              Orhan Biler
            </Text>
            <Text fontSize="sm" maxW="300px">
              Computer and Tech Geek. Exploring technology, sharing knowledge, and documenting my journey through software development.
            </Text>
          </VStack>

          {/* Quick Links */}
          <VStack align="start" spacing={3}>
            <Text fontWeight="bold" color={useColorModeValue('gray.700', 'white')}>
              Quick Links
            </Text>
            <Link as={RouterLink} to="/blog" _hover={{ color: hoverColor }}>
              Blog
            </Link>
            <Link
              as="button"
              onClick={handleLatestPosts}
              _hover={{ color: hoverColor }}
              textAlign="left"
              display="block"
              width="100%"
            >
              Latest Posts
            </Link>
          </VStack>

          {/* Connect Section */}
          <VStack align="start" spacing={3}>
            <Text fontWeight="bold" color={useColorModeValue('gray.700', 'white')}>
              Connect
            </Text>
            <Link
              href="https://github.com/orhanbiler"
              isExternal
              _hover={{ color: hoverColor }}
              display="flex"
              alignItems="center"
            >
              <Icon as={FaGithub} boxSize={5} mr={2} />
              <Text>GitHub</Text>
            </Link>
          </VStack>
        </Stack>

        <Divider my={8} borderColor={borderColor} />

        {/* Copyright */}
        <Text textAlign="center" fontSize="sm">
          © {year} Orhan Biler. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
};

export default Footer; 