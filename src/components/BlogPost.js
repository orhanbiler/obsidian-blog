import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Container,
  Tag,
  HStack,
  VStack,
  Spinner,
  Center,
  Button,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Avatar,
  Flex,
  SimpleGrid,
  Wrap,
  WrapItem,
  Tooltip
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { marked } from 'marked';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRightIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { getPostBySlug, getRelatedPosts, getAuthorImage } from '../utils/blogUtils';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
// Core languages
import 'prismjs/components/prism-markup'; // HTML
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
// Additional languages
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-json';
import { Helmet } from 'react-helmet-async';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const codeBgColor = useColorModeValue('gray.50', 'gray.800');
  const codeTextColor = useColorModeValue('gray.800', 'gray.200');
  const linkColor = useColorModeValue('blue.600', 'blue.400');
  const linkHoverColor = useColorModeValue('blue.700', 'blue.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const blockquoteBg = useColorModeValue('gray.50', 'gray.800');
  const blockquoteBorder = useColorModeValue('gray.200', 'gray.700');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');

  // Syntax highlighting colors
  const syntaxColors = {
    comment: '#6a9955',
    string: '#ce9178',
    function: '#dcdcaa',
    keyword: '#569cd6',
    operator: '#d4d4d4',
    number: '#b5cea8',
    boolean: '#569cd6',
    title: '#569cd6',
    code: '#ce9178',
    list: '#6796e6',
    hr: '#6796e6'
  };

  const [loading, setLoading] = useState(true);

  // Add a helper function to get the correct banner path
  const getBannerPath = (bannerPath) => {
    if (!bannerPath) return null;
    // If the path already starts with /static, use it as is
    if (bannerPath.startsWith('/static')) return bannerPath;
    // Otherwise, prepend /static
    return `/static${bannerPath.startsWith('/') ? '' : '/'}${bannerPath}`;
  };

  useEffect(() => {
    const fetchPost = async () => {
      const fetchedPost = await getPostBySlug(slug);
      if (!fetchedPost) {
        navigate('/blog');
        return;
      }
      setPost(fetchedPost);
      
      // Fetch related posts
      if (fetchedPost) {
        const related = await getRelatedPosts(fetchedPost);
        setRelatedPosts(related);
      }
      
      setLoading(false);
    };
    fetchPost();
  }, [slug, navigate]);

  useEffect(() => {
    // Configure marked options
    marked.setOptions({
      gfm: true,
      breaks: true,
      highlight: function(code, lang) {
        if (lang && Prism.languages[lang]) {
          try {
            return `<pre class="language-${lang}"><code class="language-${lang}">${Prism.highlight(
              code,
              Prism.languages[lang],
              lang
            )}</code></pre>`;
          } catch (err) {
            console.error('Prism highlighting error:', err);
            return code;
          }
        }
        return `<pre><code>${code}</code></pre>`;
      }
    });
  }, []); // Run once on component mount

  useEffect(() => {
    if (post) {
      Prism.highlightAll();
    }
  }, [post]);

  const formatDate = (dateString) => {
    try {
      if (!dateString) {
        return 'No date';
      }

      // Handle YYYY-MM-DD format
      if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return format(date, 'MMMM d, yyyy');
      }

      // Try parsing as ISO string
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Invalid date';
    }
  };

  // Add related tags calculation
  const getRelatedTags = () => {
    if (!post || !relatedPosts.length) return [];
    
    // Get all tags from related posts
    const relatedTags = relatedPosts
      .flatMap(p => p.tags)
      .filter(tag => !post.tags.some(t => t.urlFriendly === tag.urlFriendly));
    
    // Count occurrences and remove duplicates
    const tagCount = {};
    relatedTags.forEach(tag => {
      tagCount[tag.urlFriendly] = (tagCount[tag.urlFriendly] || 0) + 1;
    });
    
    return Object.entries(tagCount)
      .map(([urlFriendly, count]) => ({
        ...relatedTags.find(t => t.urlFriendly === urlFriendly),
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Show top 10 related tags
  };

  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="teal.500" thickness="4px" />
      </Center>
    );
  }

  if (!post) {
    return null;
  }

  const formattedDate = formatDate(post.date);
  const htmlContent = marked(post.content || '');
  const pageTitle = post.title ? `${post.title} - Orhan Biler` : 'Orhan Biler';

  return (
    <Container maxW="container.xl" py={8}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={post.excerpt || ''} />
        <meta name="keywords" content={post.keywords ? post.keywords.join(', ') : ''} />
        
        {/* Language */}
        <html lang={post.language || 'en'} />
        
        {/* Canonical URL */}
        {post.canonical && <link rel="canonical" href={post.canonical} />}
        
        {/* Open Graph */}
        <meta property="og:title" content={post.title || ''} />
        <meta property="og:description" content={post.excerpt || ''} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={post.socialImage || post.banner || ''} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content={post.twitterCard || 'summary_large_image'} />
        <meta name="twitter:title" content={post.title || ''} />
        <meta name="twitter:description" content={post.excerpt || ''} />
        <meta name="twitter:image" content={post.socialImage || post.banner || ''} />
        
        {/* Article Metadata */}
        {post.date && <meta property="article:published_time" content={post.date} />}
        {post.lastModified && <meta property="article:modified_time" content={post.lastModified} />}
        {post.tags && post.tags.map(tag => (
          <meta property="article:tag" content={tag.original || tag} key={tag.urlFriendly || tag} />
        ))}
      </Helmet>

      <VStack spacing={6} align="stretch">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
          mb={4}
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/blog">Blog</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{post.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Back Button */}
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          size="sm"
          onClick={() => navigate('/blog')}
          alignSelf="flex-start"
        >
          Back to Blog
        </Button>

        {/* Banner Image */}
        {post.banner && (
          <Box
            position="relative"
            height="400px"
            width="100%"
            overflow="hidden"
            borderRadius="xl"
            mb={8}
          >
            <img
              src={getBannerPath(post.banner)}
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

        {/* Post Header */}
        <Box>
          <Heading 
            as="h1" 
            size="2xl" 
            mb={4}
            lineHeight="1.2"
          >
            {post.title}
          </Heading>
          
          {post.subtitle && (
            <Text
              fontSize="xl"
              color={subtitleColor}
              mb={6}
              lineHeight="1.6"
            >
              {post.subtitle}
            </Text>
          )}

          <Flex 
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'flex-start', md: 'center' }}
            justify="space-between"
            mb={8}
          >
            <HStack spacing={4} mb={{ base: 4, md: 0 }}>
              <Avatar 
                size="md"
                name={post.author || 'Orhan Biler'} 
                src={getAuthorImage(post.author || 'Orhan Biler')}
                bg="teal.500"
              />
              <Box>
                <Text fontWeight="bold" fontSize="md">
                  {post.author || 'Orhan Biler'}
                </Text>
                <HStack spacing={2} color="gray.500" fontSize="sm">
                  <Text>{formattedDate}</Text>
                  {post.readingTime && (
                    <>
                      <Text>•</Text>
                      <Text>{post.readingTime} min read</Text>
                    </>
                  )}
                </HStack>
              </Box>
            </HStack>
            
            <HStack spacing={2} flexWrap="wrap">
              {post.tags.map((tag, index) => (
                <Tag
                  key={index}
                  colorScheme="teal"
                  variant="subtle"
                  size="md"
                  borderRadius="full"
                  cursor="pointer"
                  onClick={() => navigate(`/blog?tag=${tag.urlFriendly}`)}
                  _hover={{
                    transform: 'translateY(-1px)',
                    shadow: 'sm'
                  }}
                  transition="all 0.2s"
                >
                  <Text as="span" color="teal.500" fontWeight="bold" mr={1}>
                    #
                  </Text>
                  {tag.original}
                </Tag>
              ))}
            </HStack>
          </Flex>
        </Box>

        {/* Language Selector if translations exist */}
        {post.translations && Object.keys(post.translations).length > 0 && (
          <HStack spacing={2} mb={4}>
            <Text fontSize="sm" color={subtitleColor}>Available in:</Text>
            {Object.entries(post.translations).map(([lang, path]) => (
              <Link key={lang} to={path}>
                <Tag size="sm" variant="outline" colorScheme="teal">
                  {lang.toUpperCase()}
                </Tag>
              </Link>
            ))}
          </HStack>
        )}

        {/* Series Information */}
        {post.series && (
          <Box p={4} bg={blockquoteBg} borderRadius="md" mb={4}>
            <Text fontWeight="bold" mb={2}>Part of series: {post.series}</Text>
            {post.seriesOrder && (
              <Text fontSize="sm" color={subtitleColor}>
                Part {post.seriesOrder}
              </Text>
            )}
          </Box>
        )}

        {/* Enhanced Tag Section */}
        <Box mb={8}>
          <VStack spacing={4} align="stretch">
            {/* Current Post Tags */}
            <Box>
              <Text fontSize="sm" color={subtitleColor} mb={2}>Tags:</Text>
              <Wrap spacing={2}>
                {post.tags.map((tag, index) => (
                  <WrapItem key={index}>
                    <Tag
                      colorScheme="teal"
                      variant="solid"
                      size="md"
                      borderRadius="full"
                      cursor="pointer"
                      onClick={() => navigate(`/blog?tag=${tag.urlFriendly}`)}
                      _hover={{
                        transform: 'translateY(-1px)',
                        shadow: 'sm'
                      }}
                    >
                      <Text as="span" fontWeight="bold" mr={1}>
                        #
                      </Text>
                      {tag.original}
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>

            {/* Related Tags */}
            {getRelatedTags().length > 0 && (
              <Box>
                <Text fontSize="sm" color={subtitleColor} mb={2}>Related Topics:</Text>
                <Wrap spacing={2}>
                  {getRelatedTags().map((tag, index) => (
                    <WrapItem key={index}>
                      <Tooltip 
                        label={`${tag.count} related ${tag.count === 1 ? 'post' : 'posts'}`}
                        hasArrow
                      >
                        <Tag
                          colorScheme="teal"
                          variant="subtle"
                          size="md"
                          borderRadius="full"
                          cursor="pointer"
                          onClick={() => navigate(`/blog?tag=${tag.urlFriendly}`)}
                          _hover={{
                            transform: 'translateY(-1px)',
                            shadow: 'sm'
                          }}
                          transition="all 0.2s"
                        >
                          <Text as="span" fontWeight="bold" mr={1}>
                            #
                          </Text>
                          {tag.original}
                          <Text as="span" ml={2} fontSize="xs" opacity={0.8}>
                            {tag.count}
                          </Text>
                        </Tag>
                      </Tooltip>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            )}
          </VStack>
        </Box>

        {/* Post Content */}
        <Box
          className="blog-content"
          maxW="container.md"
          mx="auto"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          sx={{
            color: textColor,
            'h2': {
              fontSize: '3xl',
              fontWeight: 'bold',
              mt: 12,
              mb: 6,
              lineHeight: 1.2
            },
            'h3': {
              fontSize: '2xl',
              fontWeight: 'bold',
              mt: 8,
              mb: 4
            },
            'h4': {
              fontSize: 'lg',
              fontWeight: 'bold',
              mt: 4,
              mb: 2,
              color: textColor
            },
            'p': {
              mb: 6,
              lineHeight: 1.8,
              fontSize: 'lg',
              color: textColor
            },
            'ul, ol': {
              mb: 6,
              pl: 6,
              fontSize: 'lg'
            },
            'li': {
              mb: 3
            },
            'pre': {
              bg: codeBgColor,
              p: 4,
              borderRadius: 'md',
              mb: 4,
              overflowX: 'auto',
              position: 'relative',
              border: '1px solid',
              borderColor: borderColor
            },
            'pre code': {
              bg: 'transparent',
              p: 0,
              fontSize: '0.9em',
              fontFamily: 'monospace',
              display: 'block',
              width: '100%',
              color: codeTextColor
            },
            '.language-javascript, .language-js': {
              '.token.comment': { color: syntaxColors.comment },
              '.token.string': { color: syntaxColors.string },
              '.token.function': { color: syntaxColors.function },
              '.token.keyword': { color: syntaxColors.keyword },
              '.token.operator': { color: syntaxColors.operator },
              '.token.number': { color: syntaxColors.number },
              '.token.boolean': { color: syntaxColors.boolean }
            },
            '.language-markdown, .language-md': {
              '.token.title': { color: syntaxColors.title },
              '.token.code': { color: syntaxColors.code },
              '.token.list': { color: syntaxColors.list },
              '.token.hr': { color: syntaxColors.hr }
            },
            '.language-yaml': {
              '.token.key': { color: syntaxColors.keyword },
              '.token.string': { color: syntaxColors.string }
            },
            'code:not(pre code)': {
              bg: codeBgColor,
              p: '0.2em 0.4em',
              borderRadius: 'sm',
              fontSize: '0.9em',
              fontFamily: 'monospace',
              color: codeTextColor
            },
            'blockquote': {
              borderLeft: '4px solid',
              borderColor: blockquoteBorder,
              bg: blockquoteBg,
              px: 6,
              py: 4,
              my: 8,
              borderRadius: 'md'
            },
            'a': {
              color: linkColor,
              textDecoration: 'underline',
              _hover: {
                color: linkHoverColor
              }
            },
            'img': {
              borderRadius: 'xl',
              my: 8,
              display: 'block',
              margin: '2rem auto',
              maxWidth: '100%',
              height: 'auto',
              boxShadow: 'lg'
            }
          }}
        />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <Box mt={8}>
            <Heading as="h3" size="lg" mb={4}>Related Posts</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {relatedPosts.map(relatedPost => (
                <Box
                  key={relatedPost.slug}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  _hover={{ shadow: 'md' }}
                >
                  <Link to={`/blog/${relatedPost.slug}`}>
                    <Heading size="sm" mb={2}>{relatedPost.title}</Heading>
                    <Text fontSize="sm" color={subtitleColor} noOfLines={2}>
                      {relatedPost.excerpt}
                    </Text>
                  </Link>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        )}

        {/* Navigation Footer */}
        <Divider mt={8} />
        <Button
          leftIcon={<ArrowBackIcon />}
          onClick={() => navigate('/blog')}
          alignSelf="center"
          size="lg"
          mt={4}
        >
          Back to Blog
        </Button>
      </VStack>
    </Container>
  );
};

export default BlogPost; 