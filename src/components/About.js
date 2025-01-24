import React from 'react';
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
  Link
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

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
          src={author.image}
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
          {author.social.github && (
            <Link href={`https://github.com/${author.social.github}`} isExternal>
              <Icon as={FaGithub} boxSize={5} />
            </Link>
          )}
          {author.social.twitter && (
            <Link href={`https://twitter.com/${author.social.twitter}`} isExternal>
              <Icon as={FaTwitter} boxSize={5} />
            </Link>
          )}
          {author.social.linkedin && (
            <Link href={`https://linkedin.com/in/${author.social.linkedin}`} isExternal>
              <Icon as={FaLinkedin} boxSize={5} />
            </Link>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

const About = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  // For now, hardcode the authors. Later we can fetch this from the authors directory
  const authors = [
    {
      name: 'Orhan Biler',
      role: 'Owner & Main Author',
      image: '/static/authors/Orhan-Biler/Orhan-Biler.png',
      bio: 'From law enforcement to technology, sharing experiences in programming, cryptocurrency, and gaming.',
      social: {
        github: 'orhanbiler',
        twitter: 'orhanbiler',
        linkedin: 'orhanbiler'
      }
    }
  ];

  return (
    <Box bg={bgColor} minH="100vh" py={12}>
      <Helmet>
        <title>About - Orhan Biler</title>
        <meta name="description" content="Learn more about our team of writers sharing insights across technology, law enforcement, cryptocurrency, and gaming." />
      </Helmet>

      <Container maxW="container.lg">
        <VStack spacing={12} align="start">
          <Image
            src="/assets/banner.jpg"
            alt="Blog Banner"
            borderRadius="lg"
            w="100%"
            h="300px"
            objectFit="cover"
          />

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
                {authors.map((author) => (
                  <AuthorCard key={author.name} author={author} />
                ))}
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