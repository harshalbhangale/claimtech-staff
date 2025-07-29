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
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Avatar,
  Badge,
  Button,
  Divider,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  Skeleton,
  SkeletonText,
  Tag,
  TagLabel,
  TagLeftIcon,
  Flex,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import { 
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  User,
  FileText,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Download,
  Share,
  Users,
  Award,
  Shield,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersAPI, type UserDetailsResponse } from '../../api/users';

// Motion components
const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Fetch user details
  const fetchUserDetails = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await usersAPI.getUser(userId);
      console.log('User details response:', response);
      
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

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'verified':
      case 'approved':
        return CheckCircle;
      case 'pending':
      case 'draft':
        return Clock;
      case 'inactive':
      case 'rejected':
      case 'disabled':
        return XCircle;
      default:
        return AlertTriangle;
    }
  };

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh" p={6}>
        <Container maxW="container.xl">
          <VStack spacing={6} align="stretch">
            <Skeleton height="60px" />
            <Skeleton height="200px" />
            <Skeleton height="300px" />
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box bg={bgColor} minH="100vh" p={6}>
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
      <Box bg={bgColor} minH="100vh" p={6}>
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
            <HStack spacing={4}>
              <Button
                leftIcon={<ArrowLeft size={16} />}
                variant="ghost"
                onClick={() => navigate('/users')}
                color="gray.600"
                _hover={{ bg: 'gray.100' }}
              >
                Back to Users
              </Button>
              <VStack align="start" spacing={1}>
                <Heading size="lg" color={textColor}>
                  User Details
                </Heading>
                <Text color="gray.600">
                  {user.first_name} {user.last_name}
                </Text>
              </VStack>
            </HStack>
            <HStack spacing={3}>
              <Button
                leftIcon={<Edit size={16} />}
                colorScheme="blue"
                size="sm"
                variant="outline"
              >
                Edit User
              </Button>
              <Button
                leftIcon={<Download size={16} />}
                colorScheme="green"
                size="sm"
                variant="outline"
              >
                Export Data
              </Button>
            </HStack>
          </HStack>
        </MotionBox>

        {/* User Profile Card */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          bg={cardBg}
          borderRadius="xl"
          overflow="hidden"
          shadow="lg"
          mb={6}
        >
          <Box
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            p={6}
            color="white"
          >
            <HStack spacing={6}>
              <Avatar
                size="xl"
                name={`${user.first_name} ${user.last_name}`}
                bg="rgba(255,255,255,0.2)"
                border="3px solid rgba(255,255,255,0.3)"
              />
              <VStack align="start" spacing={2} flex="1">
                <Heading size="lg">
                  {user.first_name} {user.last_name}
                </Heading>
                <Text fontSize="lg" opacity={0.9}>
                  {user.email}
                </Text>
                <HStack spacing={4}>
                  <Badge
                    colorScheme={user.is_enabled ? 'green' : 'red'}
                    variant="solid"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {user.is_enabled ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge
                    colorScheme={user.is_verified ? 'green' : 'yellow'}
                    variant="solid"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {user.is_verified ? 'Verified' : 'Unverified'}
                  </Badge>
                </HStack>
              </VStack>
            </HStack>
          </Box>

          <CardBody p={6}>
            <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
              {/* Personal Information */}
              <VStack align="start" spacing={4}>
                <Heading size="md" color={textColor}>
                  Personal Information
                </Heading>
                <VStack align="start" spacing={3} w="full">
                  <HStack spacing={3}>
                    <Icon as={User} color="gray.400" boxSize={5} />
                    <Text fontSize="sm" color="gray.600">
                      <strong>Full Name:</strong> {user.first_name} {user.last_name}
                    </Text>
                  </HStack>
                  <HStack spacing={3}>
                    <Icon as={Mail} color="gray.400" boxSize={5} />
                    <Text fontSize="sm" color="gray.600">
                      <strong>Email:</strong> {user.email}
                    </Text>
                  </HStack>
                  <HStack spacing={3}>
                    <Icon as={Phone} color="gray.400" boxSize={5} />
                    <Text fontSize="sm" color="gray.600">
                      <strong>Phone:</strong> {user.phone_number || 'Not provided'}
                    </Text>
                  </HStack>
                  <HStack spacing={3}>
                    <Icon as={Calendar} color="gray.400" boxSize={5} />
                    <Text fontSize="sm" color="gray.600">
                      <strong>Date of Birth:</strong> {new Date(user.date_of_birth).toLocaleDateString()} ({age} years)
                    </Text>
                  </HStack>
                </VStack>
              </VStack>

              {/* Account Statistics */}
              <VStack align="start" spacing={4}>
                <Heading size="md" color={textColor}>
                  Account Statistics
                </Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                  <Stat>
                    <StatLabel color="gray.600">Total Claims</StatLabel>
                    <StatNumber color={textColor}>{claims.length}</StatNumber>
                    <StatHelpText color="gray.500">
                      {claims.length === 0 ? 'No claims yet' : `${claims.length} claim${claims.length > 1 ? 's' : ''}`}
                    </StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel color="gray.600">Member Since</StatLabel>
                    <StatNumber color={textColor}>
                      {new Date(user.created_at).getFullYear()}
                    </StatNumber>
                    <StatHelpText color="gray.500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </StatHelpText>
                  </Stat>
                </Grid>
              </VStack>
            </Grid>
          </CardBody>
        </MotionCard>

        {/* Claims Section */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          bg={cardBg}
          borderRadius="xl"
          overflow="hidden"
          shadow="lg"
        >
          <Box
            bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            p={6}
            color="white"
          >
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <Heading size="lg">
                  Claims & Lenders
                </Heading>
                <Text opacity={0.9}>
                  {claims.length} claim{claims.length !== 1 ? 's' : ''} found
                </Text>
              </VStack>
              <Icon as={FileText} boxSize={8} opacity={0.8} />
            </HStack>
          </Box>

          <CardBody p={6}>
            {claims.length === 0 ? (
              <VStack spacing={4} py={8}>
                <Icon as={AlertTriangle} boxSize={12} color="gray.400" />
                <Text color="gray.600" fontSize="lg">
                  No claims found for this user
                </Text>
                <Text color="gray.500" textAlign="center">
                  This user hasn't submitted any claims yet.
                </Text>
              </VStack>
            ) : (
              <VStack spacing={6} align="stretch">
                {claims.map((claim, index) => (
                  <MotionCard
                    key={claim.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <CardBody p={6}>
                      <VStack align="stretch" spacing={4}>
                        {/* Claim Header */}
                        <HStack justify="space-between">
                          <VStack align="start" spacing={1}>
                            <HStack spacing={3}>
                              <Icon as={Building} color="blue.500" boxSize={5} />
                              <Text fontWeight="semibold" color={textColor}>
                                {claim.lender_name}
                              </Text>
                            </HStack>
                            <Text fontSize="sm" color="gray.500">
                              Claim ID: {claim.id}
                            </Text>
                          </VStack>
                          <HStack spacing={3}>
                            <Tag
                              colorScheme={getStatusColor(claim.status)}
                              variant="subtle"
                              borderRadius="full"
                              px={3}
                              py={1}
                            >
                              <TagLeftIcon as={getStatusIcon(claim.status)} />
                              <TagLabel>{claim.status}</TagLabel>
                            </Tag>
                            <Text fontSize="sm" color="gray.500">
                              {new Date(claim.created_at).toLocaleDateString()}
                            </Text>
                          </HStack>
                        </HStack>

                        <Divider />

                        {/* Agreements Section */}
                        <VStack align="start" spacing={3}>
                          <HStack spacing={2}>
                            <Icon as={Award} color="purple.500" boxSize={4} />
                            <Text fontWeight="medium" color={textColor}>
                              Agreements
                            </Text>
                          </HStack>
                          
                          {claim.agreements && claim.agreements.length > 0 ? (
                            <VStack align="start" spacing={2} w="full">
                              {claim.agreements.map((agreement: any, agreementIndex: number) => (
                                <HStack
                                  key={agreementIndex}
                                  bg={useColorModeValue('white', 'gray.600')}
                                  p={3}
                                  borderRadius="md"
                                  border="1px solid"
                                  borderColor={borderColor}
                                  w="full"
                                  justify="space-between"
                                >
                                  <HStack spacing={3}>
                                    <Icon as={CheckCircle} color="green.500" boxSize={4} />
                                    <Text fontSize="sm" color={textColor}>
                                      Agreement {agreementIndex + 1}
                                    </Text>
                                  </HStack>
                                  <Badge colorScheme="green" variant="subtle">
                                    Active
                                  </Badge>
                                </HStack>
                              ))}
                            </VStack>
                          ) : (
                            <HStack
                              bg={useColorModeValue('gray.100', 'gray.600')}
                              p={4}
                              borderRadius="md"
                              w="full"
                            >
                              <Icon as={AlertTriangle} color="yellow.500" boxSize={4} />
                              <Text fontSize="sm" color="gray.600">
                                No agreements available for this claim
                              </Text>
                            </HStack>
                          )}
                        </VStack>

                        {/* Claim Actions */}
                        <HStack justify="end" spacing={2}>
                          <Button size="sm" variant="outline" colorScheme="blue">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" colorScheme="green">
                            Download
                          </Button>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </MotionCard>
                ))}
              </VStack>
            )}
          </CardBody>
        </MotionCard>
      </Container>
    </Box>
  );
} 