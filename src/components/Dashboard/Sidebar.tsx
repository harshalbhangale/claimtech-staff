import { Box, VStack, HStack, Text, Icon, Divider, Heading, Badge, useColorModeValue, Avatar } from '@chakra-ui/react';
import { 
  Home,
  Users,
  FileText,
  Settings,
  Shield,
  Star,
  Search,
  LogOut
} from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const MotionBox = motion(Box);

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.700', 'gray.100');
  
  const mainMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Users, label: 'Users', path: '/users', count: 24 },
    { icon: FileText, label: "Claims", path: '/claims', count: 8 },
    // make the search bar a button
  ];
  
  const resourcesItems = [
    { icon: Avatar, label: 'Profile', path: '/profile', disabled: true },
    { icon: Settings, label: 'Settings', path: '/settings', disabled: true },
  ];
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const MenuItem = ({ item }: { item: any }) => (
    <Box
      as={item.disabled ? Box : Link}
      {...(item.disabled ? {} : { to: item.path })}
      px={4}
      py={3}
      borderRadius="lg"
      cursor={item.disabled ? "not-allowed" : "pointer"}
      bg={isActive(item.path) ? 'blue.50' : 'transparent'}
      color={item.disabled ? 'gray.400' : isActive(item.path) ? 'blue.600' : 'gray.600'}
      _hover={{ 
        bg: item.disabled ? 'transparent' : isActive(item.path) ? 'blue.100' : 'gray.100',
        transform: item.disabled ? 'none' : 'translateX(3px)'
      }}
      fontWeight={isActive(item.path) ? "semibold" : "medium"}
      transition="all 0.2s"
      opacity={item.disabled ? 0.6 : 1}
    >
      <HStack justify="space-between">
        <HStack spacing={3}>
          <Icon as={item.icon} boxSize={5} color={item.disabled ? 'gray.400' : isActive(item.path) ? 'blue.500' : 'gray.500'} />
          <Text fontSize="sm">
            {item.label}
          </Text>
          {item.disabled && (
            <Text fontSize="xs" color="purple.500">(Coming soon)</Text>
          )}
        </HStack>
        {item.count !== undefined && (
          <Badge 
            colorScheme={isActive(item.path) ? "blue" : "gray"} 
            borderRadius="full" 
            px={2}
            fontSize="xs"
          >
            {item.count}
          </Badge>
        )}
      </HStack>
    </Box>
  );

  return (
    <Box
      w="280px"
      bg={bgColor}
      borderRight="1px solid"
      borderColor={borderColor}
      h="calc(100vh - 72px)"
      overflowY="auto"
      shadow="sm"
      display="flex"
      flexDirection="column"
      position="fixed"
      mt={4}
    >
      {/* Decorative top gradient */}
      <Box 
        position="absolute" 
        top={0} 
        left={0} 
        right={0} 
        height="6px" 
        bgGradient="linear(to-r, blue.400, purple.500, pink.400)" 
      />
      
      <VStack spacing={8} align="stretch" p={6} pt={8} flex="1">
        {/* Main Menu Section */}
        <VStack spacing={4} align="stretch">
          <HStack px={4} justify="space-between">
            <Heading size="xs" textTransform="uppercase" color={headingColor} letterSpacing="wider">
              Main Menu
            </Heading>
            <Icon as={Star} boxSize={4} color="yellow.500" />
          </HStack>
          <VStack spacing={2} align="stretch">
            {mainMenuItems.map((item) => (
              <MenuItem key={item.label} item={item} />
            ))}
          </VStack>
        </VStack>
        
        <Divider />
        
        {/* Resources Section */}
        <VStack spacing={4} align="stretch">
          <HStack px={4} justify="space-between">
            <Heading size="xs" textTransform="uppercase" color={headingColor} letterSpacing="wider">
              Resources
            </Heading>
            <Icon as={Shield} boxSize={4} color="purple.500" />
          </HStack>
          <VStack spacing={2} align="stretch">
            {resourcesItems.map((item) => (
              <MenuItem key={item.label} item={item} />
            ))}
          </VStack>
        </VStack>
        
        <Box flex="1" />
        
        <Divider />
        
        {/* Logout Button */}
        <MotionBox
          onClick={handleLogout}
          px={4}
          py={3}
          borderRadius="lg"
          cursor="pointer"
          bg="transparent"
          color="red.500"
          _hover={{ 
            bg: "red.50",
            transform: 'translateX(3px)'
          }}
          fontWeight="medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          mb={2}
        >
          <HStack spacing={3}>
            <Icon as={LogOut} boxSize={5} />
            <Text fontSize="sm">
              Logout
            </Text>
          </HStack>
        </MotionBox>
      </VStack>
    </Box>
  );
} 