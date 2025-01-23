import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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
  useColorModeValue,
  Avatar,
  Button,
  SimpleGrid,
  Grid,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  ButtonGroup
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { SearchIcon } from '@chakra-ui/icons';
import { getAllPosts } from '../utils/blogUtils';

const BlogPostSkeleton = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      borderColor={borderColor}
      bg={bgColor}
      overflow="hidden"
    >
      <Skeleton height="200px" />
      <Box p={6}>
        <HStack spacing={2} mb={3}>
          <Skeleton height="24px" width="60px" borderRadius="full" />
          <Skeleton height="24px" width="80px" borderRadius="full" />
        </HStack>
        <Skeleton height="24px" width="90%" mb={2} />
        <SkeletonText mt={4} noOfLines={2} spacing={4} />
        <HStack spacing={3} mt={4}>
          <SkeletonCircle size="8" />
          <Skeleton height="16px" width="120px" />
        </HStack>
      </Box>
    </Box>
  );
};

const FeaturedPostSkeleton = () => {
  const secondaryBg = useColorModeValue('gray.50', 'gray.700');
  
  return (
    <Box bg={secondaryBg} py={16} mb={8}>
      <Container maxW="container.xl">
        <Grid templateColumns={{ base: '1fr', lg: '1.2fr 0.8fr' }} gap={8} alignItems="center">
          <Skeleton height="400px" borderRadius="xl" />
          <VStack align="flex-start" spacing={4}>
            <HStack spacing={2}>
              <Skeleton height="24px" width="80px" borderRadius="full" />
              <Skeleton height="24px" width="100px" borderRadius="full" />
            </HStack>
            <Skeleton height="48px" width="90%" />
            <Skeleton height="24px" width="80%" />
            <SkeletonText mt={4} noOfLines={3} spacing={4} width="100%" />
            <HStack spacing={4} mt={4}>
              <SkeletonCircle size="12" />
              <Box>
                <Skeleton height="20px" width="120px" mb={2} />
                <Skeleton height="16px" width="100px" />
              </Box>
            </HStack>
            <Skeleton height="48px" width="120px" mt={4} />
          </VStack>
        </Grid>
      </Container>
    </Box>
  );
};

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const location = useLocation();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const secondaryBg = useColorModeValue('gray.50', 'gray.700');
  const mutedText = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    // Reset search and tag filters when showLatest is true
    if (location.state?.showLatest) {
      setSearchTerm('');
      setSelectedTag('');
      // Clear the location state after handling it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true); // Ensure loading is true before fetching
      try {
        const fetchedPosts = await getAllPosts();
        setPosts(fetchedPosts);
        
        const uniqueTags = [...new Set(fetchedPosts.flatMap(post => 
          post.tags.map(tag => tag.original)
        ))];
        
        const formattedTags = uniqueTags.map(tag => ({
          original: tag,
          urlFriendly: tag.toLowerCase().replace(/\s+/g, '-')
        }));
        
        setAllTags(formattedTags);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        // Add a small delay to ensure skeleton is visible
        setTimeout(() => setLoading(false), 1000);
      }
    };
    
    loadPosts();
  }, []);

  // Always sort posts by date
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Featured post is always the latest post
  const featuredPost = sortedPosts[0];
  
  // Filter the remaining posts
  const filteredPosts = sortedPosts.slice(1).filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => 
                           tag.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tag.urlFriendly.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesTag = !selectedTag || post.tags.some(tag => tag.urlFriendly === selectedTag);
    return matchesSearch && matchesTag;
  });

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTag]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Create meta description from the latest posts
  const getMetaDescription = () => {
    if (posts.length === 0) return "Personal blog and articles about technology, programming, and more.";
    const latestPosts = posts.slice(0, 3).map(post => post.title).join(', ');
    return `Latest posts: ${latestPosts}. Read more articles about technology, programming, and personal experiences.`;
  };

  // Get all unique tags for keywords
  const getMetaKeywords = () => {
    const keywords = new Set(allTags.map(tag => tag.original));
    return Array.from(keywords).join(', ');
  };

  if (loading) {
    return (
      <Box>
        <FeaturedPostSkeleton />
        <Container maxW="container.xl" py={8}>
          <Flex gap={4} direction={{ base: 'column', md: 'row' }} mb={8}>
            <Skeleton height="48px" flex="1" />
            <Skeleton height="48px" width={{ base: "full", md: "200px" }} />
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {[...Array(6)].map((_, index) => (
              <BlogPostSkeleton key={index} />
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      <Helmet>
        <title>{searchTerm ? `Search: ${searchTerm} - Blog` : 'Blog - Orhan Biler'}</title>
        <meta name="description" content={getMetaDescription()} />
        <meta name="keywords" content={getMetaKeywords()} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={searchTerm ? `Search: ${searchTerm} - Blog` : 'Blog - Orhan Biler'} />
        <meta property="og:description" content={getMetaDescription()} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        {featuredPost?.banner && <meta property="og:image" content={featuredPost.banner} />}
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={searchTerm ? `Search: ${searchTerm} - Blog` : 'Blog - Orhan Biler'} />
        <meta name="twitter:description" content={getMetaDescription()} />
        {featuredPost?.banner && <meta name="twitter:image" content={featuredPost.banner} />}
        
        {/* Additional SEO tags */}
        <link rel="canonical" href={window.location.href} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Orhan Biler" />
      </Helmet>

      {/* Hero Section with Featured Post - Always visible */}
      {featuredPost && (
        <Box bg={secondaryBg} py={16} mb={8}>
          <Container maxW="container.xl">
            <Grid templateColumns={{ base: '1fr', lg: '1.2fr 0.8fr' }} gap={8} alignItems="center">
              {featuredPost.banner && (
                <Box
                  borderRadius="xl"
                  overflow="hidden"
                  boxShadow="xl"
                >
                  <img
                    src={featuredPost.banner}
                    alt={featuredPost.title}
                    style={{
                      width: '100%',
                      height: '400px',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              )}
              <VStack align="flex-start" spacing={4}>
                <HStack spacing={2} flexWrap="wrap">
                  {featuredPost.tags.map((tag, index) => (
                    <Tag
                      key={index}
                      colorScheme="teal"
                      variant="subtle"
                      size="sm"
                      borderRadius="full"
                      cursor="pointer"
                      onClick={() => setSelectedTag(tag.urlFriendly)}
                    >
                      <Text as="span" color="teal.500" fontWeight="bold" mr={1}>
                        #
                      </Text>
                      {tag.original}
                    </Tag>
                  ))}
                </HStack>
                <Heading as="h1" size="2xl" lineHeight="1.2">
                  {featuredPost.title}
                </Heading>
                {featuredPost.subtitle && (
                  <Text fontSize="xl" color={mutedText}>
                    {featuredPost.subtitle}
                  </Text>
                )}
                <Text fontSize="lg" color={mutedText} noOfLines={3}>
                  {featuredPost.excerpt}
                </Text>
                <HStack spacing={4}>
                  <Avatar
                    size="md"
                    name={featuredPost.author}
                    src={`/assets/authors/${featuredPost.author.replace(' ', '-')}.png`}
                  />
                  <Box>
                    <Text fontWeight="bold">{featuredPost.author}</Text>
                    <Text fontSize="sm" color={mutedText}>
                      {format(new Date(featuredPost.date), 'MMMM d, yyyy')}
                    </Text>
                  </Box>
                </HStack>
                <Button
                  as={Link}
                  to={`/blog/${featuredPost.slug}`}
                  colorScheme="teal"
                  size="md"
                  mt={4}
                >
                  Read More
                </Button>
              </VStack>
            </Grid>
          </Container>
        </Box>
      )}

      <Container maxW="container.xl" py={8}>
        {/* Search and Filter Section */}
        <Box mb={8}>
          <Heading size="lg" mb={4}>
            {searchTerm || selectedTag ? 'Search Results' : 'All Posts'}
          </Heading>
          <Flex gap={4} direction={{ base: 'column', md: 'row' }} mb={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg={bgColor}
                size="lg"
              />
            </InputGroup>
            <Select
              placeholder="Filter by tag"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              bg={bgColor}
              maxW={{ base: "full", md: "200px" }}
              size="lg"
            >
              {allTags.map(tag => (
                <option key={tag.urlFriendly} value={tag.urlFriendly}>
                  #{tag.original}
                </option>
              ))}
            </Select>
          </Flex>
          {(searchTerm || selectedTag) && (
            <HStack spacing={2} mb={4}>
              <Text color={mutedText}>
                Found {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
              </Text>
              {selectedTag && (
                <Tag
                  size="md"
                  variant="subtle"
                  colorScheme="blue"
                  cursor="pointer"
                  onClick={() => setSelectedTag('')}
                >
                  #{allTags.find(t => t.urlFriendly === selectedTag)?.original}
                  <Text ml={1} as="span" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTag('');
                  }}>
                    ×
                  </Text>
                </Tag>
              )}
              {(searchTerm || selectedTag) && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTag('');
                  }}
                >
                  Clear filters
                </Button>
              )}
            </HStack>
          )}
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} mb={8}>
          {currentPosts.map((post, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="lg"
              borderColor={borderColor}
              bg={bgColor}
              overflow="hidden"
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: 'xl',
              }}
              transition="all 0.2s"
            >
              {post.banner && (
                <Box h="200px" overflow="hidden">
                  <img
                    src={post.banner}
                    alt={post.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              )}
              <Box p={6}>
                <HStack spacing={2} flexWrap="wrap" mb={3}>
                  {post.tags.map((tag, tagIndex) => (
                    <Tag
                      key={tagIndex}
                      size="md"
                      variant="subtle"
                      colorScheme="blue"
                      cursor="pointer"
                      onClick={() => setSelectedTag(tag.urlFriendly)}
                    >
                      #{tag.original}
                    </Tag>
                  ))}
                </HStack>
                <Link to={`/blog/${post.slug}`}>
                  <Heading as="h3" size="md" mb={2} _hover={{ color: 'teal.500' }}>
                    {post.title}
                  </Heading>
                </Link>
                <Text noOfLines={2} mb={4} color={mutedText}>
                  {post.excerpt}
                </Text>
                <HStack spacing={3}>
                  <Avatar
                    size="sm"
                    name={post.author}
                    src={`/assets/authors/${post.author.replace(' ', '-')}.png`}
                  />
                  <Text fontSize="sm" color={mutedText}>
                    {format(new Date(post.date), 'MMMM d, yyyy')}
                  </Text>
                </HStack>
              </Box>
            </Box>
          ))}
        </SimpleGrid>

        {/* Pagination Controls */}
        {filteredPosts.length > postsPerPage && (
          <Center mt={8}>
            <ButtonGroup spacing={2}>
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                isDisabled={currentPage === 1}
                colorScheme="teal"
                variant="outline"
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  colorScheme="teal"
                  variant={currentPage === index + 1 ? "solid" : "outline"}
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                isDisabled={currentPage === totalPages}
                colorScheme="teal"
                variant="outline"
              >
                Next
              </Button>
            </ButtonGroup>
          </Center>
        )}
      </Container>
    </Box>
  );
};

export default BlogList; 