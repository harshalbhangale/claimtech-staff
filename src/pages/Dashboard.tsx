import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Button,
  IconButton,
  Avatar,
  Badge,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
} from '@chakra-ui/react';
import { Filter, Calendar, MoreVertical, Plus } from 'lucide-react';
import { useState } from 'react';


const claims = [
  {
    id: '1',
    title: 'Windshield replacement for Tesla Model 3',
    status: 'Draft',
    customer: 'John Smith',
    start: 'Apr 10, 2023',
    updated: 'Apr 10, 2023',
    avatars: ['J', 'S'],
    type: 'Auto',
  },
  {
    id: '2',
    title: 'Water damage claim for apartment',
    status: 'In Progress',
    customer: 'Maria Garcia',
    start: 'Jul 1, 2023',
    end: 'Aug 1, 2023',
    updated: 'July 10, 2023',
    avatars: ['M', 'G'],
    type: 'Home',
  },
  {
    id: '3',
    title: 'Medical expense reimbursement',
    status: 'In Progress',
    customer: 'David Chen',
    start: 'Jul 1, 2023',
    end: 'Sep 30, 2023',
    updated: 'July 10, 2023',
    avatars: ['D', 'C'],
    type: 'Health',
  },
  {
    id: '4',
    title: 'Life insurance payout',
    status: 'Archived',
    customer: 'Emily Davis',
    start: 'Jun 1, 2023',
    end: 'Jun 11, 2023',
    updated: 'Apr 10, 2023',
    avatars: ['E', 'D'],
    type: 'Life',
  },
  {
    id: '5',
    title: 'Auto accident claim',
    status: 'Draft',
    customer: 'Robert Johnson',
    start: 'Apr 10, 2023',
    updated: 'Apr 10, 2023',
    avatars: ['R', 'J'],
    type: 'Auto',
  },
];

const statusTabs = [
  { label: 'Draft', value: 'Draft' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Archived', value: 'Archived' },
];

export default function Dashboard() {
  const [tab, setTab] = useState(0);

  // Group claims by status
  const groupedClaims = statusTabs.map((tab) => ({
    ...tab,
    claims: claims.filter((c) => c.status === tab.value),
  }));

  return (
    <Box p={8} bg="#fafbfc" minH="100vh">
      {/* Topbar */}
      <HStack justify="space-between" mb={8}>
        <VStack align="start" spacing={0}>
          <Text fontSize="sm" color="gray.500" fontWeight="medium">
            Claims / Analytics
          </Text>
        </VStack>
        <HStack spacing={3}>
          <Input
            placeholder="Search"
            size="md"
            bg="white"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
            maxW="300px"
            pl={10}
            _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #a18cd1' }}
          />
          <Button leftIcon={<Calendar size={16} />} variant="outline" size="md" borderRadius="lg">
            Select Dates
          </Button>
          <Button leftIcon={<Filter size={16} />} variant="outline" size="md" borderRadius="lg">
            Filter
          </Button>
        </HStack>
      </HStack>

      {/* Analytics Section */}
      <VStack align="start" spacing={8} mb={8}>
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
          Your total revenue
        </Text>
        <Text fontSize="4xl" fontWeight="bold" bgGradient="linear(to-r, #a18cd1, #fbc2eb)" bgClip="text">
          $90,239.00
        </Text>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} w="full">
          {/* Stat Cards */}
          <Card>
            <CardBody>
              <Text fontSize="md" color="gray.500">New subscriptions</Text>
              <HStack spacing={2} align="end">
                <Text fontSize="2xl" fontWeight="bold" color="green.600">22</Text>
                <Text fontSize="sm" color="green.500">+15%</Text>
              </HStack>
              <Text fontSize="xs" color="gray.400">compared to last week</Text>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Text fontSize="md" color="gray.500">New claims</Text>
              <HStack spacing={2} align="end">
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">320</Text>
                <Text fontSize="sm" color="orange.500">-4%</Text>
              </HStack>
              <Text fontSize="xs" color="gray.400">compared to last week</Text>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Text fontSize="md" color="gray.500">Avg. claim value</Text>
              <HStack spacing={2} align="end">
                <Text fontSize="2xl" fontWeight="bold" color="purple.500">$1,080</Text>
                <Text fontSize="sm" color="green.500">+8%</Text>
              </HStack>
              <Text fontSize="xs" color="gray.400">compared to last week</Text>
            </CardBody>
          </Card>
        </Grid>
      </VStack>

      {/* Recent Claims Section */}
      <Box>
        <HStack justify="space-between" mb={4}>
          <Text fontSize="xl" fontWeight="bold" color="gray.800">
            Recent claims
          </Text>
          <Button leftIcon={<Plus size={16} />} colorScheme="blue" size="sm">
            Add claim
          </Button>
        </HStack>
        <Tabs index={tab} onChange={setTab} variant="unstyled">
          <TabList mb={4}>
            {groupedClaims.map((group, idx) => (
              <Tab
                key={group.value}
                fontWeight="medium"
                color={tab === idx ? 'blue.600' : 'gray.500'}
                borderBottom={tab === idx ? '2px solid #3182ce' : 'none'}
                mr={4}
                _selected={{ color: 'blue.600' }}
              >
                {group.label} <Badge ml={2} colorScheme="gray">{group.claims.length}</Badge>
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {groupedClaims.map((group) => (
              <TabPanel key={group.value} px={0}>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                  {group.claims.map((claim) => (
                    <Card key={claim.id} p={0} borderRadius="xl" boxShadow="sm" _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }} transition="all 0.2s">
                      <CardBody>
                        <HStack justify="space-between" mb={2}>
                          <HStack spacing={2}>
                            <Avatar size="sm" name={claim.customer} />
                            <Text fontWeight="medium" color="gray.800">{claim.customer}</Text>
                          </HStack>
                          <Menu>
                            <MenuButton as={IconButton} icon={<MoreVertical size={16} />} variant="ghost" size="sm" />
                            <MenuList>
                              <MenuItem>Edit</MenuItem>
                              <MenuItem>Archive</MenuItem>
                              <MenuItem color="red.500">Delete</MenuItem>
                            </MenuList>
                          </Menu>
                        </HStack>
                        <Text fontSize="md" fontWeight="bold" color="gray.900" mb={1}>
                          {claim.title}
                        </Text>
                        <Text fontSize="xs" color="gray.500" mb={2}>
                          Start: {claim.start} {claim.end && `- Ends: ${claim.end}`}
                        </Text>
                        <HStack spacing={2} mb={2}>
                          <Badge colorScheme={claim.status === 'Draft' ? 'gray' : claim.status === 'In Progress' ? 'blue' : 'green'} variant="subtle">
                            {claim.status}
                          </Badge>
                          <Badge colorScheme={claim.type === 'Auto' ? 'blue' : claim.type === 'Home' ? 'orange' : claim.type === 'Health' ? 'purple' : 'green'} variant="subtle">
                            {claim.type}
                          </Badge>
                        </HStack>
                        <HStack spacing={-2} mb={2}>
                          {claim.avatars.map((a, idx) => (
                            <Avatar key={idx} size="xs" name={a} />
                          ))}
                        </HStack>
                        <Text fontSize="xs" color="gray.400">
                          Last updated: {claim.updated}
                        </Text>
                      </CardBody>
                    </Card>
                  ))}
                  {group.claims.length === 0 && (
                    <Text color="gray.400" fontSize="sm" gridColumn="1/-1">No claims in this status.</Text>
                  )}
                </Grid>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}