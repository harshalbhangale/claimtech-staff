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
  Badge,
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
  Spinner
} from '@chakra-ui/react';
import {
  Phone,
  Calendar,
  FileText,
  Building,
  CheckCircle,
  Edit,
  Download,
  Award,
  AlertTriangle,
  FileDown,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usersAPI, type UserDetailsResponse } from '../../api/users';
import DocumentDownloadService, { documentTypes, type DocumentType } from '../../api/download';
import { RequirementRequestModal } from '../../components/Dashboard/UserDetails/UserInfoRequestModal';

// Motion components
const MotionBox = motion(Box);
const MotionCard = motion(Card);

// Document types available for download


export default function UserDetails() {
  const { userId } = useParams();
  const [userData, setUserData] = useState<UserDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Add this handler function
  const handleRequestInfoClick = (claimId: string, lenderName: string) => {
    setSelectedClaimForRequirement(claimId);
    setSelectedClaimLenderName(lenderName);
    onRequirementModalOpen();
  };

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        setError(null);
        const response = await usersAPI.getUser(userId);
        setUserData(response);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          'Failed to fetch user details';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [userId, toast]);

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

  if (loading) {
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

  if (error) {
    return (
      <Box bg={bgColor} minH="100vh" p={4}>
        <Container maxW="container.xl">
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
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
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          mb={4}
        >
          <HStack justify="space-between" align="center">
            <VStack spacing={4}>
              <Heading size="lg" color={textColor}>
                User Details
              </Heading>
            </VStack>
            <HStack spacing={2}>
              <Button leftIcon={<Edit size={14} />} colorScheme="blue" size="sm" variant="outline">Edit</Button>
              <Button leftIcon={<Download size={14} />} colorScheme="green" size="sm" variant="outline">Export</Button>
            </HStack>
          </HStack>
        </MotionBox>

        {/* User Profile Card - Compact */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          bg={cardBg}
          borderRadius="xl"
          shadow="sm"
          mb={4}
          border="1px solid"
          borderColor={borderColor}
        >
          <CardBody p={6}>
            <HStack spacing={6} align="start" flexWrap="wrap">
              {/* Avatar */}
              <Avatar
                size="lg"
                name={`${user.first_name} ${user.last_name}`}
                bg="purple.500"
              />
              {/* User Info */}
              <VStack align="start" spacing={1} flex="1">
                <Heading size="md" color={textColor}>{user.first_name} {user.last_name}</Heading>
                <Text color="gray.500" fontSize="sm">{user.email}</Text>
                <HStack spacing={4} pt={1} flexWrap="wrap">
                  <HStack spacing={1}>
                    <Icon as={Phone} boxSize={4} color="gray.400" />
                    <Text fontSize="xs" color="gray.500">{user.phone_number || 'N/A'}</Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Icon as={Calendar} boxSize={4} color="gray.400" />
                    <Text fontSize="xs" color="gray.500">Age {age}</Text>
                  </HStack>
                </HStack>
              </VStack>
              <Grid templateColumns="repeat(2, 1fr)" gap={4} minW="200px">
                <Stat textAlign="center" bg={useColorModeValue('purple.50', 'purple.900')} p={3} borderRadius="md">
                  <StatNumber fontSize="xl" color="purple.600">{claims.length}</StatNumber>
                  <StatLabel fontSize="xs" color="purple.500">Claims</StatLabel>
                </Stat>
                <Stat textAlign="center" bg={useColorModeValue('blue.50', 'blue.900')} p={3} borderRadius="md">
                  <StatNumber fontSize="xl" color="blue.600">{new Date(user.created_at).getFullYear()}</StatNumber>
                  <StatLabel fontSize="xs" color="blue.500">Member Since</StatLabel>
                </Stat>
              </Grid>
            </HStack>
          </CardBody>
        </MotionCard>

        {/* Claims Section */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          bg={cardBg}
          borderRadius="xl"
          shadow="md"
          border="1px solid"
          borderColor={borderColor}
          overflow="hidden"
          _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
        >
          <CardBody p={6}>
            <HStack justify="space-between" mb={5}>
              <HStack spacing={3}>
                <Box bg="blue.100" p={2} borderRadius="lg">
                  <Icon as={FileText} color="blue.600" boxSize={5} />
                </Box>
                <Heading size="md" color={textColor} fontWeight="bold">Claims ({claims.length})</Heading>
              </HStack>
              {claims.length > 0 && (
                <Button size="sm" colorScheme="blue" variant="ghost" rightIcon={<ChevronRight size={16} />}>View All</Button>
              )}
            </HStack>
            {claims.length === 0 ? (
              <Box textAlign="center" py={10} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
                <Icon as={AlertTriangle} boxSize={10} color="gray.400" mb={3} />
                <Text color="gray.500" fontWeight="medium">No claims found</Text>
                <Text color="gray.400" fontSize="sm" mt={1}>This user hasn't submitted any claims yet</Text>
              </Box>
            ) : (
              <VStack spacing={4} align="stretch">
                {claims.map((claim, index) => (
                  <MotionBox
                    key={claim.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    bg={useColorModeValue('white', 'gray.700')}
                    p={5}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={borderColor}
                    shadow="sm"
                    _hover={{ shadow: "md", borderColor: "blue.200" }}
                  >
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between" align="center">
                        <HStack spacing={4}>
                          <Box bg="blue.100" p={3} borderRadius="lg">
                            <Icon as={Building} color="blue.600" boxSize={5} />
                          </Box>
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold" color={textColor} fontSize="md">{claim.lender_name}</Text>
                            <HStack spacing={2} mt={1}>
                              <Text fontSize="xs" color="gray.500">ID: {claim.id}</Text>
                              <Box w="1px" h="10px" bg="gray.300" />
                              <Text fontSize="xs" color="gray.500">
                                {new Date(claim.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </Text>
                            </HStack>
                          </VStack>
                        </HStack>
                        <Badge
                          colorScheme={getStatusColor(claim.status)}
                          variant="solid"
                          fontSize="xs"
                          px={3}
                          py={1}
                          borderRadius="full"
                          textTransform="capitalize"
                        >
                          {claim.status}
                        </Badge>
                      </HStack>
                      {/* Agreements Section */}
                      {claim.agreements && claim.agreements.length > 0 && (
                        <VStack align="start" spacing={3} mt={1}>
                          <HStack spacing={2} bg="purple.50" px={3} py={1} borderRadius="md">
                            <Icon as={Award} color="purple.500" boxSize={4} />
                            <Text fontSize="sm" fontWeight="medium" color="purple.700">
                              Agreements ({claim.agreements.length})
                            </Text>
                          </HStack>
                          <VStack spacing={3} w="full" align="stretch">
                            {claim.agreements.map((_agreement: any, agreementIndex: number) => (
                              <VStack
                                key={agreementIndex}
                                bg={useColorModeValue('gray.50', 'gray.600')}
                                p={3}
                                borderRadius="md"
                                border="1px solid"
                                borderColor={borderColor}
                                spacing={2}
                                _hover={{ bg: 'green.50', borderColor: 'green.200' }}
                                cursor="pointer"
                                transition="all 0.2s"
                                align="start"
                              >
                                <HStack>
                                  <Icon as={CheckCircle} color="green.500" boxSize={4} />
                                  <Text fontSize="sm" color={textColor} fontWeight="medium">
                                    Agreement {agreementIndex + 1}
                                  </Text>
                                </HStack>
                              </VStack>
                            ))}
                          </VStack>
                        </VStack>
                      )}
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
                  </MotionBox>
                ))}
              </VStack>
            )}

            {claims.length > 3 && (
              <Box textAlign="center" mt={5}>
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  size="sm"
                  rightIcon={<ChevronRight size={16} />}
                >
                  View all {claims.length} claims
                </Button>
              </Box>
            )}
          </CardBody>
        </MotionCard>

        {/* Responsive Download Modal */}
        <Modal
          isOpen={isDownloadModalOpen}
          onClose={onDownloadModalClose}
          size={{ base: "full", sm: "md" }}
          motionPreset="slideInBottom"
          scrollBehavior="inside"
        >
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent borderRadius={{ base: "none", sm: "2xl" }} boxShadow="xl" mx={{ base: 0, sm: "auto" }} my={{ base: 0, sm: 8 }}>
            <ModalHeader px={5} py={4} borderBottomWidth="1px" borderColor={borderColor}>
              <HStack spacing={3}>
                <Icon as={FileText} color="blue.500" boxSize={5} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">Download Document</Text>
                  <Text fontSize="sm" color="gray.500" fontWeight="normal"
                    noOfLines={1} maxW={{ base: "70vw", md: "100%" }}>
                    Claim ID: {downloadingClaimId}
                  </Text>
                </VStack>
              </HStack>
            </ModalHeader>
            <ModalCloseButton size="lg" top={{ base: 2, sm: 3 }} right={{ base: 2, sm: 3 }} zIndex={10} />
            <ModalBody py={4} px={2}>
              <Text mb={3} fontSize="sm" color="gray.600" px={3} textAlign="left">
                Select the document type you wish to download:
              </Text>
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="full" mb={2}>
                {documentTypes.map((docType) => (
                  <Card
                    key={docType.value}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor={selectedDocumentType === docType.value ? 'blue.400' : borderColor}
                    bg={selectedDocumentType === docType.value ? 'blue.50' : "transparent"}
                    _hover={{
                      shadow: "md",
                      transform: { base: undefined, sm: "translateY(-2px)" },
                      borderColor: "blue.400",
                      bg: "blue.50",
                      transition: "all 0.2s"
                    }}
                    cursor="pointer"
                    minH="110px"
                    transition="all 0.2s"
                    onClick={() => setSelectedDocumentType(docType.value)}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <CardBody py={3} px={2}>
                      <VStack spacing={2} align="center" w="full">
                        <Box bg={'blue.100'} p={3} borderRadius="full" mb={1}>
                          <Icon as={FileDown} color={'blue.600'} boxSize={6} />
                        </Box>
                        <Text fontWeight="semibold" textAlign="center" fontSize="sm" color={textColor} noOfLines={2}>
                          {docType.label}
                        </Text>
                        {selectedDocumentType === docType.value && (
                          <Badge colorScheme="blue" borderRadius="full" px={2}>
                            Selected
                          </Badge>
                        )}
                        <Button
                          leftIcon={isDownloading && selectedDocumentType === docType.value ? <Spinner size="xs" /> : <Download size={16} />}
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                          width="full"
                          mt={1}
                          aria-label={`Download ${docType.label}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDocumentType(docType.value);
                            handleDownloadConfirm();
                          }}
                          isLoading={isDownloading && selectedDocumentType === docType.value}
                          loadingText="Downloading"
                          isDisabled={isDownloading && selectedDocumentType !== docType.value}
                        >
                          Download
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </ModalBody>
            <ModalFooter borderTopWidth="1px" borderColor={borderColor} pt={4}>
              <Button variant="ghost" mr={3} onClick={onDownloadModalClose} w="full" fontWeight="medium">
                Cancel
              </Button>
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
