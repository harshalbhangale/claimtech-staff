import { 
  Box, 
  Container, 
  SimpleGrid, 
  Card, 
  CardBody, 
  HStack, 
  VStack, 
  Text, 
  Heading, 
  Badge, 
  Progress, 
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  DollarSign, 
  Plus,
  BarChart3,
  Target,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';


const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// Motion components
const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function Dashboard() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  const stats = [
    {
      label: 'Active Users',
      value: '2,847',
      change: '+12.5%',
      icon: Users,
      color: 'blue',
      progress: 75
    },
    {
      label: 'Total Claims',
      value: '1,284',
      change: '+8.2%',
      icon: FileText,
      color: 'green',
      progress: 68
    },
    {
      label: 'Resolved Claims',
      value: '876',
      change: '+15.3%',
      icon: CheckCircle,
      color: 'purple',
      progress: 82
    },
    {
      label: 'Revenue',
      value: '$2.4M',
      change: '+23.1%',
      icon: DollarSign,
      color: 'orange',
      progress: 91
    }
  ];


  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl">
        {/* Header with Animation */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          mb={8}
        >
          <VStack spacing={6} textAlign="center">
            <VStack spacing={4}>
              <Heading 
                size="2xl" 
                bgGradient="linear(to-r, blue.400, purple.500, pink.400)"
                bgClip="text"
                fontWeight="extrabold"
                mt={12}
              >
                Welcome to Claimtech Staff Portal
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Manage your claims and users efficiently with our powerful dashboard
              </Text>
            </VStack>
          </VStack>
        </MotionBox>

        {/* Stats Grid with Animations */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          {stats.map((stat, index) => (
            <MotionCard
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
              }}
              bg={cardBg}
              borderRadius="xl"
              overflow="hidden"
              position="relative"
            >
              <CardBody p={6}>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <MotionBox
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon 
                        as={stat.icon} 
                        boxSize={8} 
                        color={`${stat.color}.500`}
                      />
                    </MotionBox>
                    <Badge 
                      colorScheme={stat.color} 
                      variant="subtle"
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      {stat.change}
                    </Badge>
                  </HStack>
                  
                  <VStack spacing={1} align="start">
                    <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                      {stat.value}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {stat.label}
                    </Text>
                  </VStack>
                  
                  <Progress 
                    value={stat.progress} 
                    colorScheme={stat.color} 
                    size="sm" 
                    borderRadius="full"
                  />
                </VStack>
              </CardBody>
              
              {/* Animated background gradient */}
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg={`linear-gradient(135deg, ${stat.color}.50 0%, transparent 100%)`}
                opacity={0.1}
                zIndex={0}
              />
            </MotionCard>
          ))}
        </SimpleGrid>

        {/* Quick Actions */}
        <MotionBox
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          mb={8}
        >
          <Card bg={cardBg} borderRadius="xl" p={6}>
            <VStack spacing={4} align="stretch">
              <Heading size="md" color={textColor}>
                Quick Actions
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                {[
                  { icon: Plus, label: 'New Claim', color: 'blue', description: 'Create a new claim' },
                  { icon: Users, label: 'Add User', color: 'green', description: 'Register new user' },
                  { icon: FileText, label: 'View Reports', color: 'purple', description: 'Analytics & insights' }
                ].map((action, _index) => (
                  <MotionBox
                    key={action.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      bg={`${action.color}.50`}
                      border={`1px solid`}
                      borderColor={`${action.color}.200`}
                      borderRadius="lg"
                      p={4}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{
                        bg: `${action.color}.100`,
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg'
                      }}
                    >
                      <VStack spacing={3} align="start">
                        <HStack spacing={3}>
                          <Icon 
                            as={action.icon} 
                            boxSize={5} 
                            color={`${action.color}.500`}
                          />
                          <Text fontWeight="medium" color={`${action.color}.700`}>
                            {action.label}
                          </Text>
                        </HStack>
                        <Text fontSize="xs" color={`${action.color}.600`}>
                          {action.description}
                        </Text>
                      </VStack>
                    </Card>
                  </MotionBox>
                ))}
              </SimpleGrid>
            </VStack>
          </Card>
        </MotionBox>
      </Container>
    </Box>
  );
}