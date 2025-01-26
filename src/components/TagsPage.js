import React from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Tag,
  Text,
  VStack,
  useColorModeValue,
  Icon,
  Flex,
  useBreakpointValue
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBitcoin, FaGamepad, FaLaptopCode, FaShieldAlt, FaHashtag } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

const TagsPage = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  const tagCategories = [
    {
      title: 'Technical',
      icon: FaLaptopCode,
      tags: ['tech', 'web-development', 'programming', 'software-engineering']
    },
    {
      title: 'Cryptocurrency',
      icon: FaBitcoin,
      tags: ['cryptocurrency', 'bitcoin', 'blockchain', 'defi']
    },
    {
      title: 'Gaming',
      icon: FaGamepad,
      tags: ['gaming', 'pc-gaming', 'game-reviews', 'gaming-setup']
    },
    {
      title: 'Law Enforcement',
      icon: FaShieldAlt,
      tags: ['law-enforcement', 'police-work', 'public-safety']
    }
  ];

  const handleTagClick = (tag) => {
    navigate(`/blog?tag=${tag}`);
  };

  return (
    <Box bg={bgColor} minH="100vh" py={12}>
      <Helmet>
        <title>Topics - Orhan Biler's Blog</title>
        <meta name="description" content="Explore topics including technology, cryptocurrency, gaming, and law enforcement experiences." />
      </Helmet>

      <Container maxW="container.xl">
        <VStack spacing={8} align="start">
          <Heading as="h1" size="2xl">
            Topics
          </Heading>
          <Text fontSize="xl" color={textColor} mb={8}>
            Explore articles by topic - from tech tutorials to personal experiences
          </Text>

          <SimpleGrid columns={columns} spacing={8} w="100%">
            {tagCategories.map((category) => (
              <Box
                key={category.title}
                bg={cardBg}
                p={6}
                borderRadius="lg"
                shadow="md"
                transition="all 0.2s"
                _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
              >
                <Flex align="center" mb={4}>
                  <Icon as={category.icon} boxSize={6} color="teal.500" mr={2} />
                  <Heading size="md">{category.title}</Heading>
                </Flex>
                <SimpleGrid columns={2} spacing={2}>
                  {category.tags.map((tag) => (
                    <Tag
                      key={tag}
                      size="md"
                      variant="subtle"
                      colorScheme="teal"
                      cursor="pointer"
                      onClick={() => handleTagClick(tag)}
                      _hover={{ bg: 'teal.100' }}
                    >
                      <Icon as={FaHashtag} boxSize={3} mr={1} />
                      {tag}
                    </Tag>
                  ))}
                </SimpleGrid>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default TagsPage; 