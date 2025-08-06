import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Heading,
  Icon,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Avatar,
  Button,
  Divider,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  useToast,
  Skeleton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import {
  Phone,
  Calendar,
  FileText,
  Building,
  CheckCircle,
  Download,
  Award,
  AlertTriangle,
  FileDown,
  MessageSquare,
  ChevronDown,
  User,
  Mail,
  Clock,
  MapPin,
  FileX,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usersAPI, type UserDetailsResponse, type Address, type Agreement } from '../../api/users';
import DocumentDownloadService, { documentTypes, type DocumentType } from '../../api/download';
import { RequirementRequestModal } from '../../components/UserDetails/AdditionalRequirementModal';
import { statusAPI, type StatusType } from '../../api/status';
import { useQuery } from '@tanstack/react-query';

function formatDateTime(dt: string) {
  if (!dt) return '';
  const d = new Date(dt);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function formatAddress(address: Address): string {
  const parts = [
    address.address_line_1,
    address.address_line_2,
    address.address_line_3,
    address.address_line_4,
    address.address_line_5,
    address.city,
    address.region,
    address.postcode,
    address.country
  ].filter(part => part && part.trim() !== '');
  
  return parts.join(', ');
}

export default function UserDetails() {
  const { userId } = useParams();

  // Modal states
  const { isOpen: isDownloadModalOpen, onOpen: onDownloadModalOpen, onClose: onDownloadModalClose } = useDisclosure();
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>('care_pack');
  const [downloadingClaimId, setDownloadingClaimId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast();

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  // Add these state variables to your component
  const [selectedClaimForRequirement, setSelectedClaimForRequirement] = useState<string | null>(null);
  const [selectedClaimLenderName, setSelectedClaimLenderName] = useState<string>('');

  const { 
    isOpen: isRequirementModalOpen, 
    onOpen: onRequirementModalOpen, 
    onClose: onRequirementModalClose 
  } = useDisclosure();

  // Status management state
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Fetch user details with TanStack Query
  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
    error: userErrorData,
  } = useQuery<UserDetailsResponse, Error>({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const response = await usersAPI.getUser(userId);
      return response;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch statuses with TanStack Query
  const {
    data: statusesData,
    isLoading: statusesLoading,
  } = useQuery({
    queryKey: ['statuses'],
    queryFn: async () => {
      const [claimStatusesData, agreementStatusesData] = await Promise.all([
        statusAPI.getStatuses('claim'),
        statusAPI.getStatuses('agreement')
      ]);
      return { claimStatuses: claimStatusesData, agreementStatuses: agreementStatusesData };
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const claimStatuses = statusesData?.claimStatuses || [];
  const agreementStatuses = statusesData?.agreementStatuses || [];

  // Add this handler function
  const handleRequestInfoClick = (claimId: string, lenderName: string) => {
    setSelectedClaimForRequirement(claimId);
    setSelectedClaimLenderName(lenderName);
    onRequirementModalOpen();
  };

  // Handle agreement document download
  const handleAgreementDownload = async (agreement: Agreement) => {
    if (!agreement.agreement_document_url) {
      toast({
        title: 'No Document Available',
        description: 'No finance agreement document has been uploaded for this agreement.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = agreement.agreement_document_url;
      link.download = `finance_agreement_${agreement.agreement_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Download Started',
        description: 'Finance agreement document download started',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Download Failed',
        description: error.message || 'Failed to download agreement document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Error handling
  useEffect(() => {
    if (userError && userErrorData instanceof Error) {
      toast({
        title: 'Error',
        description: userErrorData.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [userError, userErrorData, toast]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'verified':
      case 'approved':
        return 'green';
      case 'pending':
      case 'draft':
        return 'yellow';
      case 'inactive':
      case 'rejected':
      case 'disabled':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Download document modal launch
  const handleDownloadClick = (claimId: string) => {
    setDownloadingClaimId(claimId);
    setSelectedDocumentType('care_pack');
    onDownloadModalOpen();
  };

  // Production-grade download confirm
  const handleDownloadConfirm = async () => {
    if (!downloadingClaimId) {
      toast({
        title: 'No claim selected',
        description: 'Please select a claim to download a document.',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    setIsDownloading(true);
    try {
      await DocumentDownloadService.downloadClaimDocument(
        downloadingClaimId,
        selectedDocumentType,
        `${selectedDocumentType}_${downloadingClaimId}.pdf`
      );
      toast({
        title: 'Success',
        description: 'Document download started successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      onDownloadModalClose();
    } catch (error: any) {
      toast({
        title: 'Download Failed',
        description: error.message || 'Failed to download document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (type: StatusType, id: string, newStatus: string) => {
    const updateKey = `${type}_${id}`;
    setUpdatingStatus(updateKey);
    
    try {
      const updateData = {
        type,
        status: newStatus,
        ...(type === 'claim' ? { claim_id: id } : { agreement_id: id })
      };
      
      await statusAPI.updateStatus(updateData);
      
      // Invalidate and refetch user data to get updated status
      // Note: In a real app, you'd use queryClient.invalidateQueries(['user', userId])
      
      toast({
        title: 'Status Updated',
        description: `${type === 'claim' ? 'Claim' : 'Agreement'} status updated successfully`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message || `Failed to update ${type} status`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (userLoading || statusesLoading) {
    return (
      <Box bg={bgColor} minH="100vh" p={4}>
        <Container maxW="container.xl">
          <VStack spacing={4} align="stretch">
            <Skeleton height="40px" />
            <Skeleton height="150px" />
            <Skeleton height="200px" />
          </VStack>
        </Container>
      </Box>
    );
  }

  if (userError) {
    return (
      <Box bg={bgColor} minH="100vh" p={4}>
        <Container maxW="container.xl">
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{userErrorData instanceof Error ? userErrorData.message : 'Failed to fetch user details'}</AlertDescription>
          </Alert>
        </Container>
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box bg={bgColor} minH="100vh" p={4}>
        <Container maxW="container.xl">
          <Alert status="warning" borderRadius="lg">
            <AlertIcon />
            <AlertTitle>No Data!</AlertTitle>
            <AlertDescription>No user data found.</AlertDescription>
          </Alert>
        </Container>
      </Box>
    );
  }

  const { user, claims } = userData;
  const age = calculateAge(user.date_of_birth);

  return (
    <Box bg={bgColor} minH="100vh" py={4}>
      <Container maxW="container.xl">
        {/* Header */}
        <HStack justify="space-between" align="center" mb={6}>
          <Heading size="md" color={textColor}>User Details</Heading>
        </HStack>

        {/* User Profile Card - Optimized */}
        <Card bg={cardBg} borderRadius="lg" shadow="sm" mb={6} border="1px solid" borderColor={borderColor}>
          <CardBody p={6}>
            <Grid templateColumns={{ base: "1fr", md: "auto 1fr auto" }} gap={6} alignItems="center">
              {/* Avatar */}
              <Avatar size="lg" name={`${user.first_name} ${user.last_name}`} bg="purple.500" />
              
              {/* User Info */}
              <VStack align="start" spacing={2}>
                <Heading size="lg" color={textColor}>{user.first_name} {user.last_name}</Heading>
                <HStack spacing={4} flexWrap="wrap">
                  <HStack spacing={1}>
                    <Icon as={Mail} boxSize={4} color="gray.400" />
                    <Text fontSize="sm" color="gray.600">{user.email}</Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Icon as={Phone} boxSize={4} color="gray.400" />
                    <Text fontSize="sm" color="gray.600">{user.phone_number || 'N/A'}</Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Icon as={User} boxSize={4} color="gray.400" />
                    <Text fontSize="sm" color="gray.600">Age: {age}</Text>
                  </HStack>
                </HStack>
                <HStack spacing={4} flexWrap="wrap">
                  <HStack spacing={1}>
                    <Icon as={Calendar} boxSize={4} color="blue.400" />
                    <Text fontSize="sm" color="blue.600">Joined: {formatDateTime(user.created_at)}</Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Icon as={Clock} boxSize={4} color="green.400" />
                    <Text fontSize="sm" color="green.600">Last Active: {formatDateTime(user.updated_at)}</Text>
                  </HStack>
                </HStack>
              </VStack>
              
              {/* Stats */}
              <Grid minW="120px">
                <Stat textAlign="center" bg={useColorModeValue('purple.50', 'purple.900')} p={2} borderRadius="md">
                  <StatNumber fontSize="lg" color="purple.600">{claims.length}</StatNumber>
                  <StatLabel fontSize="xs" color="purple.500">Claims</StatLabel>
                </Stat>
              </Grid>
            </Grid>
          </CardBody>
        </Card>

        {/* Address Information */}
        <Card bg={cardBg} borderRadius="lg" shadow="md" border="1px solid" borderColor={borderColor} mb={6}>
          <CardBody p={4}>
            <HStack spacing={3} mb={4}>
              <Box bg="green.100" p={2} borderRadius="lg">
                <Icon as={MapPin} color="green.600" boxSize={5} />
              </Box>
              <Heading size="md" color={textColor} fontWeight="bold">Address Information</Heading>
            </HStack>

            <Accordion allowToggle>
              {/* Current Address */}
              <AccordionItem border="1px solid" borderColor={borderColor} borderRadius="md" mb={3}>
                <AccordionButton>
                  <HStack spacing={3} flex="1" textAlign="left">
                    <Badge colorScheme="green" variant="subtle">Current</Badge>
                    <Text fontWeight="medium" color={textColor}>
                      {user.address ? formatAddress(user.address) : 'No current address available'}
                    </Text>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  {user.address ? (
                    <VStack align="start" spacing={2}>
                      <SimpleGrid columns={2} spacing={4} w="full">
                        <Box>
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">Address Line 1</Text>
                          <Text fontSize="sm">{user.address.address_line_1 || 'N/A'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">Address Line 2</Text>
                          <Text fontSize="sm">{user.address.address_line_2 || 'N/A'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">Address Line 3</Text>
                          <Text fontSize="sm">{user.address.address_line_3 || 'N/A'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">City</Text>
                          <Text fontSize="sm">{user.address.city || 'N/A'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">Region</Text>
                          <Text fontSize="sm">{user.address.region || 'N/A'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">Postcode</Text>
                          <Text fontSize="sm">{user.address.postcode || 'N/A'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">Country</Text>
                          <Text fontSize="sm">{user.address.country || 'N/A'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">Bureau ID</Text>
                          <Text fontSize="sm">{user.address.beureau_id || 'N/A'}</Text>
                        </Box>
                      </SimpleGrid>
                    </VStack>
                  ) : (
                    <Text color="gray.500" fontSize="sm">No current address information available</Text>
                  )}
                </AccordionPanel>
              </AccordionItem>

              {/* Previous Addresses */}
              {user.previous_addresses && user.previous_addresses.length > 0 && (
                <AccordionItem border="1px solid" borderColor={borderColor} borderRadius="md">
                  <AccordionButton>
                    <HStack spacing={3} flex="1" textAlign="left">
                      <Badge colorScheme="orange" variant="subtle">Previous</Badge>
                      <Text fontWeight="medium" color={textColor}>
                        {user.previous_addresses.length} previous address{user.previous_addresses.length > 1 ? 'es' : ''}
                      </Text>
                    </HStack>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <VStack spacing={3} align="stretch">
                      {user.previous_addresses.map((address, index) => (
                        <Card key={index} bg={useColorModeValue('gray.50', 'gray.700')} p={3} borderRadius="md">
                          <VStack align="start" spacing={2}>
                            <HStack justify="space-between" w="full">
                              <Badge colorScheme="orange" variant="subtle" size="sm">
                                Previous Address {index + 1}
                              </Badge>
                              <Text fontSize="xs" color="gray.500">
                                {formatDateTime(address.created_at || '')}
                              </Text>
                            </HStack>
                            <Text fontSize="sm" fontWeight="medium">
                              {formatAddress(address)}
                            </Text>
                            <SimpleGrid columns={2} spacing={2} w="full" fontSize="xs">
                              <Text color="gray.500">City: {address.city || 'N/A'}</Text>
                              <Text color="gray.500">Postcode: {address.postcode || 'N/A'}</Text>
                              <Text color="gray.500">Region: {address.region || 'N/A'}</Text>
                              <Text color="gray.500">Bureau ID: {address.beureau_id || 'N/A'}</Text>
                            </SimpleGrid>
                          </VStack>
                        </Card>
                      ))}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              )}
            </Accordion>
          </CardBody>
        </Card>

        {/* Claims Section */}
        <Card bg={cardBg} borderRadius="lg" shadow="md" border="1px solid" borderColor={borderColor} overflow="hidden">
          <CardBody p={6}>
            <HStack justify="space-between" mb={4}>
              <HStack spacing={3}>
                <Box bg="blue.100" p={2} borderRadius="lg">
                  <Icon as={FileText} color="blue.600" boxSize={5} />
                </Box>
                <Heading size="md" color={textColor} fontWeight="bold">Claims ({claims.length})</Heading>
              </HStack>
            </HStack>
            
            {claims.length === 0 ? (
              <Box textAlign="center" py={8} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
                <Icon as={AlertTriangle} boxSize={8} color="gray.400" mb={3} />
                <Text color="gray.500" fontWeight="medium">No claims found</Text>
                <Text color="gray.400" fontSize="sm" mt={1}>This user hasn't submitted any claims yet</Text>
              </Box>
            ) : (
              <VStack spacing={4} align="stretch">
                {claims.map((claim) => (
                  <Card key={claim.id} bg={useColorModeValue('white', 'gray.700')} p={4} borderRadius="md" border="1px solid" borderColor={borderColor}>
                    <VStack spacing={3} align="stretch">
                      {/* Claim Header */}
                      <HStack justify="space-between" align="center">
                        <HStack spacing={3}>
                          <Box bg="blue.100" p={2} borderRadius="md">
                            <Icon as={Building} color="blue.600" boxSize={4} />
                          </Box>
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold" color={textColor} fontSize="md">{claim.lender_name}</Text>
                            <Text fontSize="xs" color="gray.500">ID: {claim.id}</Text>
                          </VStack>
                        </HStack>
                        <VStack spacing={1} align="end">
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">Update Claim Status</Text>
                          <Menu>
                            <MenuButton
                              as={Button}
                              rightIcon={<ChevronDown size={12} />}
                              size="sm"
                              variant="outline"
                              colorScheme={getStatusColor(claim.status)}
                              isLoading={updatingStatus === `claim_${claim.id}`}
                              loadingText="Updating..."
                              minW="100px"
                            >
                              {claim.status}
                            </MenuButton>
                            <MenuList>
                              {claimStatuses.map((status) => (
                                <MenuItem
                                  key={status.value}
                                  onClick={() => handleStatusUpdate('claim', claim.id, status.value)}
                                  isDisabled={status.value === claim.status}
                                >
                                  {status.label}
                                </MenuItem>
                              ))}
                            </MenuList>
                          </Menu>
                        </VStack>
                      </HStack>
                      
                      {/* Claim Dates */}
                      <HStack spacing={4} fontSize="xs" color="gray.500">
                        <HStack spacing={1}>
                          <Icon as={Calendar} boxSize={3} />
                          <Text>Created: {formatDateTime(claim.created_at)}</Text>
                        </HStack>
                        <HStack spacing={1}>
                          <Icon as={Clock} boxSize={3} />
                          <Text>Updated: {formatDateTime(claim.updated_at)}</Text>
                        </HStack>
                      </HStack>
                      
                      {/* Agreements Section */}
                      {claim.agreements && claim.agreements.length > 0 && (
                        <Accordion allowToggle>
                          <AccordionItem border="1px solid" borderColor={borderColor} borderRadius="md" mb={2}>
                            <AccordionButton>
                              <HStack spacing={2} flex="1" textAlign="left">
                                <Icon as={Award} color="purple.500" boxSize={4} />
                                <Text fontSize="sm" fontWeight="medium" color="purple.700">
                                  Agreements ({claim.agreements.length})
                                </Text>
                              </HStack>
                              <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                              <VStack spacing={2} align="stretch">
                                {claim.agreements.map((agreement: Agreement) => (
                                  <Card key={agreement.id} bg={useColorModeValue('gray.50', 'gray.600')} p={3} borderRadius="md" border="1px solid" borderColor={borderColor}>
                                    <HStack justify="space-between" align="center">
                                      <VStack align="start" spacing={0}>
                                        <HStack spacing={2}>
                                          <Icon as={CheckCircle} color="green.500" boxSize={3} />
                                          <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                            Agreement Number : {agreement.agreement_number}
                                          </Text>
                                        </HStack>
                                        <Text fontSize="xs" color="gray.500">{agreement.lender_name}</Text>
                                        {agreement.vehicle_registration && (
                                          <Text fontSize="xs" color="gray.500">Registration Number: {agreement.vehicle_registration}</Text>
                                        )}
                                        <HStack spacing={3} fontSize="xs" color="gray.400">
                                          <Text>Created: {formatDateTime(agreement.created_at)}</Text>
                                          <Text>Updated: {formatDateTime(agreement.updated_at)}</Text>
                                        </HStack>
                                      </VStack>
                                      <HStack spacing={8} align="stretch">
                                        {/* Finance Agreement Download */}
                                        <VStack
                                          spacing={1}
                                          align="start"
                                          justify="center"
                                          minW="140px"
                                          flex="1"
                                        >
                                          <Text fontSize="xs" color="gray.500" fontWeight="medium">
                                            Finance Agreement
                                          </Text>
                                          {agreement.agreement_document_url ? (
                                            <Button
                                              size="xs"
                                              colorScheme="green"
                                              variant="outline"
                                              leftIcon={<Download size={10} />}
                                              onClick={() => handleAgreementDownload(agreement)}
                                              w="full"
                                            >
                                              Download
                                            </Button>
                                          ) : (
                                            <HStack spacing={1}>
                                              <Icon as={FileX} boxSize={4} color="gray.400" />
                                              <Text fontSize="xs" color="gray.400">
                                                Not Available
                                              </Text>
                                            </HStack>
                                          )}
                                        </VStack>

                                        {/* Update Agreement Status */}
                                        <VStack
                                          spacing={1}
                                          align="start"
                                          justify="center"
                                          minW="140px"
                                          flex="1"
                                        >
                                          <Text fontSize="xs" color="gray.500" fontWeight="medium">
                                            Update Agreement Status
                                          </Text>
                                          <Menu>
                                            <MenuButton
                                              as={Button}
                                              rightIcon={<ChevronDown size={10} />}
                                              size="xs"
                                              variant="outline"
                                              colorScheme={getStatusColor(agreement.status || 'pending')}
                                              isLoading={updatingStatus === `agreement_${agreement.id}`}
                                              loadingText="..."
                                              minW="100px"
                                              w="full"
                                              textTransform="capitalize"
                                            >
                                              {agreement.status || 'pending'}
                                            </MenuButton>
                                            <MenuList>
                                              {agreementStatuses.map((status) => (
                                                <MenuItem
                                                  key={status.value}
                                                  onClick={() =>
                                                    handleStatusUpdate('agreement', agreement.id, status.value)
                                                  }
                                                  isDisabled={status.value === (agreement.status || 'pending')}
                                                  textTransform="capitalize"
                                                >
                                                  {status.label}
                                                </MenuItem>
                                              ))}
                                            </MenuList>
                                          </Menu>
                                        </VStack>
                                      </HStack>
                                    </HStack>
                                  </Card>
                                ))}
                              </VStack>
                            </AccordionPanel>
                          </AccordionItem>
                        </Accordion>
                      )}
                      
                      {/* Actions */}
                      <Divider />
                      <HStack justify="end" spacing={2}>
                        <Button
                          size="sm"
                          variant="outline"
                          colorScheme="blue"
                          leftIcon={<MessageSquare size={14} />}
                          onClick={() => handleRequestInfoClick(claim.id, claim.lender_name)}
                        >
                          Request Info
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          colorScheme="green"
                          leftIcon={<Download size={14} />}
                          onClick={() => handleDownloadClick(claim.id)}
                        >
                          View Documents
                        </Button>
                      </HStack>
                    </VStack>
                  </Card>
                ))}
              </VStack>
            )}
          </CardBody>
        </Card>

        {/* Download Modal */}
        <Modal isOpen={isDownloadModalOpen} onClose={onDownloadModalClose} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Download Document</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={4}>Select document type for Claim ID: {downloadingClaimId}</Text>
              <SimpleGrid columns={2} spacing={4}>
                {documentTypes.map((docType) => (
                  <Card
                    key={docType.value}
                    border="2px solid"
                    borderColor={selectedDocumentType === docType.value ? 'blue.400' : borderColor}
                    bg={selectedDocumentType === docType.value ? 'blue.50' : "transparent"}
                    cursor="pointer"
                    onClick={() => setSelectedDocumentType(docType.value)}
                  >
                    <CardBody p={3}>
                      <VStack spacing={2}>
                        <Icon as={FileDown} color="blue.600" boxSize={5} />
                        <Text fontSize="sm" fontWeight="semibold">{docType.label}</Text>
                        <Button
                          size="xs"
                          colorScheme="blue"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDocumentType(docType.value);
                            handleDownloadConfirm();
                          }}
                          isLoading={isDownloading && selectedDocumentType === docType.value}
                          loadingText="Downloading"
                        >
                          Download
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onDownloadModalClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Requirement Request Modal */}
        <RequirementRequestModal
          isOpen={isRequirementModalOpen}
          onClose={onRequirementModalClose}
          claimId={selectedClaimForRequirement ?? ''}
          claimLenderName={selectedClaimLenderName}
        />
      </Container>
    </Box>
  );
}
