import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Divider,
  Heading,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  Home,
  Users,
  FileText,
  Settings,
  Shield,
  Star,
  Search,
  LogOut,
} from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.600', 'gray.200');
  const activeColor = useColorModeValue('blue.600', 'blue.300');

  const mainMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Users, label: 'Users', path: '/users', count: 24 },
    { icon: FileText, label: 'Claims', path: '/claims', count: 8 },
  ];

  const resourcesItems = [
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

  const SidebarItem = ({ item }: { item: any }) => {
    const isDisabled = item.disabled;
    const active = isActive(item.path);

    return (
      <Box
        as={isDisabled ? Box : Link}
        {...(isDisabled ? {} : { to: item.path })}
        px={4}
        py={2.5}
        borderRadius="md"
        cursor={isDisabled ? 'not-allowed' : 'pointer'}
        bg={active ? 'blue.50' : 'transparent'}
        color={isDisabled ? 'gray.400' : active ? activeColor : 'gray.600'}
        _hover={{
          bg: isDisabled ? 'transparent' : 'gray.100',
          transform: isDisabled ? 'none' : 'translateX(4px)',
        }}
        transition="all 0.2s"
        opacity={isDisabled ? 0.6 : 1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack spacing={3}>
          <Icon as={item.icon} boxSize={4} />
          <Text fontSize="sm">{item.label}</Text>
          {isDisabled && (
            <Text fontSize="xs" color="purple.500">(Coming soon)</Text>
          )}
        </HStack>
        {item.count !== undefined && (
          <Badge colorScheme={active ? 'blue' : 'gray'} borderRadius="full" px={2} fontSize="xs">
            {item.count}
          </Badge>
        )}
      </Box>
    );
  };

  return (
    <Box
      w="100%"
      maxW="280px"
      bg={bgColor}
      borderRight="1px solid"
      borderColor={borderColor}
      h="calc(100vh - 72px)"
      overflowY="auto"
      p={4}
    >
      {/* Top accent line */}
      <Box
        height="4px"
        bgGradient="linear(to-r, blue.400, purple.500)"
        borderRadius="full"
        mb={6}
      />

      <VStack spacing={6} align="stretch">
        {/* Main Menu */}
        <Box>
          <HStack justify="space-between" mb={2}>
            <Heading size="xs" textTransform="uppercase" color={headingColor}>
              Main Menu
            </Heading>
            <Icon as={Star} boxSize={3.5} color="yellow.400" />
          </HStack>
          <VStack spacing={1} align="stretch">
            {mainMenuItems.map((item) => (
              <SidebarItem key={item.label} item={item} />
            ))}
          </VStack>
        </Box>

        <Divider />

        {/* Resources */}
        <Box>
          <HStack justify="space-between" mb={2}>
            <Heading size="xs" textTransform="uppercase" color={headingColor}>
              Resources
            </Heading>
            <Icon as={Shield} boxSize={3.5} color="purple.400" />
          </HStack>
          <VStack spacing={1} align="stretch">
            {resourcesItems.map((item) => (
              <SidebarItem key={item.label} item={item} />
            ))}
          </VStack>
        </Box>

        <Divider />

        {/* Logout */}
        <Box
          onClick={handleLogout}
          px={4}
          py={2.5}
          borderRadius="md"
          cursor="pointer"
          color="red.500"
          _hover={{
            bg: 'red.50',
            transform: 'translateX(4px)',
          }}
          transition="all 0.2s"
        >
          <HStack spacing={3}>
            <Icon as={LogOut} boxSize={4} />
            <Text fontSize="sm">Logout</Text>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
}
