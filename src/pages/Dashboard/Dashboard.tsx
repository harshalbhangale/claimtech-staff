import { 
  Box, 
  Container, 
  VStack, 
  Text, 
  Heading, 
  useColorModeValue,
  Image,
  HStack,
} from '@chakra-ui/react';

export default function Dashboard() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box bg={bgColor} minH="100vh" w="100%">
      <Container maxW="container.xl">
        {/* Header */}
        <Box mb={12} pt={16}>
          <VStack spacing={8} textAlign="center">
            <HStack justify="center" spacing={4}>
              <Box
                boxSize={{ base: "64px", md: "80px" }}
                borderRadius="full"
                overflow="hidden"
                boxShadow="lg"
                bg="white"
                p={2}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src="/logo.png"
                  alt="Claimtech Logo"
                  boxSize={{ base: "48px", md: "64px" }}
                  objectFit="contain"
                  fallbackSrc="https://via.placeholder.com/64x64?text=Logo"
                />
              </Box>
            </HStack>
            <VStack spacing={4}>
              <Heading 
                size="2xl" 
                bgGradient="linear(to-r, blue.400, purple.500, pink.400)"
                bgClip="text"
                fontWeight="extrabold"
                letterSpacing="tight"
                lineHeight="1.1"
              >
                Welcome to Claimtech Staff Portal
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto">
                Manage your claims and users efficiently with our powerful dashboard
              </Text>
            </VStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}