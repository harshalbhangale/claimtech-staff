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
  Flex,
} from '@chakra-ui/react';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  DollarSign, 
} from 'lucide-react';
import { motion } from 'framer-motion';


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
          <Flex justify="center">
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8} maxW="1000px" w="full">
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
          </Flex>
        </Container>

    </Box>
  );
}