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
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI, type User as UserType, type UsersParams } from '../../api/users';

// Motion components
const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, _setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [ordering, _setOrdering] = useState('created_at');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isPageChanging, setIsPageChanging] = useState(false);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  const toast = useToast();

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

      const response = await usersAPI.getUsers(params);
      
      // Handle different response structures
      const usersData = response.results || (response as any).data || (response as any) || [];
      const totalCountData = response.count || (response as any).total || 0;
      
      // Calculate age for each user (optimized)
      const usersWithAge = usersData.map(user => {
        console.log('User data:', user); // Debug: log each user to see the structure
        return {
          ...user,
          age: user.date_of_birth ? calculateAge(user.date_of_birth) : 0
        };
      });

      setUsers(usersWithAge);
      setTotalCount(totalCountData);
      setIsInitialLoad(false);
      setIsPageChanging(false);
    } catch (err: any) {
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
    const timer = setTimeout(() => {
      fetchUsers();
    }, searchQuery ? 300 : 0); // Debounce search, immediate for other changes

    return () => clearTimeout(timer);
  }, [currentPage, pageSize, searchQuery, ordering]);

  // Reset to first page when searching
  useEffect(() => {
    if (searchQuery !== '') {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  const handlePageChange = (page: number) => {
    if (page !== currentPage && !isPageChanging) {
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
      {[...Array(5)].map((_, i) => (
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
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl">
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          mb={6}
        >
          <HStack justify="space-between" mb={6}>
            <VStack align="start" spacing={2}>
              <Heading size="lg" color={textColor}>
                Users Management
              </Heading>
              <Text color="gray.600">
                Manage and view all registered users
              </Text>
            </VStack>
          </HStack>
        </MotionBox>

        {/* Search and Filters */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          bg={cardBg}
          borderRadius="xl"
          p={6}
          mb={6}
          shadow="sm"
        >
          <HStack w="full" spacing={4}>
            {/* Search Input */}
            <Box flex="1" position="relative">
              <Input
                placeholder="Search users by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                pl={10}
                borderRadius="lg"
                size="md"
              />
              <Icon
                as={Search}
                position="absolute"
                left={3}
                top="50%"
                transform="translateY(-50%)"
                color="gray.400"
                boxSize={5}
              />
            </Box>

            {/* Refresh Button */}
            <Tooltip label="Refresh">
              <IconButton
                aria-label="Refresh"
                icon={<RefreshCw size={16} />}
                onClick={handleRefresh}
                isLoading={loading}
                variant="ghost"
                borderRadius="lg"
              />
            </Tooltip>
          </HStack>
        </MotionCard>

        {/* Error Alert */}
        {error && (
          <Alert status="error" borderRadius="lg" mb={6}>
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Users Table */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          bg={cardBg}
          borderRadius="xl"
          overflow="hidden"
          shadow="sm"
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
                    <Tr bg={useColorModeValue('gray.50', 'gray.700')}>
                      <Th px={6} py={4}>User</Th>
                      <Th px={6} py={4}>Contact</Th>
                      <Th px={6} py={4}>Age</Th>
                      <Th px={6} py={4}>Status</Th>
                      <Th px={6} py={4}>Created</Th>
                      <Th px={6} py={4} textAlign="center">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {users.map((user) => (
                      <Tr key={user.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                        <Td px={6} py={4}>
                          <HStack spacing={3}>
                            <Avatar 
                              size="sm" 
                              name={`${user.first_name} ${user.last_name}`}
                              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                              color="white"
                            />
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="semibold" color={textColor}>
                                {user.first_name} {user.last_name}
                              </Text>
                              <Text fontSize="sm" color="gray.500">
                                ID: {user.id}
                              </Text>
                            </VStack>
                          </HStack>
                        </Td>
                        <Td px={6} py={4}>
                          <VStack align="start" spacing={1}>
                            <HStack spacing={2}>
                              <Icon as={Mail} boxSize={3} color="gray.400" />
                              <Text fontSize="sm">{user.email}</Text>
                            </HStack>
                            <HStack spacing={2}>
                              <Icon as={Phone} boxSize={3} color="gray.400" />
                              <Text fontSize="sm">
                                {user.phone || user.phone_number || user.mobile || user.mobile_number || 'No phone'}
                              </Text>
                            </HStack>
                          </VStack>
                        </Td>
                        <Td px={6} py={4}>
                          <HStack spacing={2}>
                            <Icon as={Calendar} boxSize={4} color="gray.400" />
                            <Text fontSize="sm">{user.age} years</Text>
                          </HStack>
                        </Td>
                        <Td px={6} py={4}>
                          <Badge 
                            colorScheme={user.is_active ? 'green' : 'red'} 
                            variant="subtle"
                            borderRadius="full"
                            px={3}
                            py={1}
                          >
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </Td>
                        <Td px={6} py={4}>
                          <Text fontSize="sm" color="gray.600">
                            {new Date(user.created_at).toLocaleDateString()}
                          </Text>
                        </Td>
                        <Td px={6} py={4}>
                          <HStack justify="center" spacing={2}>
                            <Tooltip label="View Details">
                              <IconButton
                                aria-label="View user"
                                icon={<Eye size={16} />}
                                size="sm"
                                variant="ghost"
                                color="blue.500"
                                _hover={{ bg: 'blue.50' }}
                                onClick={() => navigate(`/users/${user.id}`)}
                              />
                            </Tooltip>
                            <Tooltip label="Edit User">
                              <IconButton
                                aria-label="Edit user"
                                icon={<Edit size={16} />}
                                size="sm"
                                variant="ghost"
                                color="gray.500"
                                _hover={{ bg: 'gray.50' }}
                              />
                            </Tooltip>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                aria-label="More options"
                                icon={<MoreVertical size={16} />}
                                size="sm"
                                variant="ghost"
                                color="gray.500"
                                _hover={{ bg: 'gray.50' }}
                              />
                              <MenuList>
                                <MenuItem icon={<Download size={16} />}>
                                  Export Data
                                </MenuItem>
                                <MenuItem icon={<Trash2 size={16} />} color="red.500">
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
        {/* Results Summary */}
        {totalCount > 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            mt={6}
            display="flex"
            justifyContent="center"
            mb={4}
          >
            <Text color="gray.600" fontSize="sm">
              Showing {startItem} to {endItem} of {totalCount} users
            </Text>
          </MotionBox>
        )}

        {/* Modern Purple Pagination */}
        {totalCount > 0 && totalPages > 1 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            mt={2}
            display="flex"
            justifyContent="center"
          >
            <HStack 
              spacing={3} 
              bg="purple.500" 
              p={4} 
              borderRadius="full" 
              shadow="xl"
              position="relative"
              overflow="hidden"
              _before={{
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-20%',
                width: '140%',
                height: '200%',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
                borderRadius: '50%',
                zIndex: 0
              }}
            >
              {/* Previous Button */}
              <IconButton
                aria-label="Previous page"
                icon={<ChevronLeft size={18} />}
                size="md"
                variant="ghost"
                onClick={() => handlePageChange(currentPage - 1)}
                isDisabled={currentPage === 1 || isPageChanging}
                borderRadius="full"
                bg="white"
                color="purple.600"
                border="1px solid"
                borderColor="purple.200"
                _hover={{ bg: 'purple.50' }}
                _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
                zIndex={1}
                position="relative"
              />

              {/* Page Numbers */}
{/* Page Numbers */}
              {totalPages > 0 && Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(pageNum => {
                  // Only show 5 pages at most, centered around the current page
                  const maxVisiblePages = 5;
                  const halfVisible = Math.floor(maxVisiblePages / 2);

                  if (totalPages <= maxVisiblePages) {
                    return true; // Show all pages if total pages are 5 or less
                  }

                  if (currentPage <= halfVisible) {
                    return pageNum <= maxVisiblePages; // Show first 5 pages
                  }

                  if (currentPage >= totalPages - halfVisible) {
                    return pageNum > totalPages - maxVisiblePages; // Show last 5 pages
                  }

                  // Show pages centered around current page
                  return pageNum >= currentPage - halfVisible && pageNum <= currentPage + halfVisible;
                })
                .map((pageNum) => {
                  const isActive = currentPage === pageNum;

                  return (
                    <Button
                      key={pageNum}
                      size="md"
                      variant={isActive ? "solid" : "ghost"}
                      bg={isActive ? "purple.100" : "white"}
                      color={isActive ? "purple.700" : "purple.600"}
                      border={isActive ? "2px solid" : "1px solid"}
                      borderColor={isActive ? "purple.300" : "purple.200"}
                      onClick={() => handlePageChange(pageNum)}
                      isDisabled={isPageChanging}
                      borderRadius="full"
                      minW="44px"
                      h="44px"
                      fontSize="sm"
                      fontWeight="semibold"
                      _hover={{ 
                        bg: isActive ? "purple.200" : "purple.50",
                        transform: "scale(1.05)"
                      }}
                      _active={{ transform: "scale(0.95)" }}
                      transition="all 0.2s"
                      zIndex={1}
                      position="relative"
                    >
                      {pageNum}
                    </Button>
                  );
                })}

              {/* Next Button */}
              <IconButton
                aria-label="Next page"
                icon={<ChevronRight size={18} />}
                size="md"
                variant="ghost"
                onClick={() => handlePageChange(currentPage + 1)}
                isDisabled={currentPage === totalPages || isPageChanging}
                borderRadius="full"
                bg="white"
                color="purple.600"
                border="1px solid"
                borderColor="purple.200"
                _hover={{ bg: 'purple.50' }}
                _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
                zIndex={1}
                position="relative"
              />
            </HStack>
          </MotionBox>
        )}
      </Container>
    </Box>
  );
} 