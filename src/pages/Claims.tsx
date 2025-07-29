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
  Input,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Select,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
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
  FormControl,
  FormLabel,
  Textarea,
  Switch
} from '@chakra-ui/react';
import { 
  Search, 
  Plus, 
  MoreVertical,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  FileText,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface Claim {
  id: string;
  claimNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'auto' | 'home' | 'health' | 'life';
  submittedDate: string;
  assignedTo: string;
  description: string;
  documents: number;
}

export default function Claims() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const claims: Claim[] = [
    {
      id: '1',
      claimNumber: 'CLM-2024-001',
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      amount: 2500,
      status: 'pending',
      priority: 'high',
      type: 'auto',
      submittedDate: '2024-01-15',
      assignedTo: 'Sarah Wilson',
      description: 'Vehicle damage from collision on highway',
      documents: 3
    },
    {
      id: '2',
      claimNumber: 'CLM-2024-002',
      customerName: 'Maria Garcia',
      customerEmail: 'maria.garcia@email.com',
      amount: 15000,
      status: 'approved',
      priority: 'urgent',
      type: 'home',
      submittedDate: '2024-01-14',
      assignedTo: 'Mike Johnson',
      description: 'Water damage from burst pipe',
      documents: 5
    },
    {
      id: '3',
      claimNumber: 'CLM-2024-003',
      customerName: 'David Chen',
      customerEmail: 'david.chen@email.com',
      amount: 800,
      status: 'processing',
      priority: 'medium',
      type: 'health',
      submittedDate: '2024-01-13',
      assignedTo: 'Lisa Brown',
      description: 'Medical expenses for emergency visit',
      documents: 2
    },
    {
      id: '4',
      claimNumber: 'CLM-2024-004',
      customerName: 'Emily Davis',
      customerEmail: 'emily.davis@email.com',
      amount: 50000,
      status: 'rejected',
      priority: 'low',
      type: 'life',
      submittedDate: '2024-01-12',
      assignedTo: 'Tom Wilson',
      description: 'Life insurance claim for policyholder',
      documents: 8
    },
    {
      id: '5',
      claimNumber: 'CLM-2024-005',
      customerName: 'Robert Johnson',
      customerEmail: 'robert.johnson@email.com',
      amount: 3200,
      status: 'pending',
      priority: 'high',
      type: 'auto',
      submittedDate: '2024-01-11',
      assignedTo: 'Sarah Wilson',
      description: 'Windshield replacement due to hail damage',
      documents: 4
    }
  ];

  const filteredClaims = claims.filter(claim => {
    if (statusFilter !== 'all' && claim.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && claim.priority !== priorityFilter) return false;
    return true;
  });

  const stats = [
    { label: 'Total Claims', value: claims.length, color: 'blue.500' },
    { label: 'Pending', value: claims.filter(c => c.status === 'pending').length, color: 'orange.500' },
    { label: 'Approved', value: claims.filter(c => c.status === 'approved').length, color: 'green.500' },
    { label: 'Processing', value: claims.filter(c => c.status === 'processing').length, color: 'purple.500' },
  ];

  const totalAmount = claims.reduce((sum, claim) => sum + claim.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'processing': return 'purple';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const handleClaimClick = (claim: Claim) => {
    setSelectedClaim(claim);
    onOpen();
  };

  return (
    <Box p={6}>
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
            
            <Button
              leftIcon={<Plus size={16} />}
              colorScheme="blue"
              size="sm"
            >
              New Claim
            </Button>
          </HStack>

          {/* Stats Grid */}
          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4} mb={6}>
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardBody>
                  <Stat>
                    <StatLabel color="gray.600">{stat.label}</StatLabel>
                    <StatNumber color={stat.color}>{stat.value}</StatNumber>
                    <StatHelpText>
                      {stat.label === 'Total Claims' && `$${totalAmount.toLocaleString()} total value`}
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            ))}
          </Grid>
        </Box>

        {/* Filters and Search */}
        <Card>
          <CardBody>
            <HStack spacing={4} wrap="wrap">
              {/* Search */}
              <Box position="relative" minW="300px">
                <Input
                  placeholder="Search claims..."
                  bg="white"
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="lg"
                  pl={10}
                  pr={4}
                  py={2}
                  fontSize="sm"
                  _focus={{
                    borderColor: 'blue.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
                  }}
                />
                <Box
                  position="absolute"
                  left={3}
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.400"
                >
                  <Search size={16} />
                </Box>
              </Box>

              {/* Status Filter */}
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                size="sm"
                minW="150px"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Select>

              {/* Priority Filter */}
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                size="sm"
                minW="150px"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>

              <Button
                leftIcon={<Download size={16} />}
                variant="outline"
                size="sm"
              >
                Export
              </Button>
            </HStack>
          </CardBody>
        </Card>

        {/* Claims Table */}
        <Card>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Claim Number</Th>
                  <Th>Customer</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                  <Th>Priority</Th>
                  <Th>Type</Th>
                  <Th>Assigned To</Th>
                  <Th>Submitted</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredClaims.map((claim) => (
                  <Tr 
                    key={claim.id} 
                    _hover={{ bg: 'blue.50' }} 
                    cursor="pointer"
                    onClick={() => handleClaimClick(claim)}
                  >
                    <Td>
                      <Text fontSize="sm" fontWeight="medium" color="blue.600">
                        {claim.claimNumber}
                      </Text>
                    </Td>
                    <Td>
                      <VStack spacing={0} align="start">
                        <Text fontSize="sm" fontWeight="medium">
                          {claim.customerName}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {claim.customerEmail}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <Text fontSize="sm" fontWeight="medium" color="green.600">
                        ${claim.amount.toLocaleString()}
                      </Text>
                    </Td>
                    <Td>
                      <Badge
                        size="sm"
                        colorScheme={getStatusColor(claim.status)}
                        variant="subtle"
                      >
                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge
                        size="sm"
                        colorScheme={getPriorityColor(claim.priority)}
                        variant="subtle"
                      >
                        {claim.priority.charAt(0).toUpperCase() + claim.priority.slice(1)}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge
                        size="sm"
                        colorScheme="blue"
                        variant="subtle"
                      >
                        {claim.type.charAt(0).toUpperCase() + claim.type.slice(1)}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Avatar size="xs" name={claim.assignedTo} src="" />
                        <Text fontSize="sm">{claim.assignedTo}</Text>
                      </HStack>
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="gray.600">
                        {new Date(claim.submittedDate).toLocaleDateString()}
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
                          <MenuItem icon={<Eye size={14} />}>View Details</MenuItem>
                          <MenuItem icon={<Edit size={14} />}>Edit Claim</MenuItem>
                          <MenuItem icon={<Download size={14} />}>Download</MenuItem>
                          <MenuItem icon={<Trash2 size={14} />} color="red.500">Delete</MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
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
                        {selectedClaim.claimNumber}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {selectedClaim.customerName}
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
                          ${selectedClaim.amount.toLocaleString()}
                        </Text>
                      </HStack>
                      
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.500">Type</Text>
                        <Badge colorScheme="blue" variant="subtle">
                          {selectedClaim.type.charAt(0).toUpperCase() + selectedClaim.type.slice(1)}
                        </Badge>
                      </HStack>
                      
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.500">Priority</Text>
                        <Badge
                          colorScheme={getPriorityColor(selectedClaim.priority)}
                          variant="subtle"
                        >
                          {selectedClaim.priority.charAt(0).toUpperCase() + selectedClaim.priority.slice(1)}
                        </Badge>
                      </HStack>
                      
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.500">Documents</Text>
                        <Text fontSize="sm">{selectedClaim.documents} files</Text>
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
                        {selectedClaim.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Actions */}
                <HStack spacing={3}>
                  <Button leftIcon={<Edit size={16} />} colorScheme="blue" size="sm">
                    Edit Claim
                  </Button>
                  <Button leftIcon={<CheckCircle size={16} />} colorScheme="green" size="sm">
                    Approve
                  </Button>
                  <Button leftIcon={<AlertCircle size={16} />} colorScheme="red" size="sm">
                    Reject
                  </Button>
                </HStack>
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
} 