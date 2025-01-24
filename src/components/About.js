import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  useColorModeValue,
  Divider
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';

const About = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box bg={bgColor} minH="100vh" py={12}>
      <Helmet>
        <title>About - Orhan Biler</title>
        <meta name="description" content="Learn more about Orhan Biler - From law enforcement to tech, sharing experiences in programming, cryptocurrency, and gaming." />
      </Helmet>

      <Container maxW="container.md">
        <VStack spacing={8} align="start">
          <Image
            src="/assets/banner.jpg"
            alt="Orhan Biler"
            borderRadius="lg"
            w="100%"
            h="300px"
            objectFit="cover"
          />

          <Heading as="h1" size="2xl">
            About Me
          </Heading>

          <Text fontSize="xl" color={textColor}>
            Hi, I'm Orhan Biler. I've had quite a journey - from serving in law enforcement to diving deep into the world of technology.
          </Text>

          <Divider />

          <VStack spacing={6} align="start" w="100%">
            <Heading as="h2" size="lg">
              My Journey
            </Heading>
            <Text color={textColor}>
              My path has been anything but conventional. Starting in law enforcement, I developed strong problem-solving and analytical skills. Now, I channel that same dedication into technology, cryptocurrency, and gaming.
            </Text>

            <Heading as="h2" size="lg">
              What I Write About
            </Heading>
            <Text color={textColor}>
              On this blog, I share insights about:
              • Technology and Programming
              • Cryptocurrency and Investment
              • Gaming and Setup Guides
              • Law Enforcement to Tech Transition
            </Text>

            <Heading as="h2" size="lg">
              My Mission
            </Heading>
            <Text color={textColor}>
              Through this blog, I aim to bridge different worlds - law enforcement, technology, gaming, and finance - sharing unique perspectives and helping others navigate their own journeys.
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default About; 