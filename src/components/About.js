import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  List,
  ListItem,
  Icon,
  HStack,
  Link,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  IconButton,
} from '@chakra-ui/react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

// Component to display a loading skeleton while authors are being fetched
function AuthorCardSkeleton() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      maxW={'320px'}
      w={'full'}
      bg={bgColor}
      boxShadow={'lg'}
      rounded={'lg'}
      p={6}
      textAlign={'center'}
      borderWidth="1px"
      borderColor={borderColor}
    >
      <SkeletonCircle size="32" mx="auto" mb={4} />
      <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
      <Stack mt={8} direction={'row'} spacing={4} justifyContent="center">
        <Skeleton height="40px" width="40px" rounded="full" />
        <Skeleton height="40px" width="40px" rounded="full" />
        <Skeleton height="40px" width="40px" rounded="full" />
      </Stack>
    </Box>
  );
}

function AuthorCard({ author }) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const iconColor = useColorModeValue('gray.600', 'gray.300');
  const buttonBg = useColorModeValue('gray.100', 'whiteAlpha.200');
  const buttonHoverBg = useColorModeValue('gray.200', 'whiteAlpha.300');

  return (
    <Box
      maxW={'320px'}
      w={'full'}
      bg={bgColor}
      boxShadow={'lg'}
      rounded={'lg'}
      p={6}
      textAlign={'center'}
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Image
        h={'120px'}
        w={'120px'}
        src={author.image}
        alt={`Avatar of ${author.name}`}
        mb={4}
        rounded={'full'}
        mx={'auto'}
        objectFit={'cover'}
      />
      <Text fontWeight={600} color={textColor} fontSize={'xl'} mb={2}>
        {author.name}
      </Text>
      <Text fontWeight={500} color={mutedTextColor} mb={4}>
        {author.role}
      </Text>
      
      {/* Areas of Expertise */}
      {author.areas && (
        <HStack spacing={2} justify="center" wrap="wrap" mb={4}>
          {author.areas.map((area, index) => (
            <Text
              key={index}
              fontSize="sm"
              color={mutedTextColor}
              bg={buttonBg}
              px={2}
              py={1}
              rounded="full"
            >
              {area}
            </Text>
          ))}
        </HStack>
      )}

      {/* About Me Section */}
      <VStack align="start" spacing={2} mb={6} w="full">
        <Text fontWeight={500} color={textColor} fontSize="md" alignSelf="start">
          About Me
        </Text>
        <Text 
          textAlign={'left'} 
          color={textColor} 
          fontSize="sm" 
          noOfLines={4}
          lineHeight="1.6"
          whiteSpace="pre-wrap"
        >
          {author.aboutMe}
        </Text>
      </VStack>

      {/* Social Media Links */}
      <Stack mt={4} direction={'row'} spacing={4} justify="center">
        {author.social?.github && (
          <Link href={`https://github.com/${author.social.github}`} isExternal>
            <IconButton
              aria-label="GitHub"
              icon={<FaGithub />}
              color={iconColor}
              bg={buttonBg}
              _hover={{
                bg: buttonHoverBg,
                transform: 'translateY(-2px)',
              }}
              rounded="full"
              transition="all 0.2s"
            />
          </Link>
        )}
        {author.social?.twitter && (
          <Link href={`https://twitter.com/${author.social.twitter}`} isExternal>
            <IconButton
              aria-label="Twitter"
              icon={<FaTwitter />}
              color={iconColor}
              bg={buttonBg}
              _hover={{
                bg: buttonHoverBg,
                transform: 'translateY(-2px)',
              }}
              rounded="full"
              transition="all 0.2s"
            />
          </Link>
        )}
        {author.social?.linkedin && (
          <Link href={`https://linkedin.com/in/${author.social.linkedin}`} isExternal>
            <IconButton
              aria-label="LinkedIn"
              icon={<FaLinkedin />}
              color={iconColor}
              bg={buttonBg}
              _hover={{
                bg: buttonHoverBg,
                transform: 'translateY(-2px)',
              }}
              rounded="full"
              transition="all 0.2s"
            />
          </Link>
        )}
      </Stack>
    </Box>
  );
}

const About = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch('/static/authors/index.json');
        if (!response.ok) {
          throw new Error('Failed to fetch authors');
        }
        const data = await response.json();
        
        // Ensure data is an array, if not, try to access the authors property
        const authorsData = Array.isArray(data) ? data : (data.authors || []);
        
        // Process each author to include their About Me section
        const processedAuthors = authorsData.map(author => {
          // Extract the About Me section from the bio content
          const aboutMeMatch = author.bio?.match(/## About Me\n([\s\S]*?)(?=\n##|$)/);
          const aboutMe = aboutMeMatch ? aboutMeMatch[1].trim() : '';
          
          // Format the name for the image path
          const formattedName = author.name.replace(/\s+/g, '');
          
          console.log('Processing author:', author.name); // Debug log
          console.log('Bio content:', author.bio); // Debug log
          console.log('Extracted About Me:', aboutMe); // Debug log
          
          return {
            ...author,
            aboutMe: aboutMe || 'No bio available', // Provide a default message if no bio is found
            image: `/static/authors/${formattedName}/${formattedName}.png`
          };
        });

        console.log('Processed authors:', processedAuthors); // Debug log
        setAuthors(processedAuthors);
        setError(null);
      } catch (err) {
        console.error('Error fetching authors:', err);
        setError('Failed to load authors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  return (
    <Box bg={bgColor} minH="100vh" py={20}>
      <Helmet>
        <title>About - Our Team</title>
        <meta name="description" content="Learn more about our team of writers sharing insights across technology, law enforcement, cryptocurrency, and gaming." />
      </Helmet>

      <Container maxW={'7xl'}>
        <Stack spacing={8} as={Container} maxW={'3xl'} textAlign={'center'} mb={16}>
          <Text
            color={headingColor}
            fontWeight={600}
            fontSize={{ base: '3xl', sm: '4xl' }}
            lineHeight={'110%'}
          >
            Meet Our Team
          </Text>
          <Text color={textColor} fontSize={'lg'}>
            We are a passionate team of writers and experts dedicated to bringing you the latest insights
            and stories from the world of technology, law enforcement, cryptocurrency, and gaming.
          </Text>
        </Stack>

        {error ? (
          <VStack spacing={4} textAlign="center" py={10}>
            <Text color={textColor}>{error}</Text>
            <Button
              colorScheme="blue"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </VStack>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} px={4}>
            {loading
              ? Array(3).fill(0).map((_, index) => <AuthorCardSkeleton key={index} />)
              : authors.map((author) => <AuthorCard key={author.name} author={author} />)
            }
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
};

export default About; 