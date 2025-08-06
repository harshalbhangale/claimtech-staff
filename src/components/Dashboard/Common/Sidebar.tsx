import { Box, VStack, HStack, Text, Icon, Button, Tooltip } from '@chakra-ui/react';
import { Home, Users, FileText, Settings, Search, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useSidebar } from '../../../contexts/SidebarContext';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Search, label: 'Search', path: '/search', disabled: true },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: FileText, label: 'Claims', path: '/claims', disabled: true },
  { icon: Settings, label: 'Settings', path: '/settings', disabled: true },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isExpanded, toggleSidebar, sidebarWidth } = useSidebar();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SidebarItem = ({ item }: { item: typeof menuItems[0] }) => {
    const isActive = location.pathname === item.path;
    
    const content = (
      <Box
        as={item.disabled ? Box : Link}
        {...(item.disabled ? {} : { to: item.path })}
        px={3}
        py={2}
        borderRadius="md"
        bg={isActive ? 'blue.50' : 'transparent'}
        color={item.disabled ? 'gray.400' : isActive ? 'blue.600' : 'gray.600'}
        _hover={item.disabled ? {} : { bg: 'gray.50' }}
        cursor={item.disabled ? 'not-allowed' : 'pointer'}
        display="flex"
        alignItems="center"
        justifyContent={isExpanded ? 'flex-start' : 'center'}
      >
        <HStack spacing={isExpanded ? 3 : 0}>
          <Icon as={item.icon} boxSize={4} />
          {isExpanded && (
            <>
              <Text fontSize="sm">{item.label}</Text>
              {item.disabled && <Text fontSize="xs" color="gray.400">(Soon)</Text>}
            </>
          )}
        </HStack>
      </Box>
    );

    if (!isExpanded && !item.disabled) {
      return (
        <Tooltip label={item.label} placement="right" hasArrow>
          {content}
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <Box 
      w={sidebarWidth} 
      bg="white" 
      borderRight="1px solid" 
      borderColor="gray.200" 
      h="calc(100vh - 72px)" 
      p={2}
      transition="width 0.2s ease"
    >
      <VStack spacing={2} align="stretch">
        {/* Toggle Button */}
        <Box display="flex" justifyContent={isExpanded ? "flex-end" : "center"} mb={2}>
          <Button
            size="xs"
            variant="ghost"
            onClick={toggleSidebar}
            px={2}
            py={1}
            minW="auto"
          >
            <Icon as={isExpanded ? ChevronLeft : ChevronRight} boxSize={4} />
          </Button>
        </Box>

        {/* Menu Items */}
        {menuItems.map((item) => (
          <SidebarItem key={item.label} item={item} />
        ))}
        
        {/* Logout Button */}
        <Box mt="auto">
          {!isExpanded ? (
            <Tooltip label="Logout" placement="right" hasArrow>
              <Box
                onClick={handleLogout}
                px={3}
                py={2}
                borderRadius="md"
                cursor="pointer"
                color="red.500"
                _hover={{ bg: 'red.50' }}
                display="flex"
                justifyContent="center"
              >
                <Icon as={LogOut} boxSize={4} />
              </Box>
            </Tooltip>
          ) : (
            <Box
              onClick={handleLogout}
              px={3}
              py={2}
              borderRadius="md"
              cursor="pointer"
              color="red.500"
              _hover={{ bg: 'red.50' }}
            >
              <HStack spacing={3}>
                <Icon as={LogOut} boxSize={4} />
                <Text fontSize="sm">Logout</Text>
              </HStack>
            </Box>
          )}
        </Box>
      </VStack>
    </Box>
  );
}
