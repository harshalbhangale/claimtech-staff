import { 
  Box, 
  Container, 
  VStack, 
  HStack, 
  Text, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Badge, 
  Button, 
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
  Skeleton,
} from '@chakra-ui/react';
import { 
  Search, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI, type User as UserType, type UsersParams } from '../../api/users'; // Ensure this path is correct for your project

// Motion components
const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Fixed at 10 users per page
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [ordering, setOrdering] = useState('created_at');
  const [sortField, setSortField] = useState<'name' | 'email' | 'age' | 'created_at'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isPageChanging, setIsPageChanging] = useState(false);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  const toast = useToast();

  // Handle column sorting
  const handleSort = (field: 'name' | 'email' | 'age' | 'created_at') => {
    console.log('🔄 Sorting clicked for field:', field);
    
    let newDirection: 'asc' | 'desc' = 'asc';
    
    if (sortField === field) {
      // Toggle direction if same field
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    
    setSortField(field);
    setSortDirection(newDirection);
    
    // Convert to API ordering format
    let apiOrdering = '';
    switch (field) {
      case 'name':
        apiOrdering = newDirection === 'desc' ? '-first_name' : 'first_name';
        break;
      case 'email':
        apiOrdering = newDirection === 'desc' ? '-email' : 'email';
        break;
      case 'age':
        apiOrdering = newDirection === 'desc' ? '-date_of_birth' : 'date_of_birth';
        break;
      case 'created_at':
        apiOrdering = newDirection === 'desc' ? '-created_at' : 'created_at';
        break;
    }
    
    console.log('📊 Setting API ordering to:', apiOrdering);
    setOrdering(apiOrdering);
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Get sort icon for column headers
  const getSortIcon = (field: 'name' | 'email' | 'age' | 'created_at') => {
    if (sortField !== field) {
      return ArrowUpDown;
    }
    return sortDirection === 'asc' ? ArrowUp : ArrowDown;
  };

  // Memoized age calculation for better performance
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

  // Optimized fetch users with caching and minimal loading
  const fetchUsers = async (showLoading = true) => {
    try {
      if (showLoading || isInitialLoad) {
        setLoading(true);
      }
      setError(null);

      const params: UsersParams = {
        page: currentPage,
        page_size: pageSize,
        search: searchQuery || undefined,
        ordering: ordering
      };

      console.log('Fetching users with params:', params);
      const response = await usersAPI.getUsers(params);
      console.log('API Response:', response);
      
      // Handle different response structures based on typical API responses
      const usersData = response.results || (response as any).data?.results || (response as any).data || (response as any) || [];
      const totalCountData = response.count || (response as any).data?.count || (response as any).total || 0;
      
      console.log('Users data:', usersData);
      console.log('Total count:', totalCountData);
      
      // Calculate age for each user (optimized)
      const usersWithAge = usersData.map((user: any) => { // Cast user to 'any' for flexible property access
        return {
          ...user,
          age: user.date_of_birth ? calculateAge(user.date_of_birth) : 0,
          id: user.id, // Fallback ID for display
          first_name: user.first_name || 'N/A',
          last_name: user.last_name || 'N/A',
          email: user.email || 'N/A',
          is_active: user.is_active !== undefined ? user.is_active : true, // Default to true if not provided
          created_at: user.created_at || new Date().toISOString(),
          phone: user.phone || user.phone_number || user.mobile || user.mobile_number || 'No phone',
        };
      });

      setUsers(usersWithAge);
      setTotalCount(totalCountData);
      setIsInitialLoad(false);
      setIsPageChanging(false);
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
      setIsPageChanging(false);
    }
  };

  // Optimized useEffect with debounced search
  useEffect(() => {
    console.log('useEffect triggered with:', { currentPage, pageSize, searchQuery, ordering });
    const timer = setTimeout(() => {
      console.log('Executing fetchUsers with searchQuery:', searchQuery);
      fetchUsers();
    }, searchQuery ? 300 : 0); // Debounce search, immediate for other changes

    return () => clearTimeout(timer);
  }, [currentPage, pageSize, searchQuery, ordering]); // Dependencies for refetching users

  // Reset to first page when searching
  useEffect(() => {
    if (searchQuery !== '') {
      console.log('🔍 Search query changed, resetting to page 1');
      setCurrentPage(1);
    }
  }, [searchQuery]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  const handlePageChange = (page: number) => {
    // Prevent changing page if already changing or if page is out of bounds
    if (page !== currentPage && !isPageChanging && page >= 1 && page <= totalPages) {
      setIsPageChanging(true);
      setCurrentPage(page);
    }
  };

  const handleRefresh = () => {
    fetchUsers(true); // Show loading spinner for manual refresh
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <VStack spacing={4} align="stretch">
      {[...Array(pageSize)].map((_, i) => ( // Render skeleton items equal to pageSize
        <HStack key={i} spacing={4} p={4} bg={cardBg} borderRadius="lg">
          <Skeleton height="40px" width="40px" borderRadius="full" />
          <VStack flex="1" align="start" spacing={2}>
            <Skeleton height="16px" width="60%" />
            <Skeleton height="14px" width="40%" />
          </VStack>
          <Skeleton height="20px" width="80px" />
          <Skeleton height="20px" width="60px" />
        </HStack>
      ))}
    </VStack>
  );

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        {/* Enhanced Header */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          mb={8}
        >
          <Box
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            borderRadius="xl"
            p={6}
            color="white"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              zIndex: 0
            }}
          >
            <HStack justify="space-between" position="relative" zIndex={1}>
              <VStack align="start" spacing={3}>
                <Heading size="lg" fontWeight="bold">
                  Users Management
                </Heading>
              </VStack>
            </HStack>
          </Box>
        </MotionBox>

        {/* Enhanced Search and Filters */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          bg={cardBg}
          borderRadius="2xl"
          p={6}
          mb={8}
          shadow="xl"
          border="1px solid"
          borderColor="purple.100"
          _hover={{ shadow: "2xl", transform: "translateY(-2px)" }}
        >
          <VStack spacing={4}>
            <HStack w="full" justify="space-between">
              <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                Search & Filters
              </Text>
              <Badge colorScheme="purple" variant="subtle" px={3} py={1} borderRadius="full">
                {totalCount} Users
              </Badge>
            </HStack>
            
            <HStack w="full" spacing={4}>
              {/* Enhanced Search Input */}
              <Box flex="1" position="relative">
                <Input
                  placeholder="Search users by name, email, phone, or ID..."
                  value={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log('🔍 Search input changed:', value);
                    setSearchQuery(value);
                  }}
                  pl={12}
                  pr={searchQuery ? 12 : 4}
                  borderRadius="xl"
                  size="lg"
                  isDisabled={loading}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  border="2px solid"
                  borderColor="transparent"
                  _focus={{
                    borderColor: 'purple.400',
                    boxShadow: '0 0 0 1px purple.400',
                    bg: 'white'
                  }}
                  _hover={{ bg: 'white' }}
                  autoComplete="off"
                />
                <Icon
                  as={Search}
                  position="absolute"
                  left={4}
                  top="50%"
                  transform="translateY(-50%)"
                  color={loading ? "purple.400" : searchQuery ? "purple.600" : "gray.400"}
                  boxSize={5}
                />
                {searchQuery && (
                  <IconButton
                    aria-label="Clear search"
                    icon={<Text fontSize="lg" fontWeight="bold">×</Text>}
                    position="absolute"
                    right={2}
                    top="50%"
                    transform="translateY(-50%)"
                    size="sm"
                    variant="ghost"
                    colorScheme="purple"
                    onClick={() => {
                      console.log('🧹 Clearing search query');
                      setSearchQuery('');
                    }}
                    borderRadius="full"
                    _hover={{ bg: 'purple.100' }}
                  />
                )}
              </Box>

              {/* Enhanced Refresh Button */}
              <Tooltip label="Refresh data" hasArrow>
                <IconButton
                  aria-label="Refresh"
                  icon={<RefreshCw size={18} />}
                  onClick={handleRefresh}
                  isLoading={loading}
                  variant="outline"
                  colorScheme="purple"
                  borderRadius="xl"
                  size="lg"
                  _hover={{ bg: 'purple.50' }}
                />
              </Tooltip>
            </HStack>
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

        {/* Enhanced Users Table */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          bg={cardBg}
          borderRadius="2xl"
          overflow="hidden"
          shadow="xl"
          border="1px solid"
          borderColor="purple.100"
        >
          {loading ? (
            <Box p={6}>
              <LoadingSkeleton />
            </Box>
          ) : users.length === 0 ? (
            <Box p={8} textAlign="center">
              <VStack spacing={4}>
                <Box
                  w="80px"
                  h="80px"
                  borderRadius="full"
                  bg="purple.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={Search} boxSize={8} color="purple.500" />
                </Box>
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
          ) : (
            <>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr bg="linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)">
                      <Th 
                        px={6} 
                        py={5} 
                        fontSize="sm" 
                        fontWeight="bold" 
                        color="purple.700"
                        textTransform="uppercase"
                        letterSpacing="wide"
                        cursor="pointer"
                        _hover={{ bg: 'purple.50', color: 'purple.800' }}
                        onClick={() => handleSort('name')}
                        transition="all 0.2s"
                      >
                        <HStack spacing={2}>
                          <Text>User</Text>
                          <Icon 
                            as={getSortIcon('name')} 
                            boxSize={4} 
                            color={sortField === 'name' ? 'purple.600' : 'purple.400'}
                          />
                        </HStack>
                      </Th>
                      <Th 
                        px={6} 
                        py={5} 
                        fontSize="sm" 
                        fontWeight="bold" 
                        color="purple.700"
                        textTransform="uppercase"
                        letterSpacing="wide"
                        cursor="pointer"
                        _hover={{ bg: 'purple.50', color: 'purple.800' }}
                        onClick={() => handleSort('email')}
                        transition="all 0.2s"
                      >
                        <HStack spacing={2}>
                          <Text>Contact</Text>
                          <Icon 
                            as={getSortIcon('email')} 
                            boxSize={4} 
                            color={sortField === 'email' ? 'purple.600' : 'purple.400'}
                          />
                        </HStack>
                      </Th>
                      <Th 
                        px={6} 
                        py={5} 
                        fontSize="sm" 
                        fontWeight="bold" 
                        color="purple.700"
                        textTransform="uppercase"
                        letterSpacing="wide"
                        cursor="pointer"
                        _hover={{ bg: 'purple.50', color: 'purple.800' }}
                        onClick={() => handleSort('age')}
                        transition="all 0.2s"
                      >
                        <HStack spacing={2}>
                          <Text>Age</Text>
                          <Icon 
                            as={getSortIcon('age')} 
                            boxSize={4} 
                            color={sortField === 'age' ? 'purple.600' : 'purple.400'}
                          />
                        </HStack>
                      </Th>
                      <Th 
                        px={6} 
                        py={5} 
                        fontSize="sm" 
                        fontWeight="bold" 
                        color="purple.700"
                        textTransform="uppercase"
                        letterSpacing="wide"
                        cursor="pointer"
                        _hover={{ bg: 'purple.50', color: 'purple.800' }}
                        onClick={() => handleSort('created_at')}
                        transition="all 0.2s"
                      >
                        <HStack spacing={2}>
                          <Text>Created</Text>
                          <Icon 
                            as={getSortIcon('created_at')} 
                            boxSize={4} 
                            color={sortField === 'created_at' ? 'purple.600' : 'purple.400'}
                          />
                        </HStack>
                      </Th>
                      <Th 
                        px={6} 
                        py={5} 
                        fontSize="sm" 
                        fontWeight="bold" 
                        color="purple.700"
                        textTransform="uppercase"
                        letterSpacing="wide"
                        textAlign="center"
                      >
                        Actions
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {users.map((user) => (
                      <Tr 
                        key={user.id} 
                        _hover={{ 
                          bg: useColorModeValue('purple.50', 'purple.900'),
                          shadow: 'md',
                          transform: 'translateY(-2px)'
                        }}
                        cursor="pointer"
                        onClick={() => navigate(`/users/${user.id}`)}
                        transition="all 0.3s"
                        _active={{ transform: 'scale(0.98)' }}
                        position="relative"
                        borderBottom="1px solid"
                        borderColor="purple.100"
                      >
                        <Td px={6} py={5}>
                          <HStack spacing={4}>
                            <Box position="relative">
                              <Avatar 
                                size="md" 
                                name={`${user.first_name} ${user.last_name}`}
                                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                color="white"
                                border="3px solid"
                                borderColor="purple.200"
                                shadow="md"
                              />
                              <Box
                                position="absolute"
                                bottom="-2px"
                                right="-2px"
                                w="4"
                                h="4"
                                bg="green.400"
                                borderRadius="full"
                                border="2px solid white"
                              />
                            </Box>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="bold" color={textColor} fontSize="md">
                                {user.first_name} {user.last_name}
                              </Text>
                              <Badge 
                                colorScheme="purple" 
                                variant="subtle" 
                                fontSize="xs"
                                px={2}
                                py={1}
                                borderRadius="md"
                              >
                                ID: {user.id}
                              </Badge>
                            </VStack>
                          </HStack>
                        </Td>
                        <Td px={6} py={5}>
                          <VStack align="start" spacing={2}>
                            <HStack spacing={3}>
                              <Box
                                bg="blue.100"
                                p={1}
                                borderRadius="md"
                              >
                                <Icon as={Mail} boxSize={3} color="blue.600" />
                              </Box>
                              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                {user.email}
                              </Text>
                            </HStack>
                            <HStack spacing={3}>
                              <Box
                                bg="green.100"
                                p={1}
                                borderRadius="md"
                              >
                                <Icon as={Phone} boxSize={3} color="green.600" />
                              </Box>
                              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                {user.phone}
                              </Text>
                            </HStack>
                          </VStack>
                        </Td>
                        <Td px={6} py={5}>
                          <HStack spacing={3}>
                            <Box
                              bg="orange.100"
                              p={2}
                              borderRadius="lg"
                            >
                              <Icon as={Calendar} boxSize={4} color="orange.600" />
                            </Box>
                            <VStack align="start" spacing={0}>
                              <Text fontSize="md" fontWeight="bold" color={textColor}>
                                {user.age}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                years old
                              </Text>
                            </VStack>
                          </HStack>
                        </Td>
                        <Td px={6} py={5}>
                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                              {new Date(user.created_at).toLocaleDateString()}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {new Date(user.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Text>
                          </VStack>
                        </Td>
                        <Td px={6} py={5}>
                          <HStack justify="center" spacing={1}>
                            <Tooltip label="View Details" hasArrow>
                              <IconButton
                                aria-label="View user"
                                icon={<Eye size={16} />}
                                size="sm"
                                variant="solid"
                                colorScheme="blue"
                                borderRadius="lg"
                                _hover={{ transform: 'scale(1.05)' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/users/${user.id}`);
                                }}
                              />
                            </Tooltip>
                            <Tooltip label="Edit User" hasArrow>
                              <IconButton
                                aria-label="Edit user"
                                icon={<Edit size={16} />}
                                size="sm"
                                variant="solid"
                                colorScheme="green"
                                borderRadius="lg"
                                _hover={{ transform: 'scale(1.05)' }}
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
                                icon={<MoreVertical size={16} />}
                                size="sm"
                                variant="solid"
                                colorScheme="purple"
                                borderRadius="lg"
                                _hover={{ transform: 'scale(1.05)' }}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <MenuList 
                                onClick={(e) => e.stopPropagation()}
                                borderRadius="xl"
                                border="1px solid"
                                borderColor="purple.200"
                                shadow="xl"
                              >
                                <MenuItem 
                                  icon={<Download size={16} />}
                                  onClick={(e) => e.stopPropagation()}
                                  borderRadius="lg"
                                  _hover={{ bg: 'blue.50' }}
                                >
                                  Export Data
                                </MenuItem>
                                <MenuItem 
                                  icon={<Trash2 size={16} />} 
                                  color="red.500"
                                  onClick={(e) => e.stopPropagation()}
                                  borderRadius="lg"
                                  _hover={{ bg: 'red.50' }}
                                >
                                  Delete User
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </>
          )}
        </MotionCard>
        {/* Enhanced Results Summary */}
        {totalCount > 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            mt={8}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={6}
          >
            <Box
              bg={cardBg}
              px={6}
              py={3}
              borderRadius="xl"
              border="1px solid"
              borderColor="purple.200"
              shadow="sm"
            >
              <HStack spacing={4}>
                <Text color="purple.600" fontSize="sm" fontWeight="semibold">
                  Showing {startItem} to {endItem} of {totalCount} users
                </Text>
                <Badge colorScheme="purple" variant="subtle" borderRadius="full">
                  Page {currentPage} of {totalPages}
                </Badge>
              </HStack>
            </Box>
            
            {/* Page Size Info */}
            <Box
              bg={cardBg}
              px={4}
              py={2}
              borderRadius="lg"
              border="1px solid"
              borderColor="purple.100"
              shadow="sm"
            >
              <Text color="gray.600" fontSize="xs" fontWeight="medium">
                {pageSize} users per page
              </Text>
            </Box>
          </MotionBox>
        )}

        {/* Enhanced Modern Purple Pagination */}
        {totalCount > 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            mt={4}
            display="flex"
            justifyContent="center"
          >
            <Box
              bg="white"
              p={2}
              borderRadius="2xl"
              shadow="2xl"
              border="1px solid"
              borderColor="purple.200"
            >
              <HStack 
                spacing={2} 
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                p={3} 
                borderRadius="xl" 
                position="relative"
                overflow="hidden"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: '-50%',
                  left: '-20%',
                  width: '140%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                  zIndex: 0
                }}
              >
                {/* Previous Button */}
                <IconButton
                  aria-label="Previous page"
                  icon={<ChevronLeft size={16} />}
                  size="sm"
                  variant="solid"
                  onClick={() => handlePageChange(currentPage - 1)}
                  isDisabled={currentPage === 1 || isPageChanging}
                  borderRadius="lg"
                  bg="white"
                  color="purple.600"
                  border="2px solid"
                  borderColor="purple.200"
                  _hover={{ 
                    bg: 'purple.50',
                    transform: 'scale(1.05)',
                    borderColor: 'purple.300'
                  }}
                  _disabled={{ 
                    opacity: 0.4, 
                    cursor: 'not-allowed',
                    transform: 'none'
                  }}
                  zIndex={1}
                  position="relative"
                  shadow="sm"
                />

              {/* Page Numbers with Smart Display */}
              {totalPages > 0 && (() => {
                const maxVisiblePages = 7;
                const halfVisible = Math.floor(maxVisiblePages / 2);
                let startPage = 1;
                let endPage = totalPages;
                let showStartEllipsis = false;
                let showEndEllipsis = false;

                if (totalPages > maxVisiblePages) {
                  if (currentPage <= halfVisible + 1) {
                    endPage = maxVisiblePages - 1;
                    showEndEllipsis = true;
                  } else if (currentPage >= totalPages - halfVisible) {
                    startPage = totalPages - maxVisiblePages + 2;
                    showStartEllipsis = true;
                  } else {
                    startPage = currentPage - halfVisible + 1;
                    endPage = currentPage + halfVisible - 1;
                    showStartEllipsis = true;
                    showEndEllipsis = true;
                  }
                }

                const pageNumbers = [];

                // Always show first page
                if (showStartEllipsis) {
                  pageNumbers.push(1);
                  if (startPage > 2) {
                    pageNumbers.push('start-ellipsis');
                  }
                }

                // Show visible pages
                for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(i);
                }

                // Always show last page
                if (showEndEllipsis) {
                  if (endPage < totalPages - 1) {
                    pageNumbers.push('end-ellipsis');
                  }
                  pageNumbers.push(totalPages);
                }

                return pageNumbers.map((pageNum, _index) => {
                  if (pageNum === 'start-ellipsis' || pageNum === 'end-ellipsis') {
                    return (
                      <Text
                        key={pageNum}
                        color="white"
                        fontSize="sm"
                        fontWeight="bold"
                        px={2}
                        opacity={0.7}
                      >
                        ...
                      </Text>
                    );
                  }

                  const isActive = currentPage === pageNum;
                  return (
                    <Button
                      key={pageNum}
                      size="sm"
                      variant="solid"
                      bg={isActive ? "white" : "rgba(255,255,255,0.8)"}
                      color={isActive ? "purple.700" : "purple.600"}
                      border="2px solid"
                      borderColor={isActive ? "purple.400" : "purple.200"}
                      onClick={() => handlePageChange(pageNum as number)}
                      isDisabled={isPageChanging}
                      borderRadius="lg"
                      minW="36px"
                      h="36px"
                      fontSize="sm"
                      fontWeight="bold"
                      _hover={{ 
                        bg: "white",
                        transform: "scale(1.1)",
                        borderColor: "purple.400",
                        shadow: "md"
                      }}
                      _active={{ transform: "scale(0.95)" }}
                      transition="all 0.2s"
                      zIndex={1}
                      position="relative"
                      shadow={isActive ? "md" : "sm"}
                    >
                      {pageNum}
                    </Button>
                  );
                });
              })()}

                {/* Next Button */}
                <IconButton
                  aria-label="Next page"
                  icon={<ChevronRight size={16} />}
                  size="sm"
                  variant="solid"
                  onClick={() => handlePageChange(currentPage + 1)}
                  isDisabled={currentPage === totalPages || isPageChanging}
                  borderRadius="lg"
                  bg="white"
                  color="purple.600"
                  border="2px solid"
                  borderColor="purple.200"
                  _hover={{ 
                    bg: 'purple.50',
                    transform: 'scale(1.05)',
                    borderColor: 'purple.300'
                  }}
                  _disabled={{ 
                    opacity: 0.4, 
                    cursor: 'not-allowed',
                    transform: 'none'
                  }}
                  zIndex={1}
                  position="relative"
                  shadow="sm"
                />
              </HStack>
            </Box>
          </MotionBox>
        )}
      </Container>
    </Box>
  );
}

