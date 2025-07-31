// import { 
//   Box, 
//   Container, 
//   VStack, 
//   HStack, 
//   Text, 
//   Card, 
//   CardBody,
//   Heading,
//   Icon,
//   useColorModeValue,
//   Spinner,
//   Alert,
//   AlertIcon,
//   AlertTitle,
//   AlertDescription,
//   Avatar,
//   Badge,
//   Button,
//   Divider,
//   Grid,
//   GridItem,
//   Stat,
//   StatLabel,
//   StatNumber,
//   StatHelpText,
//   useToast,
//   Skeleton,
//   SkeletonText,
//   Tag,
//   TagLabel,
//   TagLeftIcon,
//   Flex,
//   IconButton,
//   Tooltip
// } from '@chakra-ui/react';
// import { 
//   ArrowLeft,
//   Mail,
//   Phone,
//   Calendar,
//   User,
//   FileText,
//   Building,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Edit,
//   Download,
//   Share,
//   Users,
//   Award,
//   Shield,
//   TrendingUp,
//   AlertTriangle
// } from 'lucide-react';
// import { motion } from 'framer-motion';
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { usersAPI, type UserDetailsResponse } from '../../api/users';

// // Motion components
// const MotionBox = motion(Box);
// const MotionCard = motion(Card);

// export default function UserDetails() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState<UserDetailsResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const bgColor = useColorModeValue('gray.50', 'gray.900');
//   const cardBg = useColorModeValue('white', 'gray.800');
//   const textColor = useColorModeValue('gray.800', 'white');
//   const borderColor = useColorModeValue('gray.200', 'gray.700');

//   const toast = useToast();

//   // Calculate age from date of birth
//   const calculateAge = (dateOfBirth: string): number => {
//     const today = new Date();
//     const birthDate = new Date(dateOfBirth);
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();
    
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//       age--;
//     }
    
//     return age;
//   };

//   // Fetch user details
//   const fetchUserDetails = async () => {
//     if (!userId) return;

//     try {
//       setLoading(true);
//       setError(null);

//       const response = await usersAPI.getUser(userId);
//       console.log('User details response:', response);
      
//       setUserData(response);
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || 
//                           err.response?.data?.detail || 
//                           err.message || 
//                           'Failed to fetch user details';
      
//       setError(errorMessage);
//       toast({
//         title: 'Error',
//         description: errorMessage,
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserDetails();
//   }, [userId]);

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'active':
//       case 'verified':
//       case 'approved':
//         return 'green';
//       case 'pending':
//       case 'draft':
//         return 'yellow';
//       case 'inactive':
//       case 'rejected':
//       case 'disabled':
//         return 'red';
//       default:
//         return 'gray';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'active':
//       case 'verified':
//       case 'approved':
//         return CheckCircle;
//       case 'pending':
//       case 'draft':
//         return Clock;
//       case 'inactive':
//       case 'rejected':
//       case 'disabled':
//         return XCircle;
//       default:
//         return AlertTriangle;
//     }
//   };

//   if (loading) {
//     return (
//       <Box bg={bgColor} minH="100vh" p={6}>
//         <Container maxW="container.xl">
//           <VStack spacing={6} align="stretch">
//             <Skeleton height="60px" />
//             <Skeleton height="200px" />
//             <Skeleton height="300px" />
//           </VStack>
//         </Container>
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box bg={bgColor} minH="100vh" p={6}>
//         <Container maxW="container.xl">
//           <Alert status="error" borderRadius="lg">
//             <AlertIcon />
//             <AlertTitle>Error!</AlertTitle>
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         </Container>
//       </Box>
//     );
//   }

//   if (!userData) {
//     return (
//       <Box bg={bgColor} minH="100vh" p={6}>
//         <Container maxW="container.xl">
//           <Alert status="warning" borderRadius="lg">
//             <AlertIcon />
//             <AlertTitle>No Data!</AlertTitle>
//             <AlertDescription>No user data found.</AlertDescription>
//           </Alert>
//         </Container>
//       </Box>
//     );
//   }

//   const { user, claims } = userData;
//   const age = calculateAge(user.date_of_birth);

