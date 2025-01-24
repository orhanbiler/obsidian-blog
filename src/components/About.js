import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  useColorModeValue,
  Divider,
  SimpleGrid,
  Avatar,
  HStack,
  Icon,
  Link,
  Skeleton,
  SkeletonCircle,
  SkeletonText
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { getAuthorImage } from '../utils/blogUtils';
import matter from 'gray-matter';

const AuthorCard = ({ author }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={cardBg}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="md"
    >
      <VStack spacing={4} align="center">
        <Avatar
          size="2xl"
          name={author.name}
          src={getAuthorImage(author.name)}
        />
        <VStack spacing={2} align="center">
          <Heading as="h3" size="md">
            {author.name}
          </Heading>
          <Text color="gray.500" fontSize="sm">
            {author.role}
          </Text>
        </VStack>
        <Text textAlign="center" fontSize="sm">
          {author.bio}
        </Text>
        <HStack spacing={4}>
          {author.social?.github && (
            <Link href={`https://github.com/${author.social.github}`} isExternal>
              <Icon as={FaGithub} boxSize={5} />
            </Link>
          )}
          {author.social?.twitter && (
            <Link href={`https://twitter.com/${author.social.twitter}`} isExternal>
              <Icon as={FaTwitter} boxSize={5} />
            </Link>
          )}
          {author.social?.linkedin && (
            <Link href={`https://linkedin.com/in/${author.social.linkedin}`} isExternal>
              <Icon as={FaLinkedin} boxSize={5} />
            </Link>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

const AuthorCardSkeleton = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={cardBg}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="md"
    >
      <VStack spacing={4} align="center">
        <SkeletonCircle size="24" />
        <VStack spacing={2} align="center" w="100%">
          <Skeleton height="24px" width="150px" />
          <Skeleton height="16px" width="100px" />
        </VStack>
        <SkeletonText mt="4" noOfLines={3} spacing="4" w="100%" />
        <HStack spacing={4}>
          <Skeleton height="20px" width="20px" />
          <Skeleton height="20px" width="20px" />
          <Skeleton height="20px" width="20px" />
        </HStack>
      </VStack>
    </Box>
  );
};

const About = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        // Fetch the bio.md file for each author
        const response = await fetch('/static/authors/index.json');
        if (!response.ok) {
          throw new Error('Failed to fetch authors');
        }
        const data = await response.json();
        setAuthors(data.authors);
      } catch (error) {
        console.error('Error fetching authors:', error);
        // Fallback to default author if fetch fails
        setAuthors([{
          name: 'Orhan Biler',
          role: 'Software Engineer',
          bio: 'Former police officer turned software engineer, passionate about building innovative solutions and sharing knowledge through blogging.',
          social: {
            github: 'orhanbiler',
            linkedin: 'orhanbiler',
            twitter: 'orhanbiler'
          }
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  return (
    <Box bg={bgColor} minH="100vh" py={12}>
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

            <Text fontSize="xl" color={textColor}>
              Welcome to our blog, where we share insights and experiences across technology, law enforcement, cryptocurrency, and gaming.
            </Text>

            <Divider />

            <VStack spacing={8} align="start" w="100%">
              <Heading as="h2" size="xl">
                Our Authors
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="100%">
                {loading ? (
                  <>
                    <AuthorCardSkeleton />
                    <AuthorCardSkeleton />
                    <AuthorCardSkeleton />
                  </>
                ) : (
                  authors.map((author) => (
                    <AuthorCard key={author.name} author={author} />
                  ))
                )}
              </SimpleGrid>
            </VStack>

            <Divider />

            <VStack spacing={6} align="start" w="100%">
              <Heading as="h2" size="lg">
                Our Mission
              </Heading>
              <Text color={textColor}>
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