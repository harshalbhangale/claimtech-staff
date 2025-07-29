import { Box, HStack, VStack, Text, Input, IconButton, Avatar, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { Search, Bell, ChevronDown,User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  return (
    <Box bg="white" borderBottom="1px solid" borderColor="gray.200" px={6} py={4}>
      <HStack spacing={8} justify="space-between">
        {/* Logo and Navigation */}
        <HStack spacing={8}>
          {/* Logo */}
          <HStack spacing={2}>
            <Box
              w={8}
              h={8}
              bg="linear-gradient(135deg, #3182ce 0%, #2c5aa0 100%)"
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
              shadow="sm"
            >
              <Text color="white" fontWeight="bold" fontSize="sm">
                C
              </Text>
            </Box>
            <Text fontWeight="bold" fontSize="lg" color="gray.800">
              Claimtech
            </Text>
          </HStack>
        </HStack>

        {/* Search and User */}
        <HStack spacing={4}>
          {/* Search Bar */}
          <Box position="relative" w="400px">
            <Input
              placeholder="Search anything..."
              bg="gray.50"
              border="none"
              borderRadius="lg"
              pl={10}
              pr={4}
              py={2}
              fontSize="sm"
              _focus={{
                bg: 'white',
                boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
              }}
            />
            <Box
              position="absolute"
              left={3}
              top="50%"
              transform="translateY(-50%)"
              color="gray.400"
            >
              <Search size={16} />
            </Box>
          </Box>

          {/* Notifications */}
          <IconButton
            aria-label="Notifications"
            icon={<Bell size={20} />}
            variant="ghost"
            color="gray.600"
            _hover={{ bg: 'gray.100' }}
          />

          {/* User Profile */}
          <Menu>
            <MenuButton
              as={HStack}
              spacing={2}
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
            >
              <Avatar size="sm" name={user?.name || 'User'} src="" />
              <VStack spacing={0} align="start">
                <Text fontSize="xs" fontWeight="medium" color="gray.800">
                  {user?.name || 'User'}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {user?.role || 'Admin'}
                </Text>
              </VStack>
              <ChevronDown size={16} color="gray.400" />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<User size={16} />}>
                Profile
              </MenuItem>
              <MenuItem icon={<LogOut size={16} />} onClick={handleLogout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>
    </Box>
  );
} 