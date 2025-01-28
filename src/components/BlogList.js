import React, { useState, useEffect, useCallback } from 'react';
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
  ButtonGroup,
  Wrap,
  WrapItem,
  Tooltip
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { SearchIcon } from '@chakra-ui/icons';
import { getAllPosts, getPostsByTag, getAuthorImage } from '../utils/blogUtils';
import { useInView } from 'react-intersection-observer';

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

const BlogPostCard = ({ post, setSelectedTag }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedText = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      borderColor={borderColor}
      bg={bgColor}
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
    >
      {post.banner && (
        <Box height="200px" overflow="hidden">
          <img
            src={process.env.PUBLIC_URL + post.banner}
            alt={post.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            onError={(e) => {
              console.error('Error loading banner image:', e);
              e.target.style.display = 'none';
            }}
          />
        </Box>
      )}

      <Box p={6}>
        {/* Language indicator if not English */}
        {post.language && post.language !== 'en' && (
          <Tag
            size="sm"
            colorScheme="purple"
            mb={2}
          >
            {post.language.toUpperCase()}
          </Tag>
        )}

        {/* Series indicator */}
        {post.series && (
          <Tag
            size="sm"
            colorScheme="orange"
            mb={2}
            ml={post.language !== 'en' ? 2 : 0}
          >
            {post.series} #{post.seriesOrder}
          </Tag>
        )}

        <HStack spacing={2} flexWrap="wrap" mb={3}>
          {post.tags.map((tag, tagIndex) => (
            <Tag
              key={tagIndex}
              size="md"
              variant="subtle"
              colorScheme="teal"
              cursor="pointer"
              onClick={(e) => {
                e.preventDefault();
                setSelectedTag(tag.urlFriendly);
              }}
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

        {post.subtitle && (
          <Text fontSize="sm" color={mutedText} mb={2}>
            {post.subtitle}
          </Text>
        )}

        <Text noOfLines={2} mb={4} color={mutedText}>
          {post.excerpt}
        </Text>

        <HStack spacing={3} align="center">
          <Avatar
            size="sm"
            name={post.author}
            src={getAuthorImage(post.author)}
          />
          <Box>
            <Text fontWeight="medium" fontSize="sm">
              {post.author}
            </Text>
            <HStack spacing={2} color={mutedText} fontSize="sm">
              <Text>{format(new Date(post.date), 'MMM d, yyyy')}</Text>
              {post.readingTime && (
                <>
                  <Text>•</Text>
                  <Text>{post.readingTime} min read</Text>
                </>
              )}
            </HStack>
          </Box>
        </HStack>
      </Box>
    </Box>
  );
};

const BlogList = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 5;
  const [page, setPage] = useState(1);
  const tagParam = new URLSearchParams(location.search).get('tag');
  const navigate = useNavigate();

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const loadMorePosts = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;
    
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    
    const allPosts = await getAllPosts();
    const filteredPosts = tagParam
      ? allPosts.filter(post => post.frontMatter.tags?.includes(tagParam))
      : allPosts;
    
    if (endIndex >= filteredPosts.length) {
      setHasMore(false);
    }
    
    setPosts(prevPosts => [...prevPosts, ...filteredPosts.slice(startIndex, endIndex)]);
    setPage(nextPage);
    setIsLoadingMore(false);
  }, [page, postsPerPage, tagParam, hasMore, isLoadingMore]);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const allPosts = await getAllPosts();
      const filteredPosts = tagParam
        ? allPosts.filter(post => post.frontMatter.tags?.includes(tagParam))
        : allPosts;
      
      setPosts(filteredPosts.slice(0, postsPerPage));
      setHasMore(filteredPosts.length > postsPerPage);
      setIsLoading(false);
    };

    fetchPosts();
  }, [location.search, postsPerPage]);

  useEffect(() => {
    if (inView) {
      loadMorePosts();
    }
  }, [inView, loadMorePosts]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <VStack spacing={8} align="stretch" w="100%" pb={8}>
      {posts.map((post, index) => (
        <Box
          key={post.slug}
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="lg"
          bg={useColorModeValue('white', 'gray.800')}
        >
          <Link
            as={RouterLink}
            to={`/post/${post.slug}`}
            _hover={{ textDecoration: 'none' }}
          >
            <Text fontSize="2xl" fontWeight="bold" mb={2}>
              {post.frontMatter.title}
            </Text>
          </Link>
          
          <Text mb={4} color={useColorModeValue('gray.600', 'gray.400')}>
            {new Date(post.frontMatter.date).toLocaleDateString()}
          </Text>
          
          {post.frontMatter.tags && (
            <Wrap spacing={2} mb={4}>
              {post.frontMatter.tags.map(tag => (
                <WrapItem key={tag}>
                  <Tag
                    as={RouterLink}
                    to={`/?tag=${tag}`}
                    colorScheme="blue"
                    cursor="pointer"
                  >
                    {tag}
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          )}
          
          <Text noOfLines={3} color={useColorModeValue('gray.700', 'gray.300')}>
            {post.excerpt}
          </Text>
        </Box>
      ))}
      
      {isLoadingMore && (
        <Flex justify="center" py={4}>
          <Spinner />
        </Flex>
      )}
      
      <Box ref={ref} h="20px" />
    </VStack>
  );
};

export default BlogList; 