//   return (
//     <Box bg={bgColor} minH="100vh" mt={8}>
//       <Container maxW="container.xl">
//         {/* Header */}
//         <MotionBox
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           mb={6}
//         >
//           <VStack align="stretch" spacing={4}>
//             {/* Back Button */}
//             <HStack justify="start">
//               <Button
//                 leftIcon={<ArrowLeft size={18} />}
//                 variant="ghost"
//                 onClick={() => navigate('/users')}
//                 color="purple.600"
//                 bg="purple.50"
//                 _hover={{ 
//                   bg: 'purple.100',
//                   transform: 'translateX(-2px)',
//                   boxShadow: 'sm'
//                 }}
//                 _active={{ transform: 'translateX(0px)' }}
//                 transition="all 0.2s"
//                 borderRadius="lg"
//                 px={4}
//                 py={2}
//                 fontWeight="medium"
//                 fontSize="sm"
//                 border="1px"
//               >
//                 Back to Users
//               </Button>
//             </HStack>

//             {/* Main Header */}
//             <HStack justify="space-between" align="start">
//               <VStack align="start" spacing={2}>
//                 <Heading size="lg" color={textColor}>
//                   User Details
//                 </Heading>
//               </VStack>
//               <HStack spacing={3}>
//                 <Button
//                   leftIcon={<Edit size={16} />}
//                   colorScheme="blue"
//                   size="sm"
//                   variant="outline"
//                   borderRadius="lg"
//                 >
//                   Edit User
//                 </Button>
//                 <Button
//                   leftIcon={<Download size={16} />}
//                   colorScheme="green"
//                   size="sm"
//                   variant="outline"
//                   borderRadius="lg"
//                 >
//                   Export Data
//                 </Button>
//               </HStack>
//             </HStack>
//           </VStack>
//         </MotionBox>

//         {/* User Profile Card */}
//         <MotionCard
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.1 }}
//           bg={cardBg}
//           borderRadius="2xl"
//           overflow="hidden"
//           shadow="xl"
//           mb={6}
//           border="1px solid"
//           borderColor={borderColor}
//         >
//                     {/* Hero Section */}
//           <Box
//             bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
//             p={6}
//             color="white"
//             position="relative"
//             overflow="hidden"
//             _before={{
//               content: '""',
//               position: 'absolute',
//               top: '-50%',
//               right: '-20%',
//               width: '200%',
//               height: '200%',
//               background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
//               borderRadius: '50%',
//               zIndex: 0
//             }}
//           >
//             <HStack spacing={6} position="relative" zIndex={1}>
//               <Avatar
//                 size="xl"
//                 name={`${user.first_name} ${user.last_name}`}
//                 bg="rgba(255,255,255,0.2)"
//                 border="3px solid rgba(255,255,255,0.4)"
//                 boxShadow="lg"
//               />
//               <VStack align="start" spacing={2} flex="1">
//                 <Heading size="lg" fontWeight="bold">
//                   {user.first_name} {user.last_name}
//                 </Heading>
//                 <Text fontSize="md" opacity={0.9} fontWeight="medium">
//                   {user.email}
//                 </Text>
//                 {claims.length > 0 && (
//                   <HStack spacing={3} pt={1}>
//                     <Badge
//                       colorScheme={getStatusColor(claims[0].status)}
//                       variant="solid"
//                       px={3}
//                       py={1}
//                       borderRadius="full"
//                       fontSize="xs"
//                       fontWeight="semibold"
//                       boxShadow="sm"
//                     >
//                       <HStack spacing={1}>
//                         <Icon as={getStatusIcon(claims[0].status)} boxSize={3} />
//                         <Text>{claims[0].status}</Text>
//                       </HStack>
//                     </Badge>
//                     {claims.length > 1 && (
//                       <Badge
//                         colorScheme="blue"
//                         variant="outline"
//                         px={2}
//                         py={1}
//                         borderRadius="full"
//                         fontSize="xs"
//                         fontWeight="medium"
//                         bg="rgba(255,255,255,0.1)"
//                         borderColor="rgba(255,255,255,0.3)"
//                         color="white"
//                       >
//                         +{claims.length - 1} more
//                       </Badge>
//                     )}
//                   </HStack>
//                 )}
//               </VStack>
//             </HStack>
//           </Box>

