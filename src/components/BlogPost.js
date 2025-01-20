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
  Divider
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { marked } from 'marked';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRightIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { getPostBySlug } from '../utils/blogUtils';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
// Core languages
import 'prismjs/components/prism-markup'; // HTML
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
// Additional languages
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-json';

const BlogPost = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const codeBgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
  const codeTextColor = useColorModeValue('gray.800', 'gray.100');
  const linkColor = useColorModeValue('teal.600', 'teal.300');
  const linkHoverColor = useColorModeValue('teal.700', 'teal.200');
  const blockquoteBgColor = useColorModeValue('gray.50', 'gray.700');
  const blockquoteBorderColor = useColorModeValue('teal.500', 'teal.300');

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

  useEffect(() => {
    const fetchPost = async () => {
      const fetchedPost = await getPostBySlug(slug);
      if (!fetchedPost) {
        navigate('/blog');
        return;
      }
      setPost(fetchedPost);
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

  const formattedDate = format(new Date(post.date), 'MMMM dd, yyyy');
  const htmlContent = marked(post.content);

  return (
    <Container maxW="container.md" py={8}>
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

        {/* Post Header */}
        <Box
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          borderColor={borderColor}
          bg={bgColor}
        >
          <Heading as="h1" size="xl" mb={4}>{post.title}</Heading>
          <HStack spacing={4} mb={4}>
            <Text color="gray.500">{formattedDate}</Text>
            <HStack spacing={2} flexWrap="wrap">
              {post.tags.map((tag, index) => (
                <Tag
                  key={index}
                  colorScheme="teal"
                  size="sm"
                  cursor="pointer"
                  onClick={() => navigate('/blog', { state: { selectedTag: tag } })}
                >
                  {tag}
                </Tag>
              ))}
            </HStack>
          </HStack>
          <Text fontSize="lg" color="gray.600">{post.excerpt}</Text>
        </Box>

        <Divider />

        {/* Post Content */}
        <Box
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          sx={{
            color: textColor,
            'h2': {
              fontSize: '2xl',
              fontWeight: 'bold',
              mt: 8,
              mb: 4,
              borderBottom: '1px solid',
              borderColor: borderColor,
              pb: 2,
              color: textColor
            },
            'h3': {
              fontSize: 'xl',
              fontWeight: 'bold',
              mt: 6,
              mb: 3,
              color: textColor
            },
            'h4': {
              fontSize: 'lg',
              fontWeight: 'bold',
              mt: 4,
              mb: 2,
              color: textColor
            },
            'p': {
              mb: 4,
              lineHeight: 1.8,
              fontSize: 'lg',
              color: textColor
            },
            'ul, ol': {
              mb: 4,
              pl: 6,
              fontSize: 'lg',
              color: textColor
            },
            'li': {
              mb: 2
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
              borderColor: blockquoteBorderColor,
              bg: blockquoteBgColor,
              pl: 4,
              pr: 4,
              py: 2,
              ml: 4,
              my: 4,
              color: secondaryTextColor,
              fontStyle: 'italic',
              borderRadius: '0 md md 0'
            },
            'a': {
              color: linkColor,
              textDecoration: 'underline',
              _hover: {
                color: linkHoverColor
              }
            },
            'img': {
              maxW: '100%',
              h: 'auto',
              borderRadius: 'md',
              my: 4
            }
          }}
        />

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