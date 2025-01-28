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
    
    // If it's a Cloudinary URL, add auto-format parameter
    if (bannerPath.includes('cloudinary.com')) {
      // Check if the URL contains /upload/
      if (bannerPath.includes('/upload/')) {
        // Insert f_auto after /upload/
        return bannerPath.replace('/upload/', '/upload/f_auto,q_auto/');
      }
      return bannerPath;
    }
    
    // Handle other cases as before
    if (bannerPath.startsWith('http')) return bannerPath;
    if (bannerPath.startsWith('/static/')) return bannerPath;
    if (bannerPath.startsWith('assets/')) return `/static/${bannerPath}`;
    if (bannerPath.startsWith('/assets/')) return `/static${bannerPath}`;
    
    return `/static/${bannerPath.startsWith('/') ? bannerPath.slice(1) : bannerPath}`;
  };

  useEffect(() => {
    const fetchPost = async () => {
      const fetchedPost = await getPostBySlug(slug);
      if (!fetchedPost) {
        navigate('/blog');
        return;
      }
      
      // Log the banner path for debugging
      if (fetchedPost.banner) {
        console.log('Original banner path:', fetchedPost.banner);
        console.log('Processed banner path:', getBannerPath(fetchedPost.banner));
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

  // Remove the separate Tags section and modify the Related Topics section
  const getRelatedTags = () => {
    const relatedTags = new Map();
    
    // Get tags from related posts
    relatedPosts.forEach(relatedPost => {
      relatedPost.tags.forEach(tag => {
        // Check if the tag is not in current post's tags by comparing urlFriendly
        if (!post.tags.some(currentTag => currentTag.urlFriendly === tag.urlFriendly)) {
          const key = JSON.stringify(tag); // Use stringified tag object as key
          relatedTags.set(key, (relatedTags.get(key) || 0) + 1);
        }
      });
    });

    // Convert to array and sort by frequency
    return Array.from(relatedTags.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)  // Limit to top 5 related tags
      .map(([tagStr]) => JSON.parse(tagStr));  // Parse the stringified tag object
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

        {/* Modify the Related Topics section */}
        {getRelatedTags().length > 0 && (
          <Box mt={8}>
            <Text fontSize="sm" color={subtitleColor} mb={2}>Related Topics</Text>
            <Wrap spacing={2}>
              {getRelatedTags().map((tag, index) => (
                <Tag
                  key={index}
                  size="md"
                  variant="subtle"
                  colorScheme="teal"
                  cursor="pointer"
                  onClick={() => navigate(`/blog?tag=${tag.urlFriendly}`)}
                >
                  <Text as="span" fontWeight="bold" mr={1}>
                    #
                  </Text>
                  {tag.original}
                </Tag>
              ))}
            </Wrap>
          </Box>
        )}

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
              mb: 10,
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
              display: 'block',
              maxWidth: '100%',
              height: 'auto',
              boxShadow: 'lg',
              marginBottom: '-2rem',
              marginTop: '2rem'
            },
            'i, em': {
              fontSize: '.9rem',
              color: subtitleColor,
              opacity: 0.9
            },
            'img + em': {
              display: 'block', 
              textAlign: 'center',
              marginTop: '0.25rem',
              marginBottom: '2rem',
              color: subtitleColor,
              fontSize: '0.75rem',
              opacity: 0.8
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