//           {/* Information Section */}
//           <CardBody p={6}>
//             <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={6}>
//               {/* Personal Information */}
//               <VStack align="start" spacing={4}>
//                 <HStack spacing={2}>
//                   <Icon as={User} color="purple.500" boxSize={5} />
//                   <Heading size="sm" color={textColor}>
//                     Personal Information
//                   </Heading>
//                 </HStack>
//                 <VStack align="start" spacing={3} w="full">
//                   <Box
//                     bg={useColorModeValue('gray.50', 'gray.700')}
//                     p={3}
//                     borderRadius="md"
//                     w="full"
//                     border="1px solid"
//                     borderColor={borderColor}
//                   >
//                     <HStack spacing={2} mb={2}>
//                       <Icon as={User} color="purple.400" boxSize={3} />
//                       <Text fontSize="xs" fontWeight="semibold" color="purple.600">
//                         Full Name
//                       </Text>
//                     </HStack>
//                     <Text fontSize="sm" color={textColor} fontWeight="medium">
//                       {user.first_name} {user.last_name}
//                     </Text>
//                   </Box>
                  
//                   <Box
//                     bg={useColorModeValue('gray.50', 'gray.700')}
//                     p={3}
//                     borderRadius="md"
//                     w="full"
//                     border="1px solid"
//                     borderColor={borderColor}
//                   >
//                     <HStack spacing={2} mb={2}>
//                       <Icon as={Mail} color="purple.400" boxSize={3} />
//                       <Text fontSize="xs" fontWeight="semibold" color="purple.600">
//                         Email Address
//                       </Text>
//                     </HStack>
//                     <Text fontSize="sm" color={textColor} fontWeight="medium">
//                       {user.email}
//                     </Text>
//                   </Box>
                  
//                   <Box
//                     bg={useColorModeValue('gray.50', 'gray.700')}
//                     p={3}
//                     borderRadius="md"
//                     w="full"
//                     border="1px solid"
//                     borderColor={borderColor}
//                   >
//                     <HStack spacing={2} mb={2}>
//                       <Icon as={Phone} color="purple.400" boxSize={3} />
//                       <Text fontSize="xs" fontWeight="semibold" color="purple.600">
//                         Phone Number
//                       </Text>
//                     </HStack>
//                     <Text fontSize="sm" color={textColor} fontWeight="medium">
//                       {user.phone_number || 'Not provided'}
//                     </Text>
//                   </Box>
                  
//                   <Box
//                     bg={useColorModeValue('gray.50', 'gray.700')}
//                     p={3}
//                     borderRadius="md"
//                     w="full"
//                     border="1px solid"
//                     borderColor={borderColor}
//                   >
//                     <HStack spacing={2} mb={2}>
//                       <Icon as={Calendar} color="purple.400" boxSize={3} />
//                       <Text fontSize="xs" fontWeight="semibold" color="purple.600">
//                         Date of Birth
//                       </Text>
//                     </HStack>
//                     <Text fontSize="sm" color={textColor} fontWeight="medium">
//                       {new Date(user.date_of_birth).toLocaleDateString()} ({age} years)
//                     </Text>
//                   </Box>
//                 </VStack>
//               </VStack>

//               {/* Account Statistics */}
//               <VStack align="start" spacing={4}>
//                 <HStack spacing={2}>
//                   <Icon as={TrendingUp} color="purple.500" boxSize={5} />
//                   <Heading size="sm" color={textColor}>
//                     Account Statistics
//                   </Heading>
//                 </HStack>
//                 <Grid templateColumns="repeat(2, 1fr)" gap={3} w="full">
//                   <Box
//                     bg={useColorModeValue('purple.50', 'purple.900')}
//                     p={4}
//                     borderRadius="lg"
//                     border="1px solid"
//                     borderColor="purple.200"
//                     textAlign="center"
//                   >
//                     <Stat>
//                       <StatLabel color="purple.600" fontSize="xs" fontWeight="semibold">
//                         Total Claims
//                       </StatLabel>
//                       <StatNumber color="purple.700" fontSize="2xl" fontWeight="bold">
//                         {claims.length}
//                       </StatNumber>
//                       <StatHelpText color="purple.500" fontSize="xs">
//                         {claims.length === 0 ? 'No claims yet' : `${claims.length} claim${claims.length > 1 ? 's' : ''}`}
//                       </StatHelpText>
//                     </Stat>
//                   </Box>
                  
