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
} from '@chakra-ui/react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

// Component to display a loading skeleton while authors are being fetched
const AuthorCardSkeleton = () => (
  <Box
    maxW={'320px'}
    w={'full'}
    bg={useColorModeValue('white', 'gray.900')}
    boxShadow={'2xl'}
    rounded={'lg'}
    p={6}
    textAlign={'center'}>
    <SkeletonCircle size='120px' mx='auto' mb={4} />
    <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
    <Stack mt={8} direction={'row'} spacing={4} justify={'center'}>
      <Skeleton height='40px' width='40px' rounded='full' />
      <Skeleton height='40px' width='40px' rounded='full' />
      <Skeleton height='40px' width='40px' rounded='full' />
    </Stack>
  </Box>
);

const AuthorCard = ({ author }) => {
  const { name, role, bio, image, social } = author;
  
  return (
    <Box
      maxW={'320px'}
      w={'full'}
      bg={useColorModeValue('white', 'gray.900')}
      boxShadow={'2xl'}
      rounded={'lg'}
      p={6}
      textAlign={'center'}>
      <Image
        h={'120px'}
        w={'120px'}
        src={image}
        alt={`Avatar of ${name}`}
        mb={4}
        pos={'relative'}
        _after={{
          content: '""',
          w: 4,
          h: 4,
          bg: 'green.300',
          border: '2px solid white',
          rounded: 'full',
          pos: 'absolute',
          bottom: 0,
          right: 0,
        }}
        mx='auto'
        rounded={'full'}
        objectFit={'cover'}
      />
      <Heading fontSize={'2xl'} fontFamily={'body'}>
        {name}
      </Heading>
      <Text fontWeight={600} color={'gray.500'} mb={4}>
        {role}
      </Text>
      <Text
        textAlign={'center'}
        color={useColorModeValue('gray.700', 'gray.400')}
        px={3}>
        {bio}
      </Text>

      <Stack mt={8} direction={'row'} spacing={4} justify={'center'}>
        {social?.github && (
          <Link href={social.github} isExternal>
            <Button
              flex={1}
              fontSize={'sm'}
              rounded={'full'}
              _focus={{
                bg: 'gray.200',
              }}>
              <Icon as={FaGithub} />
            </Button>
          </Link>
        )}
        {social?.linkedin && (
          <Link href={social.linkedin} isExternal>
            <Button
              flex={1}
              fontSize={'sm'}
              rounded={'full'}
              _focus={{
                bg: 'gray.200',
              }}>
              <Icon as={FaLinkedin} />
            </Button>
          </Link>
        )}
        {social?.twitter && (
          <Link href={social.twitter} isExternal>
            <Button
              flex={1}
              fontSize={'sm'}
              rounded={'full'}
              _focus={{
                bg: 'gray.200',
              }}>
              <Icon as={FaTwitter} />
            </Button>
          </Link>
        )}
      </Stack>
    </Box>
  );
};

const About = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch('/static/authors/index.json');
        const data = await response.json();
        setAuthors(data.authors.map(author => ({
          ...author,
          image: `/static/authors/${author.name.replace(/\s+/g, '')}/${author.name.replace(/\s+/g, '')}.png`
        })));
      } catch (error) {
        console.error('Error fetching authors:', error);
        // Fallback to default author if fetch fails
        setAuthors([{
          name: 'Orhan Biler',
          role: 'Software Engineer',
          bio: 'Former law enforcement officer turned software engineer.',
          image: '/static/authors/OrhanBiler/OrhanBiler.png',
          social: {
            github: 'https://github.com/orhanbiler',
            linkedin: 'https://linkedin.com/in/orhanbiler',
            twitter: 'https://twitter.com/orhanbiler'
          }
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  return (
    <Box bg="gray.50" minH="100vh" py={12}>
      <Helmet>
        <title>About - Our Team</title>
        <meta name="description" content="Learn more about our team of writers sharing insights across technology, law enforcement, cryptocurrency, and gaming." />
      </Helmet>

      <Container maxW="container.lg">
        <VStack spacing={12} align="start">
          <VStack spacing={8} align="start" w="100%">
            <Heading as="h1" size="2xl">
              About Us
            </Heading>

            <Text fontSize="xl" color="gray.600">
              Welcome to our blog, where we share insights and experiences across technology, law enforcement, cryptocurrency, and gaming.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="100%">
              {loading ? (
                <>
                  <AuthorCardSkeleton />
                  <AuthorCardSkeleton />
                  <AuthorCardSkeleton />
                </>
              ) : (
                authors.map((author, index) => (
                  <AuthorCard key={index} author={author} />
                ))
              )}
            </SimpleGrid>

            <VStack spacing={6} align="start" w="100%">
              <Heading as="h2" size="lg">
                Our Mission
              </Heading>
              <Text color="gray.600">
                Through this blog, we aim to bridge different worlds - law enforcement, technology, gaming, and finance - sharing unique perspectives and helping others navigate their own journeys.
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default About; 