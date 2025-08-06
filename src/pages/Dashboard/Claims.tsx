import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Card, 
  CardBody,
  Avatar,
  Badge,
  Button,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { 
  MoreVertical,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { claimsAPI, type Claim, type ClaimsParams } from '../../api/getClaims';

// Motion components
const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function Claims() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  
  // State management
  const [claims, setClaims] = useState<Claim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);
  
  // Filters
  const [searchQuery] = useState('');
  const [statusFilter ] = useState('all');
  const [priorityFilter] = useState('all');
  const [typeFilter] = useState('all');

  // Fetch claims function
  const fetchClaims = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const params: ClaimsParams = {
        page: currentPage,
        page_size: pageSize,
        ordering: '-created_at', // Order by newest first
      };

      // Add filters
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (priorityFilter !== 'all') {
        params.priority = priorityFilter;
      }
      if (typeFilter !== 'all') {
        params.type = typeFilter;
      }

      const response = await claimsAPI.getClaims(params);
      
      // Handle response structure
      const claimsData = response.results || [];
      const totalCount = response.count || claimsData.length || 0;
      
      setClaims(claimsData);
      setTotalCount(totalCount);
      
    } catch (err: any) {
      let errorMessage = 'Failed to fetch claims. Please try again.';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to view claims.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchClaims();
  }, [currentPage]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) {
        fetchClaims();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter, priorityFilter, typeFilter]);

  // Computed stats with safety checks
  const stats = useMemo(() => [
    { label: 'Total Claims', value: totalCount, color: 'blue.500' },
    { label: 'Draft', value: claims?.filter(c => c.status === 'draft')?.length || 0, color: 'orange.500' },
    { label: 'Active', value: claims?.filter(c => c.status === 'active')?.length || 0, color: 'green.500' },
    { label: 'Completed', value: claims?.filter(c => c.status === 'completed')?.length || 0, color: 'purple.500' },
  ], [claims, totalCount]);

  const totalAmount = useMemo(() => 
    claims?.reduce((sum, claim) => sum + (claim.amount || 0), 0) || 0, 
    [claims]
  );

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'draft': return 'orange';
      case 'active': return 'green';
      case 'pending': return 'yellow';
      case 'completed': return 'purple';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const handleClaimClick = async (claim: Claim) => {
    try {
      // Fetch detailed claim data
      const detailedClaim = await claimsAPI.getClaim(claim.id);
      setSelectedClaim(detailedClaim);
      onOpen();
    } catch (err) {
      console.error('Error fetching claim details:', err);
      toast({
        title: 'Error',
        description: 'Failed to load claim details',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleStatusUpdate = async (claimId: string, newStatus: string) => {
    try {
      await claimsAPI.updateClaimStatus(claimId, newStatus);
      
      toast({
        title: 'Success',
        description: `Claim status updated to ${newStatus}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Refresh claims list
      fetchClaims(false);
      
      // Update selected claim if it's the same one
      if (selectedClaim && selectedClaim.id === claimId) {
        setSelectedClaim({ ...selectedClaim, status: newStatus as any });
      }
      
    } catch (err) {
      console.error('Error updating claim status:', err);
      toast({
        title: 'Error',
        description: 'Failed to update claim status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRefresh = () => {
    fetchClaims();
  };



  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      p={6}
    >
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <HStack justify="space-between" mb={4}>
            <VStack spacing={1} align="start">
              <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                Claims Management
              </Text>
              <Text fontSize="sm" color="gray.600">
                Manage and process insurance claims
              </Text>
            </VStack>
            
            <HStack spacing={3}>
              <Button
                leftIcon={<RefreshCw size={16} />}
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                isLoading={loading}
              >
                Refresh
              </Button>
            </HStack>
          </HStack>

          {/* Stats Grid */}
          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4} mb={6}>
            {stats.map((stat, index) => (
              <MotionCard
                key={index}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <CardBody>
                  <Stat>
                    <StatLabel color="gray.600">{stat.label}</StatLabel>
                    <StatNumber color={stat.color}>
                      {loading ? <Skeleton height="32px" /> : stat.value}
                    </StatNumber>
                    <StatHelpText>
                      {stat.label === 'Total Claims' && totalAmount > 0 && 
                        `$${totalAmount.toLocaleString()} total value`
                      }
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </MotionCard>
            ))}
          </Grid>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <Box>
              <AlertTitle>Error loading claims!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Claims Table */}
        <Card>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Claim Number</Th>
                  <Th>Lender</Th>
                  <Th>Status</Th>
                  <Th>Submitted</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  // Loading skeleton rows
                  Array.from({ length: 5 }).map((_, index) => (
                    <Tr key={index}>
                      <Td><Skeleton height="16px" /></Td>
                      <Td><SkeletonText noOfLines={2} /></Td>
                      <Td><Skeleton height="16px" /></Td>
                      <Td><Skeleton height="20px" width="80px" /></Td>
                      <Td><Skeleton height="20px" width="60px" /></Td>
                      <Td><Skeleton height="20px" width="60px" /></Td>
                      <Td><SkeletonText noOfLines={1} /></Td>
                      <Td><Skeleton height="16px" /></Td>
                      <Td><Skeleton height="20px" width="20px" /></Td>
                    </Tr>
                  ))
                ) : claims?.length === 0 ? (
                  <Tr>
                    <Td colSpan={9} textAlign="center" py={8}>
                      <VStack spacing={3}>
                        <Text color="gray.500">No claims found</Text>
                        <Text fontSize="sm" color="gray.400">
                          {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || typeFilter !== 'all'
                            ? 'Try adjusting your filters'
                            : 'Create your first claim to get started'
                          }
                        </Text>
                      </VStack>
                    </Td>
                  </Tr>
                ) : (
                  claims?.map((claim) => (
                    <MotionBox
                      key={claim.id}
                      as={Tr}
                      whileHover={{ backgroundColor: 'var(--chakra-colors-blue-50)' }}
                      cursor="pointer"
                      onClick={() => handleClaimClick(claim)}
                      transition={{ duration: 0.2 }}
                    >
                      <Td>
                        <Text fontSize="sm" fontWeight="medium" color="blue.600">
                          {claim.claim_number || claim.id?.slice(0, 8) || 'N/A'}
                        </Text>
                      </Td>
                      <Td>
                        <VStack spacing={0} align="start">
                          <Text fontSize="sm" fontWeight="medium">
                            {claim.customer_name || claim.lender_name || 'Unknown Customer'}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {claim.customer_email || 'No email'}
                          </Text>
                        </VStack>
                      </Td>
                    <Td>
                        <Badge
                            size="sm"
                            colorScheme={getStatusColor(claim.status)}
                            variant="subtle"
                        >
                            {claim.status
                                ? claim.status.charAt(0).toUpperCase() + claim.status.slice(1)
                                : 'Unknown'}
                        </Badge>
                    </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.600">
                          {claim.submitted_date ? 
                            new Date(claim.submitted_date).toLocaleDateString() :
                            new Date(claim.created_at).toLocaleDateString()
                          }
                        </Text>
                      </Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="More options"
                            icon={<MoreVertical size={14} />}
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <MenuList>
                            <MenuItem 
                              icon={<Eye size={14} />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClaimClick(claim);
                              }}
                            >
                              View Details
                            </MenuItem>
                            <MenuItem icon={<Edit size={14} />}>Edit Claim</MenuItem>
                            <MenuItem icon={<Download size={14} />}>Download</MenuItem>
                            <MenuItem icon={<Trash2 size={14} />} color="red.500">Delete</MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </MotionBox>
                  )) || []
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
      </VStack>

      {/* Claim Details Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Claim Details
          </DrawerHeader>
          <DrawerBody>
            {selectedClaim && (
              <VStack spacing={6} align="stretch">
                {/* Claim Header */}
                <Box>
                  <HStack justify="space-between" mb={4}>
                    <VStack spacing={1} align="start">
                      <Text fontSize="lg" fontWeight="bold">
                        {selectedClaim.claim_number || selectedClaim.id?.slice(0, 8) || 'Claim Details'}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {selectedClaim.customer_name || selectedClaim.lender_name || 'Unknown Customer'}
                      </Text>
                    </VStack>
                    <Badge
                      size="lg"
                      colorScheme={getStatusColor(selectedClaim.status)}
                    >
                      {selectedClaim.status.charAt(0).toUpperCase() + selectedClaim.status.slice(1)}
                    </Badge>
                  </HStack>
                </Box>

                {/* Claim Info */}
                <Card>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.500">Amount</Text>
                        <Text fontSize="lg" fontWeight="bold" color="green.600">
                          ${(selectedClaim.amount || 0).toLocaleString()}
                        </Text>
                      </HStack>
                      
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.500">Type</Text>
                        <Badge colorScheme="blue" variant="subtle">
                          {selectedClaim.type ? 
                            selectedClaim.type.charAt(0).toUpperCase() + selectedClaim.type.slice(1) : 
                            'General'
                          }
                        </Badge>
                      </HStack>
                      
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.500">Priority</Text>
                        <Badge
                          colorScheme={getPriorityColor(selectedClaim.priority || 'medium')}
                          variant="subtle"
                        >
                          {selectedClaim.priority ? 
                            selectedClaim.priority.charAt(0).toUpperCase() + selectedClaim.priority.slice(1) : 
                            'Medium'
                          }
                        </Badge>
                      </HStack>
                      
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.500">Assigned To</Text>
                        <HStack spacing={2}>
                          <Avatar size="xs" name={selectedClaim.assigned_to || 'Unassigned'} />
                          <Text fontSize="sm">{selectedClaim.assigned_to || 'Unassigned'}</Text>
                        </HStack>
                      </HStack>
                      
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.500">Documents</Text>
                        <Text fontSize="sm">{selectedClaim.documents_count || 0} files</Text>
                      </HStack>

                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.500">Created</Text>
                        <Text fontSize="sm">{new Date(selectedClaim.created_at).toLocaleDateString()}</Text>
                      </HStack>

                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.500">Last Updated</Text>
                        <Text fontSize="sm">{new Date(selectedClaim.updated_at).toLocaleDateString()}</Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Description */}
                <Card>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <Text fontSize="sm" fontWeight="medium" color="gray.700">
                        Description
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {selectedClaim.description || 'No description available'}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Actions */}
                <VStack spacing={3}>
                  <HStack spacing={3} w="full">
                    <Button 
                      leftIcon={<Edit size={16} />} 
                      colorScheme="blue" 
                      size="sm"
                      flex="1"
                    >
                      Edit Claim
                    </Button>
                    <Button 
                      leftIcon={<Download size={16} />} 
                      variant="outline" 
                      size="sm"
                      flex="1"
                    >
                      Download
                    </Button>
                  </HStack>
                  
                  {selectedClaim.status === 'draft' && (
                    <HStack spacing={3} w="full">
                      <Button 
                        leftIcon={<CheckCircle size={16} />} 
                        colorScheme="green" 
                        size="sm"
                        flex="1"
                        onClick={() => handleStatusUpdate(selectedClaim.id, 'active')}
                      >
                        Activate
                      </Button>
                      <Button 
                        leftIcon={<AlertCircle size={16} />} 
                        colorScheme="red" 
                        size="sm"
                        flex="1"
                        onClick={() => handleStatusUpdate(selectedClaim.id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                    </HStack>
                  )}
                </VStack>
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </MotionBox>
  );
}