//                   <Box
//                     bg={useColorModeValue('blue.50', 'blue.900')}
//                     p={4}
//                     borderRadius="lg"
//                     border="1px solid"
//                     borderColor="blue.200"
//                     textAlign="center"
//                   >
//                     <Stat>
//                       <StatLabel color="blue.600" fontSize="xs" fontWeight="semibold">
//                         Member Since
//                       </StatLabel>
//                       <StatNumber color="blue.700" fontSize="2xl" fontWeight="bold">
//                         {new Date(user.created_at).getFullYear()}
//                       </StatNumber>
//                       <StatHelpText color="blue.500" fontSize="xs">
//                         {new Date(user.created_at).toLocaleDateString()}
//                       </StatHelpText>
//                     </Stat>
//                   </Box>
//                 </Grid>
//               </VStack>
//             </Grid>
//           </CardBody>
//         </MotionCard>

//         {/* Claims Section */}
//         <MotionCard
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           bg={cardBg}
//           borderRadius="2xl"
//           overflow="hidden"
//           shadow="xl"
//           border="1px solid"
//           borderColor={borderColor}
//         >
//           <Box
//             bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
//             p={8}
//             color="white"
//             position="relative"
//             overflow="hidden"
//             _before={{
//               content: '""',
//               position: 'absolute',
//               top: '-50%',
//               left: '-20%',
//               width: '200%',
//               height: '200%',
//               background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
//               borderRadius: '50%',
//               zIndex: 0
//             }}
//           >
//             <HStack justify="space-between" position="relative" zIndex={1}>
//               <VStack align="start" spacing={2}>
//                 <Heading size="xl" fontWeight="bold">
//                   Claims & Lenders
//                 </Heading>
//                 <Text fontSize="lg" opacity={0.9} fontWeight="medium">
//                   {claims.length} claim{claims.length !== 1 ? 's' : ''} found
//                 </Text>
//               </VStack>
//               <Icon as={FileText} boxSize={10} opacity={0.8} />
//             </HStack>
//           </Box>

//           <CardBody p={6}>
//             {claims.length === 0 ? (
//               <VStack spacing={4} py={8}>
//                 <Icon as={AlertTriangle} boxSize={12} color="gray.400" />
//                 <Text color="gray.600" fontSize="lg">
//                   No claims found for this user
//                 </Text>
//                 <Text color="gray.500" textAlign="center">
//                   This user hasn't submitted any claims yet.
//                 </Text>
//               </VStack>
//             ) : (
//               <VStack spacing={6} align="stretch">
//                 {claims.map((claim, index) => (
//                   <MotionCard
//                     key={claim.id}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
//                     bg={useColorModeValue('white', 'gray.800')}
//                     borderRadius="xl"
//                     border="1px solid"
//                     borderColor={borderColor}
//                     shadow="md"
//                     _hover={{ 
//                       shadow: 'lg',
//                       transform: 'translateY(-2px)',
//                       transition: 'all 0.2s'
//                     }}
//                   >
//                     <CardBody p={6}>
//                       <VStack align="stretch" spacing={6}>
//                         {/* Claim Header */}
//                         <HStack justify="space-between" align="start">
//                           <VStack align="start" spacing={2}>
//                             <HStack spacing={3}>
//                               <Box
//                                 bg="blue.100"
//                                 p={2}
//                                 borderRadius="lg"
//                                 border="1px solid"
//                                 borderColor="blue.200"
//                               >
//                                 <Icon as={Building} color="blue.600" boxSize={5} />
//                               </Box>
//                               <VStack align="start" spacing={0}>
//                                 <Text fontWeight="bold" color={textColor} fontSize="lg">
//                                   {claim.lender_name}
//                                 </Text>
//                                 <Text fontSize="sm" color="gray.500" fontWeight="medium">
//                                   Claim ID: {claim.id}
//                                 </Text>
//                               </VStack>
//                             </HStack>
//                           </VStack>
//                           <VStack align="end" spacing={2}>
//                             <Tag
//                               colorScheme={getStatusColor(claim.status)}
//                               variant="solid"
//                               borderRadius="full"
//                               px={4}
//                               py={2}
//                               fontWeight="semibold"
//                               boxShadow="sm"
//                             >
//                               <TagLeftIcon as={getStatusIcon(claim.status)} />
//                               <TagLabel>{claim.status}</TagLabel>
//                             </Tag>
//                             <Text fontSize="sm" color="gray.500" fontWeight="medium">
//                               {new Date(claim.created_at).toLocaleDateString()}
//                             </Text>
//                           </VStack>
//                         </HStack>

