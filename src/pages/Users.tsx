import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Card, 
  Avatar,
  Badge,
  Button,
  Input,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer
} from '@chakra-ui/react';
import { 
  Search, 
  Plus, 
  MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Users() {
  const navigate = useNavigate();

  const users = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@claimtech.io',
      phone: '+1 (555) 123-4567',
      role: 'Admin',
      status: 'Active',
      avatar: ''
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@claimtech.io',
      phone: '+1 (555) 234-5678',
      role: 'Manager',
      status: 'Active',
      avatar: ''
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@claimtech.io',
      phone: '+1 (555) 345-6789',
      role: 'Staff',
      status: 'Inactive',
      avatar: ''
    },
    {
      id: '4',
      name: 'Lisa Brown',
      email: 'lisa@claimtech.io',
      phone: '+1 (555) 456-7890',
      role: 'Staff',
      status: 'Active',
      avatar: ''
    },
    {
      id: '5',
      name: 'Tom Davis',
      email: 'tom@claimtech.io',
      phone: '+1 (555) 567-8901',
      role: 'Manager',
      status: 'Active',
      avatar: ''
    }
  ];

  const handleUserClick = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <HStack justify="space-between" mb={4}>
            <VStack spacing={1} align="start">
              <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                Users
              </Text>
              <Text fontSize="sm" color="gray.600">
                Manage your team members
              </Text>
            </VStack>
            
            <Button
              leftIcon={<Plus size={16} />}
              colorScheme="blue"
              size="sm"
            >
              Add User
            </Button>
          </HStack>

          {/* Search Bar */}
          <Box position="relative" maxW="400px">
            <Input
              placeholder="Search users..."
              bg="white"
              border="1px solid"
              borderColor="gray.300"
              borderRadius="lg"
              pl={10}
              pr={4}
              py={2}
              fontSize="sm"
              _focus={{
                borderColor: 'blue.500',
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
        </Box>

        {/* Users Table */}
        <Card>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>User</Th>
                  <Th>Role</Th>
                  <Th>Status</Th>
                  <Th>Contact</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user) => (
                  <Tr 
                    key={user.id} 
                    _hover={{ bg: 'blue.50' }} 
                    cursor="pointer"
                    onClick={() => handleUserClick(user.id)}
                  >
                    <Td>
                      <HStack spacing={3}>
                        <Avatar size="sm" name={user.name} src={user.avatar} />
                        <VStack spacing={0} align="start">
                          <Text fontSize="sm" fontWeight="medium" color="gray.800">
                            {user.name}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {user.email}
                          </Text>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td>
                      <Badge
                        size="sm"
                        colorScheme={
                          user.role === 'Admin' ? 'red' :
                          user.role === 'Manager' ? 'blue' : 'gray'
                        }
                        variant="subtle"
                      >
                        {user.role}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge
                        size="sm"
                        colorScheme={user.status === 'Active' ? 'green' : 'gray'}
                        variant="subtle"
                      >
                        {user.status}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="gray.600">
                        {user.phone}
                      </Text>
                    </Td>
                    <Td>
                      <IconButton
                        aria-label="More options"
                        icon={<MoreVertical size={14} />}
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle more options
                        }}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
      </VStack>
    </Box>
  );
} 