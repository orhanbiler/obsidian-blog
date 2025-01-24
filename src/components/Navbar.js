import React from 'react';
import {
  Box,
  Flex,
  Container,
  IconButton,
  useColorMode,
  useColorModeValue,
  Heading,
  HStack,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useDisclosure,
  Collapse,
  VStack,
  Icon,
  Text,
  Divider
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { MoonIcon, SunIcon, ChevronDownIcon, HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { FaBitcoin, FaGamepad, FaLaptopCode, FaShieldAlt } from 'react-icons/fa';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onToggle } = useDisclosure();
  const location = useLocation();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const activeBg = useColorModeValue('gray.100', 'gray.600');

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, icon }) => (
    <ChakraLink
      as={Link}
      to={to}
      display="flex"
      alignItems="center"
      px={4}
      py={2}
      rounded="md"
      fontWeight="medium"
      bg={isActive(to) ? activeBg : 'transparent'}
      _hover={{ bg: hoverBg, textDecoration: 'none' }}
    >
      {icon && <Icon as={icon} mr={2} />}
      {children}
    </ChakraLink>
  );

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={100}
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      shadow="sm"
    >
      <Container maxW="container.xl" py={4}>
        <Flex justify="space-between" align="center">
          {/* Logo */}
          <Link to="/">
            <Heading size="md" cursor="pointer">
              Orhan Biler
            </Heading>
          </Link>

          {/* Desktop Navigation */}
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            <NavLink to="/blog">Blog</NavLink>
            
            {/* Topics Dropdown */}
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                variant="ghost"
                _hover={{ bg: hoverBg }}
              >
                Topics
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FaLaptopCode />} as={Link} to="/blog?tag=tech">
                  Tech & Programming
                </MenuItem>
                <MenuItem icon={<FaBitcoin />} as={Link} to="/blog?tag=cryptocurrency">
                  Cryptocurrency
                </MenuItem>
                <MenuItem icon={<FaGamepad />} as={Link} to="/blog?tag=gaming">
                  Gaming
                </MenuItem>
                <MenuItem icon={<FaShieldAlt />} as={Link} to="/blog?tag=law-enforcement">
                  Law Enforcement
                </MenuItem>
                <Divider />
                <MenuItem as={Link} to="/blog/tags">
                  All Topics
                </MenuItem>
              </MenuList>
            </Menu>

            <NavLink to="/about">About</NavLink>
            
            {/* Color Mode Toggle */}
            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              aria-label="Toggle color mode"
            />
          </HStack>

          {/* Mobile Navigation Toggle */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onToggle}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            variant="ghost"
            aria-label="Toggle navigation"
          />
        </Flex>

        {/* Mobile Navigation Menu */}
        <Collapse in={isOpen} animateOpacity>
          <VStack
            display={{ base: 'flex', md: 'none' }}
            mt={4}
            spacing={2}
            align="stretch"
          >
            <NavLink to="/blog">Blog</NavLink>
            <Box
              p={2}
              rounded="md"
              _hover={{ bg: hoverBg }}
            >
              <Text fontWeight="medium" mb={2}>Topics</Text>
              <VStack align="stretch" pl={4} spacing={2}>
                <NavLink to="/blog?tag=tech" icon={FaLaptopCode}>
                  Tech & Programming
                </NavLink>
                <NavLink to="/blog?tag=cryptocurrency" icon={FaBitcoin}>
                  Cryptocurrency
                </NavLink>
                <NavLink to="/blog?tag=gaming" icon={FaGamepad}>
                  Gaming
                </NavLink>
                <NavLink to="/blog?tag=law-enforcement" icon={FaShieldAlt}>
                  Law Enforcement
                </NavLink>
              </VStack>
            </Box>
            <NavLink to="/about">About</NavLink>
          </VStack>
        </Collapse>
      </Container>
    </Box>
  );
};

export default Navbar; 