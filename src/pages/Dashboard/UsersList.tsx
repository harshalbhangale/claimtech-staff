import { 
  Box, 
  Container, 
  VStack, 
  HStack, 
  Text, 
  Badge, 
  Input, 
  Card, 
  Heading,
  Icon,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
  useToast,
  useBreakpointValue,
  Flex,
} from '@chakra-ui/react';
import { 
  Search, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Grid,
  List,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable, { type TableColumn } from 'react-data-table-component';
import { usersAPI, type User as UserType, type UsersParams } from '../../api/users';

// Motion components
const MotionBox = motion(Box);
const MotionCard = motion(Card);

// Enhanced User type with calculated age
interface EnhancedUser extends UserType {
  age: number;
}

import { Skeleton, SkeletonCircle } from "@chakra-ui/react";

function DataTableSkeleton({ rows = 10 }) {
  return (
    <Box p={6}>
      {/* Header skeleton */}
      <HStack spacing={4} mb={6} px={6} py={4} bg="gray.50" borderRadius="lg">
        <Skeleton height="20px" width="80px" />
        <Skeleton height="20px" width="120px" />
        <Skeleton height="20px" width="60px" />
        <Skeleton height="20px" width="100px" />
        <Skeleton height="20px" width="80px" />
      </HStack>
      
      {/* Rows skeleton */}
      <VStack spacing={3} align="stretch">
        {[...Array(rows)].map((_, rowIdx) => (
          <HStack key={rowIdx} spacing={6} p={4} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.100">
            {/* User column */}
            <HStack spacing={3} minW="250px">
              <SkeletonCircle size="10" />
              <VStack align="start" spacing={1}>
                <Skeleton height="16px" width="120px" />
                <Skeleton height="12px" width="80px" />
              </VStack>
            </HStack>
            
            {/* Contact column */}
            <VStack align="start" spacing={2} minW="280px">
              <HStack spacing={2}>
                <Skeleton height="16px" width="16px" borderRadius="md" />
                <Skeleton height="14px" width="180px" />
              </HStack>
              <HStack spacing={2}>
                <Skeleton height="16px" width="16px" borderRadius="md" />
                <Skeleton height="14px" width="140px" />
              </HStack>
            </VStack>
            
            {/* Age column */}
            <HStack spacing={2} minW="100px">
              <Skeleton height="20px" width="20px" borderRadius="lg" />
              <VStack align="start" spacing={0}>
                <Skeleton height="14px" width="30px" />
                <Skeleton height="10px" width="40px" />
              </VStack>
            </HStack>
            
            {/* Created column */}
            <VStack align="start" spacing={1} minW="140px">
              <Skeleton height="14px" width="80px" />
              <Skeleton height="10px" width="60px" />
            </VStack>
            
            {/* Actions column */}
            <HStack spacing={1} minW="120px">
              <Skeleton height="24px" width="24px" borderRadius="md" />
              <Skeleton height="24px" width="24px" borderRadius="md" />
              <Skeleton height="24px" width="24px" borderRadius="md" />
            </HStack>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<EnhancedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<EnhancedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ordering] = useState('created_at');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false });
  const cardColumns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 });

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const toast = useToast();

  // Calculate age utility function
  const calculateAge = useMemo(() => {
    return (dateOfBirth: string): number => {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    };
  }, []);

  // Optimized fetch users function
  const fetchUsers = useCallback(async (showLoading = true) => {
    try {
      if (showLoading || isInitialLoad) {
        setLoading(true);
      }
      setError(null);

      const params: UsersParams = {
        page: 1, // Load all for client-side pagination/search
        page_size: 1000, // Adjust based on your needs
        ordering: ordering
      };

      console.log('Fetching users with params:', params);
      const response = await usersAPI.getUsers(params);
      
      const usersData = response.results || (response as any).data?.results || (response as any).data || (response as any) || [];
      const totalCountData = response.count || (response as any).data?.count || (response as any).total || usersData.length;
      
      // Calculate age for each user
      const usersWithAge: EnhancedUser[] = usersData.map((user: any) => ({
        ...user,
        age: user.date_of_birth ? calculateAge(user.date_of_birth) : 0,
        id: user.id,
        first_name: user.first_name || 'N/A',
        last_name: user.last_name || 'N/A',
        email: user.email || 'N/A',
        is_active: user.is_active !== undefined ? user.is_active : true,
        created_at: user.created_at || new Date().toISOString(),
        phone: user.phone || user.phone_number || user.mobile || user.mobile_number || 'No phone',
      }));

      setUsers(usersWithAge);
      setFilteredUsers(usersWithAge);
      setTotalCount(totalCountData);
      setIsInitialLoad(false);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.detail || 
                          err.message || 
                          'Failed to fetch users';
      
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      if (showLoading || isInitialLoad) {
        setLoading(false);
      }
    }
  }, [calculateAge, isInitialLoad, ordering, toast]);

  // Search functionality
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user => 
      user.first_name.toLowerCase().includes(query.toLowerCase()) ||
      user.last_name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      (user.phone ? user.phone.toLowerCase().includes(query.toLowerCase()) : false) ||
      user.id.toString().includes(query.toLowerCase())
    );
    
    setFilteredUsers(filtered);
  }, [users]);

  // Handle sorting
  const handleSort = useCallback((column: any, sortDirection: string) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    const sortedData = [...filteredUsers].sort((a, b) => {
      const aValue = column.selector(a);
      const bValue = column.selector(b);
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction * aValue.localeCompare(bValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction * (aValue - bValue);
      }
      
      return direction * String(aValue).localeCompare(String(bValue));
    });
    
    setFilteredUsers(sortedData);
  }, [filteredUsers]);

  // Data table columns configuration
  const columns: TableColumn<EnhancedUser>[] = useMemo(() => [
    {
      name: 'User',
      selector: (row: EnhancedUser) => `${row.first_name} ${row.last_name}`,
      sortable: true,
      minWidth: isMobile ? '200px' : '250px',
      cell: (row: EnhancedUser) => (
        <HStack spacing={3} py={2}>
          <Box position="relative">
            <Avatar 
              size={isMobile ? "sm" : "md"}
              name={`${row.first_name} ${row.last_name}`}
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              border="2px solid"
              borderColor="purple.200"
            />
            <Box
              position="absolute"
              bottom="-1px"
              right="-1px"
              w="3"
              h="3"
              bg="green.400"
              borderRadius="full"
              border="2px solid white"
            />
          </Box>
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold" color={textColor} fontSize={isMobile ? "sm" : "md"}>
              {row.first_name} {row.last_name}
            </Text>
            <Badge 
              colorScheme="purple" 
              variant="subtle" 
              fontSize="8px"
              px={2}
              py={0.5}
              borderRadius="md"
            >
              ID: {row.id}
            </Badge>
          </VStack>
        </HStack>
      ),
    },
    {
      name: 'Contact',
      selector: (row: EnhancedUser) => row.email,
      sortable: true,
      minWidth: isMobile ? '200px' : '280px',
      cell: (row: EnhancedUser) => (
        <VStack align="start" spacing={1} py={2}>
          <HStack spacing={2}>
            <Box bg="blue.100" p={1} borderRadius="md">
              <Icon as={Mail} boxSize={2.5} color="blue.600" />
            </Box>
            <Text fontSize={isMobile ? "xs" : "sm"} color={textColor} noOfLines={1}>
              {row.email}
            </Text>
          </HStack>
          <HStack spacing={2}>
            <Box bg="green.100" p={1} borderRadius="md">
              <Icon as={Phone} boxSize={2.5} color="green.600" />
            </Box>
            <Text fontSize={isMobile ? "xs" : "sm"} color={textColor}>
              {row.phone}
            </Text>
          </HStack>
        </VStack>
      ),
    },
    {
      name: 'Date of Birth',
      selector: (row: EnhancedUser) => row.date_of_birth || '',
      sortable: true,
      minWidth: '140px',
      cell: (row: EnhancedUser) => (
        <HStack spacing={2}>
          <Box bg="orange.100" p={1.5} borderRadius="lg">
            <Icon as={Calendar} boxSize={3} color="orange.600" />
          </Box>
          <VStack align="start" spacing={0}>
            <Text fontSize="sm" fontWeight="bold" color={textColor}>
              {row.date_of_birth ? new Date(row.date_of_birth).toLocaleDateString() : 'N/A'}
            </Text>
            <Text fontSize="xs" color="gray.500">
              ({row.age} years old)
            </Text>
          </VStack>
        </HStack>
      ),
    },
    {
      name: 'Created',
      selector: (row: EnhancedUser) => row.created_at,
      sortable: true,
      minWidth: '140px',
      cell: (row: EnhancedUser) => (
        <VStack align="start" spacing={0}>
          <Text fontSize="sm" fontWeight="semibold" color={textColor}>
            {new Date(row.created_at).toLocaleDateString()}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {new Date(row.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </VStack>
      ),
    },
    {
      name: 'Actions',
      cell: (row: EnhancedUser) => (
        <HStack spacing={1}>
          <Tooltip label="View Details" hasArrow>
            <IconButton
              aria-label="View user"
              icon={<Eye size={14} />}
              size="xs"
              variant="solid"
              colorScheme="blue"
              borderRadius="md"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/users/${row.id}`);
              }}
            />
          </Tooltip>
          <Tooltip label="Edit User" hasArrow>
            <IconButton
              aria-label="Edit user"
              icon={<Edit size={14} />}
              size="xs"
              variant="solid"
              colorScheme="green"
              borderRadius="md"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implement edit functionality
              }}
            />
          </Tooltip>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="More options"
              icon={<MoreVertical size={14} />}
              size="xs"
              variant="solid"
              colorScheme="purple"
              borderRadius="md"
              onClick={(e) => e.stopPropagation()}
            />
            <MenuList borderRadius="lg" shadow="xl">
              <MenuItem icon={<Download size={14} />} borderRadius="md">
                Export Data
              </MenuItem>
              <MenuItem icon={<Trash2 size={14} />} color="red.500" borderRadius="md">
                Delete User
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      minWidth: '120px',
    },
  ], [isMobile, navigate, textColor]);

  // Custom styles for DataTable
  

  // Card view component for mobile
  const UserCard = ({ user }: { user: EnhancedUser }) => (
    <MotionCard
      bg={cardBg}
      p={4}
      borderRadius="xl"
      shadow="md"
      border="1px solid"
      borderColor="purple.100"
      _hover={{
        shadow: "lg",
        transform: "translateY(-2px)",
        borderColor: "purple.200",
      }}
      cursor="pointer"
      onClick={() => navigate(`/users/${user.id}`)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <VStack spacing={3} align="stretch">
        <HStack spacing={3}>
          <Avatar 
            size="md"
            name={`${user.first_name} ${user.last_name}`}
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
          />
          <VStack align="start" spacing={1} flex="1">
            <Text fontWeight="bold" fontSize="md" color={textColor}>
              {user.first_name} {user.last_name}
            </Text>
            <Badge colorScheme="purple" variant="subtle" fontSize="xs">
              ID: {user.id}
            </Badge>
          </VStack>
          <VStack align="end" spacing={0}>
            <Text fontSize="sm" fontWeight="bold" color="orange.500">
              {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'N/A'}
            </Text>
            <Text fontSize="xs" color="gray.500">
              ({user.age} years)
            </Text>
          </VStack>
        </HStack>
        
        <VStack spacing={2} align="stretch">
          <HStack spacing={2}>
            <Icon as={Mail} boxSize={4} color="blue.500" />
            <Text fontSize="sm" color={textColor} noOfLines={1}>
              {user.email}
            </Text>
          </HStack>
          <HStack spacing={2}>
            <Icon as={Phone} boxSize={4} color="green.500" />
            <Text fontSize="sm" color={textColor}>
              {user.phone}
            </Text>
          </HStack>
        </VStack>
        
        <HStack justify="space-between" pt={2}>
          <Text fontSize="xs" color="gray.500">
            {new Date(user.created_at).toLocaleDateString()}
          </Text>
          <HStack spacing={1}>
            <IconButton
              aria-label="View"
              icon={<Eye size={14} />}
              size="xs"
              colorScheme="blue"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/users/${user.id}`);
              }}
            />
            <IconButton
              aria-label="Edit"
              icon={<Edit size={14} />}
              size="xs"
              colorScheme="green"
              onClick={(e) => e.stopPropagation()}
            />
            <IconButton
              aria-label="More"
              icon={<MoreVertical size={14} />}
              size="xs"
              colorScheme="purple"
              onClick={(e) => e.stopPropagation()}
            />
          </HStack>
        </HStack>
      </VStack>
    </MotionCard>
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [handleSearch, searchQuery]);

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          mb={4}
        >
          <Box
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            borderRadius="md"
            p={3}
            color="white"
            position="relative"
            overflow="hidden"
          >
            <HStack justify="space-between">
              <Heading size="sm" fontWeight="semibold">
                Users
              </Heading>
              <Badge colorScheme="whiteAlpha" variant="solid" px={2} py={0.5} borderRadius="full" fontSize="xs">
                {totalCount} Users
              </Badge>
            </HStack>
          </Box>
        </MotionBox>

        {/* Search and Controls */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          bg={cardBg}
          borderRadius="2xl"
          p={6}
          mb={6}
          shadow="xl"
        >
          <VStack spacing={4}>
            <Flex justify="space-between" align="center" w="full" wrap="wrap" gap={4}>
              <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                Search & Filters
              </Text>
              <HStack spacing={2}>
                <IconButton
                  aria-label="Toggle view"
                  icon={viewMode === 'table' ? <Grid size={18} /> : <List size={18} />}
                  onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                  variant="outline"
                  colorScheme="purple"
                  size="sm"
                />
                <IconButton
                  aria-label="Refresh"
                  icon={<RefreshCw size={18} />}
                  onClick={() => fetchUsers(true)}
                  isLoading={loading}
                  variant="outline"
                  colorScheme="purple"
                  size="sm"
                />
              </HStack>
            </Flex>
            
            <Box w="full" position="relative">
              <Input
                placeholder="Search users by name, email, phone, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                pl={12}
                pr={4}
                borderRadius="xl"
                size="lg"
                bg={useColorModeValue('gray.50', 'gray.700')}
                border="2px solid"
                borderColor="transparent"
                _focus={{
                  borderColor: 'purple.400',
                  boxShadow: '0 0 0 1px purple.400',
                  bg: 'white'
                }}
              />
              <Icon
                as={Search}
                position="absolute"
                left={4}
                top="50%"
                transform="translateY(-50%)"
                color="purple.400"
                boxSize={5}
              />
            </Box>
          </VStack>
        </MotionCard>

        {/* Error Alert */}
        {error && (
          <Alert status="error" borderRadius="lg" mb={6}>
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Data Display */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          bg={cardBg}
          borderRadius="2xl"
          overflow="hidden"
          shadow="xl"
        >
          {viewMode === 'table' ? (
            <DataTable
              columns={columns}
              data={filteredUsers}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 20, 50]}
              sortServer={false}
              onSort={handleSort}
              progressPending={loading}
              progressComponent={<DataTableSkeleton rows={10} />}

              noDataComponent={
                <Box py={8} textAlign="center">
                  <VStack spacing={4}>
                    <Icon as={Search} boxSize={12} color="purple.300" />
                    <VStack spacing={2}>
                      <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                        {searchQuery ? 'No users found' : 'No users available'}
                      </Text>
                      <Text color="gray.500" fontSize="sm">
                        {searchQuery 
                          ? `No users match your search for "${searchQuery}"`
                          : 'There are no users in the system yet.'
                        }
                      </Text>
                    </VStack>
                  </VStack>
                </Box>
              }
              responsive
              highlightOnHover
              pointerOnHover
              onRowClicked={(row) => navigate(`/users/${row.id}`)}
              paginationComponentOptions={{
                rowsPerPageText: 'Rows per page:',
                rangeSeparatorText: 'of',
                noRowsPerPage: false,
                selectAllRowsItem: false,
              }}
            />
          ) : (
            <Box p={6}>
              {loading ? (
                <VStack spacing={4}>
                  <Icon as={RefreshCw} boxSize={8} color="purple.400" />
                  <Text color="purple.600">Loading users...</Text>
                </VStack>
              ) : filteredUsers.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <VStack spacing={4}>
                    <Icon as={Search} boxSize={12} color="purple.300" />
                    <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                      {searchQuery ? 'No users found' : 'No users available'}
                    </Text>
                  </VStack>
                </Box>
              ) : (
                <Box
                  display="grid"
                  gridTemplateColumns={`repeat(${cardColumns}, 1fr)`}
                  gap={4}
                >
                  {filteredUsers.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </MotionCard>
      </Container>
    </Box>
  );
}
