import { 
  Box, 
  Container, 
  VStack, 
  HStack, 
  Text, 
  Input, 
  Button, 
  Card, 
  CardBody, 
  Avatar, 
  Badge, 
  SimpleGrid,
  Heading,
  Icon,
  useColorModeValue,
  Select,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Divider,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { 
  Search, 
  Filter, 
  Users, 
  FileText, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail,
  Eye,
  Edit,
  MoreVertical,
  Star,
  CheckCircle,
  Clock,
  TrendingUp,
  X,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Animation keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Motion components
const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface SearchResult {
  id: string;
  type: 'user' | 'claim';
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  status: string;
  date: string;
  avatar?: string;
  claimNumber?: string;
  amount?: number;
  priority?: string;
  description?: string;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'user',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      status: 'active',
      date: '2024-01-15',
      avatar: ''
    },
    {
      id: '2',
      type: 'claim',
      name: 'Sarah Wilson',
      claimNumber: 'CLM-2024-001',
      amount: 2500,
      priority: 'high',
      status: 'pending',
      date: '2024-01-14',
      description: 'Vehicle damage from collision'
    },
    {
      id: '3',
      type: 'user',
      name: 'Michael Johnson',
      email: 'michael.j@email.com',
      phone: '+1 (555) 987-6543',
      location: 'Los Angeles, CA',
      status: 'inactive',
      date: '2024-01-10',
      avatar: ''
    },
    {
      id: '4',
      type: 'claim',
      name: 'Emily Davis',
      claimNumber: 'CLM-2024-002',
      amount: 1800,
      priority: 'medium',
      status: 'approved',
      date: '2024-01-13',
      description: 'Home insurance claim'
    },
    {
      id: '5',
      type: 'user',
      name: 'David Brown',
      email: 'david.brown@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Chicago, IL',
      status: 'active',
      date: '2024-01-12',
      avatar: ''
    }
  ];

  const handleSearch = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const filtered = mockResults.filter(result => {
        const matchesQuery = result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           result.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           result.claimNumber?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = filterType === 'all' || result.type === filterType;
        const matchesStatus = filterStatus === 'all' || result.status === filterStatus;
        
        return matchesQuery && matchesType && matchesStatus;
      });
      setResults(filtered);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    } else {
      setResults([]);
    }
  }, [searchQuery, filterType, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'inactive':
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const SearchResultCard = ({ result }: { result: SearchResult }) => (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      bg={cardBg}
      borderRadius="xl"
      overflow="hidden"
      shadow="sm"
      _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
    >
      <CardBody p={6}>
        <VStack spacing={4} align="stretch">
          {/* Header */}
          <HStack justify="space-between">
            <HStack spacing={3}>
              <Avatar 
                size="md" 
                name={result.name} 
                src={result.avatar}
                bg={result.type === 'user' ? 'blue.500' : 'purple.500'}
              />
              <VStack spacing={1} align="start">
                <Text fontWeight="semibold" color={textColor}>
                  {result.name}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {result.type === 'user' ? 'User' : `Claim: ${result.claimNumber}`}
                </Text>
              </VStack>
            </HStack>
            <Badge 
              colorScheme={getStatusColor(result.status)} 
              variant="subtle"
              px={2}
              py={1}
              borderRadius="full"
            >
              {result.status}
            </Badge>
          </HStack>

          {/* Details */}
          <VStack spacing={2} align="stretch">
            {result.type === 'user' ? (
              <>
                <HStack spacing={2}>
                  <Icon as={Mail} boxSize={4} color="gray.400" />
                  <Text fontSize="sm" color="gray.600">
                    {result.email}
                  </Text>
                </HStack>
                <HStack spacing={2}>
                  <Icon as={Phone} boxSize={4} color="gray.400" />
                  <Text fontSize="sm" color="gray.600">
                    {result.phone}
                  </Text>
                </HStack>
                <HStack spacing={2}>
                  <Icon as={MapPin} boxSize={4} color="gray.400" />
                  <Text fontSize="sm" color="gray.600">
                    {result.location}
                  </Text>
                </HStack>
              </>
            ) : (
              <>
                <HStack spacing={2}>
                  <Icon as={DollarSign} boxSize={4} color="gray.400" />
                  <Text fontSize="sm" color="gray.600">
                    Amount: ${result.amount?.toLocaleString()}
                  </Text>
                </HStack>
                <HStack spacing={2}>
                  <Icon as={AlertCircle} boxSize={4} color="gray.400" />
                  <Text fontSize="sm" color="gray.600">
                    Priority: 
                    <Badge 
                      colorScheme={getPriorityColor(result.priority || '')} 
                      ml={2}
                      variant="subtle"
                    >
                      {result.priority}
                    </Badge>
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600" noOfLines={2}>
                  {result.description}
                </Text>
              </>
            )}
          </VStack>

          {/* Footer */}
          <HStack justify="space-between" pt={2}>
            <HStack spacing={2}>
              <Icon as={Calendar} boxSize={4} color="gray.400" />
              <Text fontSize="xs" color="gray.500">
                {new Date(result.date).toLocaleDateString()}
              </Text>
            </HStack>
            <HStack spacing={2}>
              <Button size="sm" variant="ghost" color="blue.500">
                <Icon as={Eye} boxSize={4} />
              </Button>
              <Button size="sm" variant="ghost" color="gray.500">
                <Icon as={Edit} boxSize={4} />
              </Button>
              <Button size="sm" variant="ghost" color="gray.500">
                <Icon as={MoreVertical} boxSize={4} />
              </Button>
            </HStack>
          </HStack>
        </VStack>
      </CardBody>
    </MotionCard>
  );

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl">
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          mb={8}
        >
          <VStack spacing={4} textAlign="center">
            <Heading 
              size="xl" 
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
              fontWeight="bold"
            >
              Search Users & Claims
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Find users, claims, and information quickly with our powerful search
            </Text>
          </VStack>
        </MotionBox>

        {/* Search Bar */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          mb={6}
        >
          <Card bg={cardBg} borderRadius="xl" p={6} shadow="sm">
            <VStack spacing={4}>
              {/* Main Search Input */}
              <InputGroup size="lg">
                <InputLeftElement>
                  <Icon as={Search} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search by name, email, claim number, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  borderRadius="lg"
                  fontSize="md"
                  _focus={{
                    borderColor: 'blue.400',
                    boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
                  }}
                />
                <InputRightElement>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowFilters(!showFilters)}
                    color="gray.500"
                    _hover={{ color: 'blue.500' }}
                  >
                    <Icon as={Filter} boxSize={5} />
                  </Button>
                </InputRightElement>
              </InputGroup>

              {/* Filters */}
              {showFilters && (
                <MotionBox
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  w="full"
                >
                  <HStack spacing={4} w="full">
                    <Select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      borderRadius="lg"
                      size="md"
                    >
                      <option value="all">All Types</option>
                      <option value="user">Users Only</option>
                      <option value="claim">Claims Only</option>
                    </Select>
                    <Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      borderRadius="lg"
                      size="md"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </Select>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setFilterType('all');
                        setFilterStatus('all');
                        setSearchQuery('');
                      }}
                      leftIcon={<Icon as={X} />}
                      size="md"
                    >
                      Clear
                    </Button>
                  </HStack>
                </MotionBox>
              )}
            </VStack>
          </Card>
        </MotionBox>

        {/* Results */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isLoading ? (
            <Card bg={cardBg} borderRadius="xl" p={8}>
              <VStack spacing={4}>
                <Spinner size="lg" color="blue.500" />
                <Text color="gray.600">Searching...</Text>
              </VStack>
            </Card>
          ) : searchQuery ? (
            results.length > 0 ? (
              <>
                <HStack justify="space-between" mb={6}>
                  <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                    Found {results.length} result{results.length !== 1 ? 's' : ''}
                  </Text>
                  <Badge colorScheme="blue" variant="subtle">
                    {filterType !== 'all' && `${filterType}s`} {filterStatus !== 'all' && filterStatus}
                  </Badge>
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {results.map((result) => (
                    <SearchResultCard key={result.id} result={result} />
                  ))}
                </SimpleGrid>
              </>
            ) : (
              <Card bg={cardBg} borderRadius="xl" p={8}>
                <VStack spacing={4}>
                  <Icon as={Search} boxSize={12} color="gray.400" />
                  <VStack spacing={2}>
                    <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                      No results found
                    </Text>
                    <Text color="gray.600" textAlign="center">
                      Try adjusting your search terms or filters
                    </Text>
                  </VStack>
                </VStack>
              </Card>
            )
          ) : (
            <Card bg={cardBg} borderRadius="xl" p={8}>
              <VStack spacing={6}>
                <Icon as={Search} boxSize={16} color="blue.400" />
                <VStack spacing={2}>
                  <Text fontSize="xl" fontWeight="semibold" color={textColor}>
                    Start Searching
                  </Text>
                  <Text color="gray.600" textAlign="center" maxW="md">
                    Enter a name, email, claim number, or description to find users and claims
                  </Text>
                </VStack>
                <HStack spacing={4} pt={4}>
                  <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
                    <HStack spacing={1}>
                      <Icon as={Users} boxSize={3} />
                      <Text fontSize="xs">Users</Text>
                    </HStack>
                  </Badge>
                  <Badge colorScheme="purple" variant="subtle" px={3} py={1}>
                    <HStack spacing={1}>
                      <Icon as={FileText} boxSize={3} />
                      <Text fontSize="xs">Claims</Text>
                    </HStack>
                  </Badge>
                  <Badge colorScheme="green" variant="subtle" px={3} py={1}>
                    <HStack spacing={1}>
                      <Icon as={TrendingUp} boxSize={3} />
                      <Text fontSize="xs">Analytics</Text>
                    </HStack>
                  </Badge>
                </HStack>
              </VStack>
            </Card>
          )}
        </MotionBox>
      </Container>
    </Box>
  );
} 