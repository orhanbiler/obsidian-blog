import React, { useState, useEffect, useCallback } from 'react';
import {
  VStack,
  Box,
  Text,
  Tag,
  Flex,
  Spinner,
  useColorModeValue,
  Link,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { getAllPosts } from '../utils/blogUtils';
import { useInView } from 'react-intersection-observer';

const BlogList = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 5;
  const [page, setPage] = useState(1);
  const tagParam = new URLSearchParams(location.search).get('tag');
  
  // Move useColorModeValue hooks to component level
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const darkTextColor = useColorModeValue('gray.700', 'gray.300');

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
  }, [location.search, postsPerPage, tagParam]);

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
      {posts.map((post) => (
        <Box
          key={post.slug}
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="lg"
          bg={bgColor}
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
          
          <Text mb={4} color={textColor}>
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
          
          <Text noOfLines={3} color={darkTextColor}>
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