//                         <Divider />

//                         {/* Agreements Section */}
//                         <VStack align="start" spacing={3}>
//                           <HStack spacing={2}>
//                             <Icon as={Award} color="purple.500" boxSize={4} />
//                             <Text fontWeight="medium" color={textColor}>
//                               Agreements
//                             </Text>
//                           </HStack>
                          
//                           {claim.agreements && claim.agreements.length > 0 ? (
//                             <VStack align="start" spacing={2} w="full">
//                               {claim.agreements.map((agreement: any, agreementIndex: number) => (
//                                 <HStack
//                                   key={agreementIndex}
//                                   bg={useColorModeValue('white', 'gray.600')}
//                                   p={3}
//                                   borderRadius="md"
//                                   border="1px solid"
//                                   borderColor={borderColor}
//                                   w="full"
//                                   justify="space-between"
//                                 >
//                                   <HStack spacing={3}>
//                                     <Icon as={CheckCircle} color="green.500" boxSize={4} />
//                                     <Text fontSize="sm" color={textColor}>
//                                       Agreement {agreementIndex + 1}
//                                     </Text>
//                                   </HStack>
//                                   <Badge colorScheme="green" variant="subtle">
//                                     Active
//                                   </Badge>
//                                 </HStack>
//                               ))}
//                             </VStack>
//                           ) : (
//                             <HStack
//                               bg={useColorModeValue('gray.100', 'gray.600')}
//                               p={4}
//                               borderRadius="md"
//                               w="full"
//                             >
//                               <Icon as={AlertTriangle} color="yellow.500" boxSize={4} />
//                               <Text fontSize="sm" color="gray.600">
//                                 No agreements available for this claim
//                               </Text>
//                             </HStack>
//                           )}
//                         </VStack>

//                         {/* Claim Actions */}
//                         <HStack justify="end" spacing={2}>
//                           <Button size="sm" variant="outline" colorScheme="blue">
//                             View Details
//                           </Button>
//                           <Button size="sm" variant="outline" colorScheme="green">
//                             Download
//                           </Button>
//                         </HStack>
//                       </VStack>
//                     </CardBody>
//                   </MotionCard>
//                 ))}
//               </VStack>
//             )}
//           </CardBody>
//         </MotionCard>
//       </Container>
//     </Box>
//   );
// } 
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
  Shield,
  AlertTriangle,
  FileDown,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usersAPI, type UserDetailsResponse } from '../../api/users';
import DocumentDownloadService, { documentTypes, type DocumentType } from '../../api/download';

// Motion components
const MotionBox = motion(Box);
const MotionCard = motion(Card);

// Document types available for download
const DOCUMENT_TYPES = [
  { key: 'care_pack', name: 'Care Pack', icon: Shield, color: 'blue' },
  { key: 'dsar_request', name: 'DSAR Request', icon: FileText, color: 'green' },
  { key: 'letter_of_claim', name: 'Letter of Claim', icon: FileText, color: 'purple' },
  { key: 'prowse_phillips_dsa', name: 'Prowse Phillips DSA', icon: Award, color: 'orange' },
  { key: 'prowse_phillips_loa', name: 'Prowse Phillips LOA', icon: Award, color: 'orange' },
  { key: 'solvo_loa', name: 'Solvo LOA', icon: Building, color: 'teal' }
];

