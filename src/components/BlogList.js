import React, { useState, useEffect } from 'react';
import {
  VStack,
  Box,
  Heading,
  Text,
  Tag,
  HStack,
  Link as ChakraLink,
  Spinner,
  Center,
  Container,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { SearchIcon } from '@chakra-ui/icons';
import { getAllPosts } from '../utils/blogUtils';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [allTags, setAllTags] = useState([]);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
      
      // Extract unique tags
      const tags = [...new Set(fetchedPosts.flatMap(post => post.tags))];
      setAllTags(tags);
      
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="teal.500" thickness="4px" />
      </Center>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center" mb={8}>
          <Heading as="h1" size="2xl" mb={4}>
            Blog
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Thoughts, ideas, and experiences in technology and development
          </Text>
        </Box>

        {/* Search and Filter */}
        <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg={bgColor}
            />
          </InputGroup>
          <Select
            placeholder="Filter by tag"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            bg={bgColor}
            maxW={{ base: "full", md: "200px" }}
          >
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </Select>
        </Flex>

        {/* Posts Grid */}
        <VStack spacing={6} align="stretch">
          {filteredPosts.length === 0 ? (
            <Center py={8}>
              <Text>No posts found matching your criteria.</Text>
            </Center>
          ) : (
            filteredPosts.map((post, index) => (
              <Box
                key={index}
                p={6}
                borderWidth="1px"
                borderRadius="lg"
                borderColor={borderColor}
                bg={bgColor}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s"
              >
                <ChakraLink
                  as={Link}
                  to={`/blog/${post.slug}`}
                  _hover={{ textDecoration: 'none' }}
                >
                  <Heading as="h3" size="lg" mb={2}>
                    {post.title}
                  </Heading>
                </ChakraLink>
                <Text color="gray.500" fontSize="sm" mb={3}>
                  {format(new Date(post.date), 'MMMM dd, yyyy')}
                </Text>
                <Text noOfLines={2} mb={4} color="gray.600">
                  {post.excerpt}
                </Text>
                <HStack spacing={2} flexWrap="wrap">
                  {post.tags.map((tag, tagIndex) => (
                    <Tag
                      key={tagIndex}
                      colorScheme="teal"
                      size="sm"
                      cursor="pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedTag(tag);
                      }}
                      _hover={{
                        transform: 'scale(1.05)',
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </HStack>
              </Box>
            ))
          )}
        </VStack>
      </VStack>
    </Container>
  );
};

export default BlogList; 