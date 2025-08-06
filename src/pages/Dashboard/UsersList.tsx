import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  IconButton,
  Tooltip,
  Spinner,
  Alert,
  AlertIcon,
  HStack,
  Input,
  Button,
  Select,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers, useUserWithClaims, type User, type UsersParams } from '../../api/users';


// Component for displaying user claims count with caching
const UserClaimsCount = ({ userId }: { userId: string }) => {
  const { data: userWithClaims, isLoading, error } = useUserWithClaims(userId);
  
  if (isLoading) {
    return <Spinner size="xs" color="blue.500" />;
  }
  
  if (error || !userWithClaims) {
    return <Text fontSize="xs" color="gray.400">-</Text>;
  }
  
  return (
    <Text 
      fontSize="xs" 
      fontWeight="bold"
      color={userWithClaims.claimsCount > 0 ? 'blue.600' : 'gray.400'}
    >
      {userWithClaims.claimsCount}
    </Text>
  );
};

export default function Users() {
  const navigate = useNavigate();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [debouncedEmailFilter, setDebouncedEmailFilter] = useState('');
  const [firstNameFilter, setFirstNameFilter] = useState('');
  const [debouncedFirstNameFilter, setDebouncedFirstNameFilter] = useState('');
  const [lastNameFilter, setLastNameFilter] = useState('');
  const [debouncedLastNameFilter, setDebouncedLastNameFilter] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Debounce email filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedEmailFilter(emailFilter);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [emailFilter]);

  // Debounce first name filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFirstNameFilter(firstNameFilter);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [firstNameFilter]);

  // Debounce last name filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLastNameFilter(lastNameFilter);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [lastNameFilter]);

  // Build API parameters
  const apiParams = useMemo((): UsersParams => {
    const params: UsersParams = {
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      ordering: '-created_at'
    };

    if (debouncedSearchQuery.trim()) {
      params.search = debouncedSearchQuery.trim();
    }
    if (debouncedEmailFilter.trim()) {
      params.email = debouncedEmailFilter.trim();
    }
    if (debouncedFirstNameFilter.trim()) {
      params.first_name = debouncedFirstNameFilter.trim();
    }
    if (debouncedLastNameFilter.trim()) {
      params.last_name = debouncedLastNameFilter.trim();
    }

    return params;
  }, [currentPage, pageSize, debouncedSearchQuery, debouncedEmailFilter, debouncedFirstNameFilter, debouncedLastNameFilter]);

  // Use TanStack Query for fetching users with caching
  const { 
    data: usersResponse, 
    isLoading, 
    error, 
    isFetching 
  } = useUsers(apiParams);

  // Extract data from response
  const users = useMemo(() => {
    if (!usersResponse) return [];
    return usersResponse.results || [];
  }, [usersResponse]);

  const totalCount = useMemo(() => {
    return usersResponse?.count || 0;
  }, [usersResponse]);

  // Update pagination state when data changes
  useEffect(() => {
    if (usersResponse) {
      setHasNext(!!usersResponse.next);
      setHasPrevious(!!usersResponse.previous);
    }
  }, [usersResponse]);

  // Format date as DD-MM-YYYY
  const formatDate = useCallback((dateString: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }, []);

  // Calculate age from date of birth
  const calculateAge = useCallback((dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, []);

  // Get phone number from various possible fields
  const getPhoneNumber = useCallback((user: User): string => {
    return user.phone || user.phone_number || user.mobile || user.mobile_number || 'N/A';
  }, []);

  // Handle search
  const handleSearch = useCallback(() => {
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  // Handle view user
  const handleViewUser = useCallback((userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/users/${userId}`);
  }, [navigate]);

  // Calculate pagination info
  const paginationInfo = useMemo(() => {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalCount);
    return { startItem, endItem };
  }, [currentPage, pageSize, totalCount]);

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return debouncedSearchQuery || debouncedEmailFilter || debouncedFirstNameFilter || debouncedLastNameFilter;
  }, [debouncedSearchQuery, debouncedEmailFilter, debouncedFirstNameFilter, debouncedLastNameFilter]);

  // Loading state
  if (isLoading && users.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Spinner size="lg" color="blue.500" />
        <Text mt={2} fontSize="sm" color="gray.600">Loading users...</Text>
      </Box>
    );
  }

  // Error state
  if (error && users.length === 0) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
    return (
      <Box p={4}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Text>{errorMessage}</Text>
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={4} bg="white" minH="100vh">
      {/* Header */}
      <Box mb={4} pb={2} borderBottom="2px solid" borderColor="gray.200">
        <Flex justify="space-between" align="center">
          <Text fontSize="xl" fontWeight="bold" color="gray.800">
            Users ({totalCount})
          </Text>
          <HStack spacing={2}>
            {isFetching && (
              <Badge colorScheme="blue" variant="subtle">
                <HStack spacing={1}>
                  <Spinner size="xs" />
                  <Text fontSize="xs">Updating...</Text>
                </HStack>
              </Badge>
            )}
            <Badge colorScheme="blue" variant="subtle">
              Showing {paginationInfo.startItem}-{paginationInfo.endItem} of {totalCount}
            </Badge>
          </HStack>
        </Flex>
      </Box>

      {/* Search and Filters */}
      <Box mb={4} p={4} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
        <Flex gap={4} wrap="wrap" align="end">
          <Box flex="1" minW="200px">
            <Text fontSize="sm" fontWeight="medium" mb={1} color="gray.700">
              Search
            </Text>
            <HStack>
              <Input
                placeholder="Search by name, email, phone, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="sm"
                pr={8}
              />
              <IconButton
                aria-label="Search"
                icon={<Search size={16} />}
                size="sm"
                onClick={handleSearch}
                colorScheme="blue"
              />
            </HStack>
            {searchQuery !== debouncedSearchQuery && (
              <Text fontSize="xs" color="gray.500" mt={1}>
                Searching in {Math.ceil((500 - (Date.now() % 500)) / 100)}s...
              </Text>
            )}
          </Box>
          
          <Box minW="150px">
            <Text fontSize="sm" fontWeight="medium" mb={1} color="gray.700">
              Email
            </Text>
            <Input
              placeholder="Filter by email..."
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              size="sm"
            />
            {emailFilter !== debouncedEmailFilter && (
              <Text fontSize="xs" color="gray.500" mt={1}>
                Filtering...
              </Text>
            )}
          </Box>
          
          <Box minW="120px">
            <Text fontSize="sm" fontWeight="medium" mb={1} color="gray.700">
              First Name
            </Text>
            <Input
              placeholder="Filter by first name..."
              value={firstNameFilter}
              onChange={(e) => setFirstNameFilter(e.target.value)}
              size="sm"
            />
            {firstNameFilter !== debouncedFirstNameFilter && (
              <Text fontSize="xs" color="gray.500" mt={1}>
                Filtering...
              </Text>
            )}
          </Box>
          
          <Box minW="120px">
            <Text fontSize="sm" fontWeight="medium" mb={1} color="gray.700">
              Last Name
            </Text>
            <Input
              placeholder="Filter by last name..."
              value={lastNameFilter}
              onChange={(e) => setLastNameFilter(e.target.value)}
              size="sm"
            />
            {lastNameFilter !== debouncedLastNameFilter && (
              <Text fontSize="xs" color="gray.500" mt={1}>
                Filtering...
              </Text>
            )}
          </Box>
          
          <Button
            size="sm"
            colorScheme="blue"
            onClick={handleSearch}
            isLoading={isLoading}
          >
            Apply Filters
          </Button>
        </Flex>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert status="error" borderRadius="md" mb={4}>
          <AlertIcon />
          <Text>{error instanceof Error ? error.message : 'An error occurred'}</Text>
        </Alert>
      )}

      {/* Excel-like table */}
      <Box 
        overflowX="auto" 
        border="1px solid" 
        borderColor="gray.300"
        borderRadius="4px"
        bg="white"
        position="relative"
      >
        {isFetching && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(255, 255, 255, 0.8)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={1}
          >
            <Spinner size="md" color="blue.500" />
          </Box>
        )}
        
        <Table variant="simple" size="sm">
          <Thead bg="gray.100">
            <Tr>
              <Th 
                border="1px solid" 
                borderColor="gray.300" 
                fontWeight="bold" 
                color="gray.700"
                fontSize="xs"
                p={2}
                w="80px"
              >
                User ID
              </Th>
              <Th 
                border="1px solid" 
                borderColor="gray.300" 
                fontWeight="bold" 
                color="gray.700"
                fontSize="xs"
                p={2}
                w="200px"
              >
                Name
              </Th>
              <Th 
                border="1px solid" 
                borderColor="gray.300" 
                fontWeight="bold" 
                color="gray.700"
                fontSize="xs"
                p={2}
                w="220px"
              >
                Email
              </Th>
              <Th 
                border="1px solid" 
                borderColor="gray.300" 
                fontWeight="bold" 
                color="gray.700"
                fontSize="xs"
                p={2}
                w="140px"
              >
                Phone Number
              </Th>
              <Th 
                border="1px solid" 
                borderColor="gray.300" 
                fontWeight="bold" 
                color="gray.700"
                fontSize="xs"
                p={2}
                w="140px"
              >
                DOB (Age)
              </Th>
              <Th 
                border="1px solid" 
                borderColor="gray.300" 
                fontWeight="bold" 
                color="gray.700"
                fontSize="xs"
                p={2}
                w="120px"
              >
                Created At
              </Th>
              <Th 
                border="1px solid" 
                borderColor="gray.300" 
                fontWeight="bold" 
                color="gray.700"
                fontSize="xs"
                p={2}
                w="100px"
                textAlign="center"
              >
                Claims
              </Th>
              <Th 
                border="1px solid" 
                borderColor="gray.300" 
                fontWeight="bold" 
                color="gray.700"
                fontSize="xs"
                p={2}
                w="60px"
                textAlign="center"
              >
                View
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.length === 0 ? (
              <Tr>
                <Td 
                  colSpan={8} 
                  textAlign="center" 
                  py={8} 
                  color="gray.500"
                  border="1px solid"
                  borderColor="gray.300"
                >
                  {hasActiveFilters
                    ? 'No users match your filters'
                    : 'No users found'
                  }
                </Td>
              </Tr>
            ) : (
              users.map((user) => (
                <Tr key={user.id} _hover={{ bg: 'gray.50' }}>
                  <Td 
                    border="1px solid" 
                    borderColor="gray.300" 
                    p={2}
                    fontSize="xs"
                    fontFamily="mono"
                    color="blue.600"
                    fontWeight="medium"
                  >
                    {user.id}
                  </Td>
                  <Td 
                    border="1px solid" 
                    borderColor="gray.300" 
                    p={2}
                    fontSize="xs"
                    fontWeight="medium"
                    color="gray.800"
                  >
                    {user.first_name} {user.last_name}
                  </Td>
                  <Td 
                    border="1px solid" 
                    borderColor="gray.300" 
                    p={2}
                    fontSize="xs"
                    color="gray.700"
                    maxW="220px"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {user.email}
                  </Td>
                  <Td 
                    border="1px solid" 
                    borderColor="gray.300" 
                    p={2}
                    fontSize="xs"
                    color="gray.700"
                  >
                    {getPhoneNumber(user)}
                  </Td>
                  <Td 
                    border="1px solid" 
                    borderColor="gray.300" 
                    p={2}
                    fontSize="xs"
                    color="gray.700"
                  >
                    {user.date_of_birth 
                      ? `${formatDate(user.date_of_birth)} (${calculateAge(user.date_of_birth)})` 
                      : 'N/A'
                    }
                  </Td>
                  <Td 
                    border="1px solid" 
                    borderColor="gray.300" 
                    p={2}
                    fontSize="xs"
                    color="gray.700"
                  >
                    {formatDate(user.created_at)}
                  </Td>
                  <Td 
                    border="1px solid" 
                    borderColor="gray.300" 
                    p={2}
                    textAlign="center"
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    <UserClaimsCount userId={user.id} />
                  </Td>
                  <Td 
                    border="1px solid" 
                    borderColor="gray.300" 
                    p={2}
                    textAlign="center"
                  >
                    <Tooltip label={`View ${user.first_name} ${user.last_name}`} hasArrow>
                      <IconButton
                        aria-label="View user details"
                        icon={<Eye size={14} />}
                        size="xs"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={(e) => handleViewUser(user.id, e)}
                        _hover={{ bg: 'blue.50' }}
                      />
                    </Tooltip>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination Controls */}
      <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
        <HStack spacing={4}>
          <Text fontSize="sm" color="gray.600">
            Rows per page:
          </Text>
          <Select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            size="sm"
            w="80px"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </Select>
          <Text fontSize="sm" color="gray.600">
            {paginationInfo.startItem}-{paginationInfo.endItem} of {totalCount}
          </Text>
        </HStack>
        
        <HStack spacing={2}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            isDisabled={!hasPrevious}
            leftIcon={<ChevronLeft size={16} />}
          >
            Previous
          </Button>
          <Text fontSize="sm" color="gray.600" px={2}>
            Page {currentPage} of {Math.ceil(totalCount / pageSize)}
          </Text>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            isDisabled={!hasNext}
            rightIcon={<ChevronRight size={16} />}
          >
            Next
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}
