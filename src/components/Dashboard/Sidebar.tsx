import { Box, VStack, HStack, Text, Icon } from '@chakra-ui/react';
import { 
  Folder, 
  Home,
  Users,
  File
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  
  const mainMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Users', path: '/users' },
    {icon: File, label: "Claims", path: '/claims'}
  ];
  const isActive = (path: string) => location.pathname === path;

  const MenuItem = ({ item }: { item: any }) => (
    <Box
      as={Link}
      to={item.path}
      px={4}
      py={2.5}
      borderRadius="md"
      cursor="pointer"
      bg={isActive(item.path) ? 'blue.50' : 'transparent'}
      color={isActive(item.path) ? 'blue.600' : 'gray.700'}
      _hover={{ bg: isActive(item.path) ? 'blue.100' : 'gray.100' }}
      transition="all 0.2s"
      fontWeight={isActive(item.path) ? "medium" : "normal"}
    >
      <HStack justify="space-between">
        <HStack spacing={3}>
          <Icon as={item.icon} boxSize={4} color={isActive(item.path) ? 'blue.500' : 'gray.500'} />
          <Text fontSize="sm">
            {item.label}
          </Text>
        </HStack>
        {item.count !== undefined && (
          <Text fontSize="xs" fontWeight="medium" color={isActive(item.path) ? 'blue.500' : 'gray.500'} px={2} py={0.5} bg={isActive(item.path) ? 'blue.100' : 'gray.100'} borderRadius="full">
            {item.count}
          </Text>
        )}
      </HStack>
    </Box>
  );

  return (
    <Box
      w="260px"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      h="calc(100vh - 72px)"
      overflowY="auto"
      shadow="sm"
    >
      <VStack spacing={6} align="stretch" p={4}>
        {/* All Files Dropdown */}
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          p={3}
          cursor="pointer"
          _hover={{ bg: 'gray.50' }}
          shadow="xs"
          transition="all 0.2s"
        >
          <HStack justify="space-between">
            <HStack spacing={2}>
              <Folder size={16} color="#4A5568" />
              <Text fontSize="sm" fontWeight="medium" color="gray.700">
                Claimtech Staff
              </Text>
            </HStack>
          </HStack>
        </Box>

        {/* Main Menu Items */}
        <VStack spacing={1} align="stretch">
          <Text fontSize="xs" fontWeight="medium" color="gray.500" textTransform="uppercase" px={4} mb={1}>
            Main
          </Text>
          {mainMenuItems.map((item) => (
            <MenuItem key={item.label} item={item} />
          ))}
        </VStack>
      </VStack>
    </Box>
  );
} 