export default function UserDetails() {
  const { userId } = useParams();
  const [userData, setUserData] = useState<UserDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClaim] = useState<any>(null);
  const { isOpen, onClose } = useDisclosure();
  
  // Download modal state
  const { 
    isOpen: isDownloadModalOpen, 
    onOpen: onDownloadModalOpen, 
    onClose: onDownloadModalClose 
  } = useDisclosure();
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


  // Download functions
  const handleDownloadClick = (claimId: string) => {
    console.log('🎯 Download button clicked');
    console.log('🆔 Claim ID:', claimId);
    setDownloadingClaimId(claimId);
    setSelectedDocumentType('care_pack'); // Reset to default
    console.log('📄 Default document type set to:', 'care_pack');
    console.log('🔓 Opening download modal...');
    onDownloadModalOpen();
  };

  const handleDownloadConfirm = async () => {
    if (!downloadingClaimId) {
      console.warn('⚠️ No claim ID selected for download');
      return;
    }

    console.log('✅ Download confirmed');
    console.log('🆔 Downloading for claim:', downloadingClaimId);
    console.log('📄 Selected document type:', selectedDocumentType);

    setIsDownloading(true);
    try {
      console.log('🔄 Starting download process...');
      await DocumentDownloadService.downloadClaimDocument(
        downloadingClaimId,
        selectedDocumentType,
        `${selectedDocumentType}_${downloadingClaimId}.pdf`
      );
      
      console.log('🎉 Download completed successfully');
      toast({
        title: 'Success',
        description: 'Document download started successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      console.log('🔒 Closing download modal...');
      onDownloadModalClose();
    } catch (error: any) {
      console.error('❌ Download failed:', error);
      toast({
        title: 'Download Failed',
        description: error.message || 'Failed to download document',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      console.log('🏁 Download process finished, resetting loading state');
      setIsDownloading(false);
    }
  };


  const handleDownloadDocument = (documentType: string) => {
    // Placeholder for API call
    toast({
      title: 'Download Started',
      description: `Downloading ${DOCUMENT_TYPES.find(doc => doc.key === documentType)?.name}...`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
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
              <Button
                leftIcon={<Edit size={14} />}
                colorScheme="blue"
                size="sm"
                variant="outline"
              >
                Edit
              </Button>
              <Button
                leftIcon={<Download size={14} />}
                colorScheme="green"
                size="sm"
                variant="outline"
              >
                Export
              </Button>
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
            <HStack spacing={6} align="start">
              {/* Avatar */}
              <Avatar
                size="lg"
                name={`${user.first_name} ${user.last_name}`}
                bg="purple.500"
              />
              
              {/* User Info */}
              <VStack align="start" spacing={1} flex="1">
                <Heading size="md" color={textColor}>
                  {user.first_name} {user.last_name}
                </Heading>
                <Text color="gray.500" fontSize="sm">
                  {user.email}
                </Text>
                <HStack spacing={4} pt={1}>
                  <HStack spacing={1}>
                    <Icon as={Phone} size={12} color="gray.400" />
                    <Text fontSize="xs" color="gray.500">
                      {user.phone_number || 'N/A'}
                    </Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Icon as={Calendar} size={12} color="gray.400" />
                    <Text fontSize="xs" color="gray.500">
                      Age {age}
                    </Text>
                  </HStack>
                </HStack>
              </VStack>

              {/* Stats */}
              <Grid templateColumns="repeat(2, 1fr)" gap={4} minW="200px">
                <Stat textAlign="center" bg={useColorModeValue('purple.50', 'purple.900')} p={3} borderRadius="md">
                  <StatNumber fontSize="xl" color="purple.600">
                    {claims.length}
                  </StatNumber>
                  <StatLabel fontSize="xs" color="purple.500">
                    Claims
                  </StatLabel>
                </Stat>
                <Stat textAlign="center" bg={useColorModeValue('blue.50', 'blue.900')} p={3} borderRadius="md">
                  <StatNumber fontSize="xl" color="blue.600">
                    {new Date(user.created_at).getFullYear()}
                  </StatNumber>
                  <StatLabel fontSize="xs" color="blue.500">
                    Member Since
                  </StatLabel>
                </Stat>
              </Grid>
            </HStack>
          </CardBody>
        </MotionCard>

        {/* Claims Section - Compact */}
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
                <Heading size="md" color={textColor} fontWeight="bold">
                  Claims ({claims.length})
                </Heading>
              </HStack>
              
              {claims.length > 0 && (
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="ghost"
                  rightIcon={<ChevronRight size={16} />}
                  _hover={{ bg: 'blue.50', color: 'blue.600' }}
                >
                  View All
                </Button>
              )}
            </HStack>

            {claims.length === 0 ? (
              <Box 
                textAlign="center" 
                py={10} 
                bg={useColorModeValue('gray.50', 'gray.700')}
                borderRadius="lg"
              >
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
                    position="relative"
                  >
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between" align="center">
                        <HStack spacing={4}>
                          <Box bg="blue.100" p={3} borderRadius="lg">
                            <Icon as={Building} color="blue.600" boxSize={5} />
                          </Box>
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold" color={textColor} fontSize="md">
                              {claim.lender_name}
                            </Text>
                            <HStack spacing={2} mt={1}>
                              <Text fontSize="xs" color="gray.500">
                                ID: {claim.id}
                              </Text>
                              <Box w="1px" h="10px" bg="gray.300" />
                              <Text fontSize="xs" color="gray.500">
                                {new Date(claim.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </Text>
                            </HStack>
                          </VStack>
                        </HStack>
                        
                        <HStack spacing={3}>
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
                      
                      {/* Claim Actions */}
                      <Divider />
                      <HStack justify="end" spacing={2}>
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

        {/* Document Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack spacing={3}>
                <Icon as={FileText} color="blue.500" />
                <VStack align="start" spacing={0}>
                  <Text>Documents for {selectedClaim?.lender_name}</Text>
                  <Text fontSize="sm" color="gray.500" fontWeight="normal">
                    Claim ID: {selectedClaim?.id}
                  </Text>
                </VStack>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <SimpleGrid columns={2} spacing={4}>
                {DOCUMENT_TYPES.map((docType) => (
                  <Card
                    key={docType.key}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={borderColor}
                    _hover={{
                      shadow: 'md',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s'
                    }}
                    cursor="pointer"
                    onClick={() => handleDownloadDocument(docType.key)}
                  >
                    <CardBody p={4}>
                      <VStack spacing={3}>
                        <Box
                          bg={`${docType.color}.100`}
                          p={3}
                          borderRadius="lg"
                        >
                          <Icon
                            as={docType.icon}
                            color={`${docType.color}.600`}
                            boxSize={6}
                          />
                        </Box>
                        <Text
                          fontWeight="semibold"
                          textAlign="center"
                          fontSize="sm"
                          color={textColor}
                        >
                          {docType.name}
                        </Text>
                        <Button
                          leftIcon={<FileDown size={14} />}
                          size="sm"
                          colorScheme={docType.color}
                          variant="outline"
                          width="full"
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
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Document Download Modal */}
        <Modal isOpen={isDownloadModalOpen} onClose={onDownloadModalClose} size="md">
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent borderRadius="xl" boxShadow="xl">
            <ModalHeader borderBottomWidth="1px" borderColor={borderColor} pb={4}>
              <HStack spacing={3}>
                <Icon as={FileText} color="blue.500" boxSize={5} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">Download Document</Text>
                  <Text fontSize="sm" color="gray.500" fontWeight="normal">
                    Claim ID: {downloadingClaimId}
                  </Text>
                </VStack>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6}>
              <Text mb={4} fontSize="sm" color="gray.600">
                Select the document type you wish to download:
              </Text>
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                {documentTypes.map((docType) => (
                  <Card
                    key={docType.value}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={selectedDocumentType === docType.value ? 'blue.300' : borderColor}
                    bg={selectedDocumentType === docType.value ? 'blue.50' : 'transparent'}
                    _hover={{
                      shadow: 'md',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s'
                    }}
                    cursor="pointer"
                    onClick={() => setSelectedDocumentType(docType.value)}
                    transition="all 0.2s ease"
                  >
                    <CardBody p={4}>
                      <VStack spacing={3}>
                        <Box
                          bg={selectedDocumentType === docType.value ? 'blue.100' : 'gray.100'}
                          p={3}
                          borderRadius="full"
                          boxSize="50px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon
                            as={FileDown}
                            color={selectedDocumentType === docType.value ? 'blue.600' : 'gray.600'}
                            boxSize={5}
                          />
                        </Box>
                        <Text
                          fontWeight="semibold"
                          textAlign="center"
                          fontSize="sm"
                          color={textColor}
                        >
                          {docType.label}
                        </Text>
                        <Text fontSize="xs" color="gray.500" textAlign="center" noOfLines={2}>
                          {docType.description}
                        </Text>
                        {selectedDocumentType === docType.value && (
                          <Badge colorScheme="blue" borderRadius="full" px={2}>
                            Selected
                          </Badge>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </ModalBody>
            <ModalFooter borderTopWidth="1px" borderColor={borderColor} pt={4}>
              <Button variant="ghost" mr={3} onClick={onDownloadModalClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleDownloadConfirm}
                isLoading={isDownloading}
                loadingText="Downloading..."
                leftIcon={isDownloading ? undefined : <Download size={16} />}
                borderRadius="md"
                _hover={{
                  transform: 'translateY(-1px)',
                  boxShadow: 'sm'
                }}
              >
                Download
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
}