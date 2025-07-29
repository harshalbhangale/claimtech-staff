import { 
  Box, 
  HStack, 
  VStack,
  Text, 
  Avatar, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem,
  Badge,
  useColorModeValue,
  Button,
  Image
} from '@chakra-ui/react';
import { 
  User, 
  LogOut, 
  Settings, 
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Motion components
const MotionBox = motion(Box);
const MotionHStack = motion(HStack);

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const menuBg = useColorModeValue('white', 'gray.800');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      bg={bgColor}
      borderBottom="1px solid"
      borderColor={borderColor}
      px={6}
      py={4}
      position="sticky"
      top={0}
      zIndex={1000}
      boxShadow="0 4px 20px rgba(0,0,0,0.05)"
    >
      <HStack spacing={8} justify="space-between">
        {/* Logo Section */}
        <HStack spacing={6}>
          <MotionHStack
            spacing={3}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            cursor="pointer"
            onClick={() => navigate('/dashboard')}
          >
            <Box
              w={10}
              h={10}
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              shadow="lg"
            >
              <Image src="/logo.png" alt="Claimtech" width={10} height={10} />
            </Box>
            
            <VStack spacing={0} align="start">
              <Text 
                fontWeight="bold" 
                fontSize="lg" 
                color={textColor}
              >
                Claimtech
              </Text>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                Staff Portal
              </Text>
            </VStack>
          </MotionHStack>

          {/* Status Badge */}
          <Badge 
            colorScheme="green" 
            variant="subtle"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="xs"
            fontWeight="medium"
          >
            <HStack spacing={1}>
              <Box
                w="2px"
                h="2px"
                bg="green.400"
                borderRadius="full"
              />
              <Text>Live</Text>
            </HStack>
          </Badge>
        </HStack>

        {/* User Profile Menu */}
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDown size={16} />}
            variant="ghost"
            display="flex"
            alignItems="center"
            borderRadius="lg"
            _hover={{ 
              bg: hoverBg
            }}
            transition="all 0.2s"
          >
            <HStack spacing={3}>
              <Avatar 
                size="sm" 
                name={user?.name || 'User'} 
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                color="white"
                fontWeight="bold"
                border="2px solid"
                borderColor="blue.200"
                shadow="md"
              />
              <VStack spacing={0} align="start">
                <Text fontWeight="semibold" color={textColor} fontSize="sm">
                  {user?.name || 'User'}
                </Text>
              </VStack>
            </HStack>
          </MenuButton>

          <MenuList
            bg={menuBg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="xl"
            boxShadow="0 10px 40px rgba(0,0,0,0.1)"
            py={2}
            minW="200px"
          >
            <MenuItem 
              icon={<User size={16} />}
              _hover={{ bg: 'blue.50' }}
              borderRadius="md"
              mx={2}
              my={1}
              isDisabled
              opacity={0.6}
            >
              Profile <Text fontSize="xs" as="span" ml={2} color="purple.500">(Coming soon)</Text>
            </MenuItem>

            <MenuItem 
              icon={<Settings size={16} />}
              _hover={{ bg: 'purple.50' }}
              borderRadius="md"
              mx={2}
              my={1}
              isDisabled
              opacity={0.6}
            >
              Settings <Text fontSize="xs" as="span" ml={2} color="purple.500">(Coming soon)</Text>
            </MenuItem>

            <MenuItem 
              icon={<HelpCircle size={16} />}
              _hover={{ bg: 'orange.50' }}
              borderRadius="md"
              mx={2}
              my={1}
              isDisabled
              opacity={0.6}
            >
              Help <Text fontSize="xs" as="span" ml={2} color="purple.500">(Coming soon)</Text>
            </MenuItem>

            <Box borderTop="1px solid" borderColor={borderColor} my={1} />

            <MenuItem 
              icon={<LogOut size={16} />} 
              onClick={handleLogout}
              _hover={{ bg: 'red.50' }}
              borderRadius="md"
              mx={2}
              my={1}
              color="red.600"
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </MotionBox>
  );
}