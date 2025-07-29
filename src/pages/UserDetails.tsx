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
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { 
  ArrowLeft, 
  Edit, 
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  MapPin
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  avatar: string;
  department: string;
  location: string;
  joinDate: string;
  lastActive: string;
  claimsProcessed: number;
  claimsPending: number;
  claimsCompleted: number;
}

export default function UserDetails() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock user data - in real app, fetch from API
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@claimtech.io',
      phone: '+1 (555) 123-4567',
      role: 'Admin',
      status: 'Active',
      avatar: '',
      department: 'Claims Management',
      location: 'New York, NY',
      joinDate: 'Jan 15, 2023',
      lastActive: '2 hours ago',
      claimsProcessed: 156,
      claimsPending: 8,
      claimsCompleted: 148
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@claimtech.io',
      phone: '+1 (555) 234-5678',
      role: 'Manager',
      status: 'Active',
      avatar: '',
      department: 'Claims Management',
      location: 'Los Angeles, CA',
      joinDate: 'Mar 22, 2023',
      lastActive: '1 hour ago',
      claimsProcessed: 89,
      claimsPending: 3,
      claimsCompleted: 86
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@claimtech.io',
      phone: '+1 (555) 345-6789',
      role: 'Staff',
      status: 'Inactive',
      avatar: '',
      department: 'Claims Processing',
      location: 'Chicago, IL',
      joinDate: 'Jun 10, 2023',
      lastActive: '3 days ago',
      claimsProcessed: 45,
      claimsPending: 0,
      claimsCompleted: 45
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundUser = mockUsers.find(u => u.id === userId);
      setUser(foundUser || null);
      setLoading(false);
    }, 500);
  }, [userId]);

  if (loading) {
    return (
      <Box p={6}>
        <Text>Loading user details...</Text>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={6}>
        <Text>User not found</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <HStack justify="space-between" mb={4}>
            <HStack spacing={4}>
              <IconButton
                aria-label="Go back"
                icon={<ArrowLeft size={20} />}
                variant="ghost"
                onClick={() => navigate('/users')}
              />
              <VStack spacing={1} align="start">
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                  {user.name}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  User ID: {user.id}
                </Text>
              </VStack>
            </HStack>
            
            <HStack spacing={3}>
              <Button
                leftIcon={<Edit size={16} />}
                variant="outline"
                size="sm"
              >
                Edit User
              </Button>
              <IconButton
                aria-label="More options"
                icon={<MoreVertical size={16} />}
                variant="ghost"
                size="sm"
              />
            </HStack>
          </HStack>
        </Box>

        {/* User Info Card */}
        <Card>
          <CardBody p={6}>
            <HStack spacing={6} align="start">
              <Avatar size="xl" name={user.name} src={user.avatar} />
              
              <VStack spacing={4} align="start" flex={1}>
                <HStack spacing={6}>
                  <VStack spacing={1} align="start">
                    <Text fontSize="sm" color="gray.500">Email</Text>
                    <HStack spacing={2}>
                      <Mail size={16} color="gray.400" />
                      <Text fontSize="sm">{user.email}</Text>
                    </HStack>
                  </VStack>
                  
                  <VStack spacing={1} align="start">
                    <Text fontSize="sm" color="gray.500">Phone</Text>
                    <HStack spacing={2}>
                      <Phone size={16} color="gray.400" />
                      <Text fontSize="sm">{user.phone}</Text>
                    </HStack>
                  </VStack>
                  
                  <VStack spacing={1} align="start">
                    <Text fontSize="sm" color="gray.500">Location</Text>
                    <HStack spacing={2}>
                      <MapPin size={16} color="gray.400" />
                      <Text fontSize="sm">{user.location}</Text>
                    </HStack>
                  </VStack>
                </HStack>

                <HStack spacing={6}>
                  <VStack spacing={1} align="start">
                    <Text fontSize="sm" color="gray.500">Role</Text>
                    <Badge
                      colorScheme={
                        user.role === 'Admin' ? 'red' :
                        user.role === 'Manager' ? 'blue' : 'gray'
                      }
                      variant="subtle"
                    >
                      {user.role}
                    </Badge>
                  </VStack>
                  
                  <VStack spacing={1} align="start">
                    <Text fontSize="sm" color="gray.500">Status</Text>
                    <Badge
                      colorScheme={user.status === 'Active' ? 'green' : 'gray'}
                      variant="subtle"
                    >
                      {user.status}
                    </Badge>
                  </VStack>
                  
                  <VStack spacing={1} align="start">
                    <Text fontSize="sm" color="gray.500">Department</Text>
                    <Text fontSize="sm">{user.department}</Text>
                  </VStack>
                  
                  <VStack spacing={1} align="start">
                    <Text fontSize="sm" color="gray.500">Join Date</Text>
                    <HStack spacing={2}>
                      <Calendar size={16} color="gray.400" />
                      <Text fontSize="sm">{user.joinDate}</Text>
                    </HStack>
                  </VStack>
                </HStack>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        {/* Stats Grid */}
        <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Claims Processed</StatLabel>
                <StatNumber>{user.claimsProcessed}</StatNumber>
                <StatHelpText>Total claims handled</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Pending Claims</StatLabel>
                <StatNumber>{user.claimsPending}</StatNumber>
                <StatHelpText>Currently in progress</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Completed Claims</StatLabel>
                <StatNumber>{user.claimsCompleted}</StatNumber>
                <StatHelpText>Successfully processed</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Last Active</StatLabel>
                <StatNumber fontSize="lg">{user.lastActive}</StatNumber>
                <StatHelpText>Recent activity</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </Grid>

        {/* Tabs */}
        <Card>
          <CardBody p={0}>
            <Tabs variant="enclosed">
              <TabList>
                <Tab>Activity</Tab>
                <Tab>Claims</Tab>
                <Tab>Settings</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <Text fontSize="sm" color="gray.600">
                      Recent activity will be displayed here...
                    </Text>
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <Text fontSize="sm" color="gray.600">
                      User's claims history will be displayed here...
                    </Text>
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <Text fontSize="sm" color="gray.600">
                      User settings and permissions will be displayed here...
                    </Text>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
} 