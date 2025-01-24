import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  VStack,
  useColorModeValue,
  SimpleGrid,
  Icon,
  HStack,
  Link,
  IconButton,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Badge,
  useBreakpointValue,
  Divider,
} from '@chakra-ui/react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

// Component to display a loading skeleton while authors are being fetched
function AuthorCardSkeleton() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      maxW={'380px'}
      w={'full'}
      bg={bgColor}
      boxShadow={'xl'}
      rounded={'2xl'}
      p={8}
      textAlign={'center'}
      pos={'relative'}
      _hover={{ transform: 'translateY(-5px)', transition: 'all 0.3s ease' }}
    >
      <SkeletonCircle size="32" mx="auto" mb={6} />
      <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
      <Stack mt={8} direction={'row'} spacing={4} justify="center">
        <Skeleton height="40px" width="40px" rounded="full" />
        <Skeleton height="40px" width="40px" rounded="full" />
        <Skeleton height="40px" width="40px" rounded="full" />
      </Stack>
    </Box>
  );
}

function AuthorCard({ author }) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const iconColor = useColorModeValue('gray.600', 'gray.300');
  const buttonBg = useColorModeValue('gray.100', 'whiteAlpha.200');
  const buttonHoverBg = useColorModeValue('gray.200', 'whiteAlpha.300');
  const badgeBg = useColorModeValue('blue.50', 'blue.900');
  const badgeColor = useColorModeValue('blue.600', 'blue.200');

  return (
    <Box
      maxW={'380px'}
      w={'full'}
      bg={bgColor}
      boxShadow={'xl'}
      rounded={'2xl'}
      p={8}
      textAlign={'center'}
      pos={'relative'}
      _hover={{ transform: 'translateY(-5px)', transition: 'all 0.3s ease' }}
    >
      <Image
        h={'140px'}
        w={'140px'}
        src={author.image}
        alt={`Avatar of ${author.name}`}
        mb={6}
        rounded={'full'}
        mx={'auto'}
        objectFit={'cover'}
        shadow={'xl'}
      />
      <VStack spacing={3}>
        <Text fontWeight={700} fontSize={'2xl'} color={textColor}>
          {author.name}
        </Text>
        <Badge
          px={3}
          py={1}
          bg={badgeBg}
          color={badgeColor}
          rounded="full"
          fontSize={'sm'}
          fontWeight={'600'}
        >
          {author.role}
        </Badge>
      </VStack>
      
      {/* Areas of Expertise */}
      {author.areas && (
        <HStack spacing={2} justify="center" wrap="wrap" mt={4} mb={6}>
          {author.areas.map((area, index) => (
            <Text
              key={index}
              fontSize="xs"
              color={mutedTextColor}
              bg={buttonBg}
              px={3}
              py={1}
              rounded="full"
              fontWeight="500"
            >
              {area}
            </Text>
          ))}
        </HStack>
      )}

      <Divider my={6} borderColor={useColorModeValue('gray.200', 'gray.600')} />

      {/* About Me Section */}
      <VStack align="start" spacing={3} mb={6} w="full">
        <Text fontWeight={600} color={textColor} fontSize="md" alignSelf="start">
          About Me
        </Text>
        <Text 
          textAlign={'left'} 
          color={mutedTextColor} 
          fontSize="sm" 
          noOfLines={4}
          lineHeight="1.8"
          fontWeight="400"
        >
          {author.aboutMe}
        </Text>
      </VStack>

      {/* Social Media Links */}
      <Stack mt={8} direction={'row'} spacing={4} justify="center">
        {author.social?.github && (
          <Link href={`https://github.com/${author.social.github}`} isExternal>
            <IconButton
              aria-label="GitHub"
              icon={<FaGithub size="20px" />}
              color={iconColor}
              bg={buttonBg}
              _hover={{
                bg: buttonHoverBg,
                transform: 'translateY(-2px)',
                color: textColor,
              }}
              rounded="full"
              size="lg"
              transition="all 0.3s ease"
            />
          </Link>
        )}
        {author.social?.twitter && (
          <Link href={`https://twitter.com/${author.social.twitter}`} isExternal>
            <IconButton
              aria-label="Twitter"
              icon={<FaTwitter size="20px" />}
              color={iconColor}
              bg={buttonBg}
              _hover={{
                bg: buttonHoverBg,
                transform: 'translateY(-2px)',
                color: textColor,
              }}
              rounded="full"
              size="lg"
              transition="all 0.3s ease"
            />
          </Link>
        )}
        {author.social?.linkedin && (
          <Link href={`https://linkedin.com/in/${author.social.linkedin}`} isExternal>
            <IconButton
              aria-label="LinkedIn"
              icon={<FaLinkedin size="20px" />}
              color={iconColor}
              bg={buttonBg}
              _hover={{
                bg: buttonHoverBg,
                transform: 'translateY(-2px)',
                color: textColor,
              }}
              rounded="full"
              size="lg"
              transition="all 0.3s ease"
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
  const spacing = useBreakpointValue({ base: 8, md: 10, lg: 12 });

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch('/static/authors/index.json');
        if (!response.ok) {
          throw new Error('Failed to fetch authors');
        }
        const data = await response.json();
        
        // Process each author to include their About Me section
        const processedAuthors = data.map(author => {
          // Extract the About Me section from the bio content
          const aboutMeMatch = author.bio?.match(/## About Me\n([\s\S]*?)(?=\n##|$)/);
          const aboutMe = aboutMeMatch ? aboutMeMatch[1].trim() : '';
          
          // Format the name for the image path
          const formattedName = author.name.replace(/\s+/g, '');
          
          return {
            ...author,
            aboutMe: aboutMe || author.bio?.split('\n')[0] || 'No bio available',
            image: `/static/authors/${formattedName}/${formattedName}.png`
          };
        });

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
        <VStack spacing={spacing} as={Container} maxW={'3xl'} textAlign={'center'} mb={16}>
          <Text
            color={headingColor}
            fontWeight={800}
            fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }}
            lineHeight={'110%'}
            letterSpacing="tight"
          >
            Meet Our Team
          </Text>
          <Text 
            color={textColor} 
            fontSize={{ base: 'lg', md: 'xl' }}
            lineHeight="tall"
            maxW="2xl"
          >
            We are a passionate team of writers and experts dedicated to bringing you the latest insights
            and stories from the world of technology, law enforcement, cryptocurrency, and gaming.
          </Text>
        </VStack>

        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 3 }} 
          spacing={spacing} 
          px={{ base: 4, md: 8 }}
          mx="auto"
          justifyItems="center"
        >
          {loading
            ? Array(3).fill(0).map((_, index) => <AuthorCardSkeleton key={index} />)
            : authors.map((author) => <AuthorCard key={author.name} author={author} />)
          }
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default About; 