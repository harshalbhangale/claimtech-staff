import {
  Box,
  HStack,
  Text,
  Avatar,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDown, Menu as MenuIcon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Sidebar from './Sidebar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showMobileMenu = useBreakpointValue({ base: true, md: false });

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <>
      <Box
        bg={bg}
        borderBottom="1px solid"
        borderColor={borderColor}
        px={{ base: 4, md: 8 }}
        py={3}
        position="sticky"
        top={0}
        zIndex={1000}
      >
        <HStack justify="space-between" align="center">
          {/* Left: Menu icon (mobile only) */}
          {showMobileMenu && (
            <IconButton
              icon={<MenuIcon size={20} />}
              variant="ghost"
              aria-label="Open Menu"
              onClick={onOpen}
            />
          )}

          {/* Center: Logo + Label */}
          <HStack spacing={3} cursor="pointer" onClick={() => navigate('/dashboard')}>
            <Image src="/logo.png" alt="Logo" boxSize="32px" />
            <Box display={{ base: 'none', sm: 'block' }}>
              <Text fontWeight="bold" fontSize="lg">
                Claimtech
              </Text>
              <Text fontSize="xs" color="gray.500">
                Staff Portal
              </Text>
            </Box>
          </HStack>

          {/* Right: Avatar menu */}
          <Menu>
            <MenuButton>
              <HStack spacing={2}>
                <Avatar name={user?.name || 'User'} size="sm" bg="purple.500" />
                <ChevronDown size={16} />
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<LogOut size={16} />} onClick={handleLogout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Box>

      {/* Sidebar Drawer (mobile) */}
      {showMobileMenu && (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              <Sidebar />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
