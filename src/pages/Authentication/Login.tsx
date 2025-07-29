import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Input, 
  Button, 
  Card, 
  CardBody,
  Divider,
  IconButton,
  Alert,
  AlertIcon,
  Image,
} from '@chakra-ui/react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component mounts or when user starts typing
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    try {
      console.log('Submitting login form...');
      await login({ email, password });
      console.log('Login successful, user should be redirected');
      // Don't navigate here - let the useEffect handle it
    } catch (error) {
      // Error is handled by the auth context
      console.error('Login failed:', error);
    }
  };

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Card
        maxW="md"
        w="full"
        bg="white"
        borderRadius="xl"
        shadow="2xl"
        overflow="hidden"
      >
        {/* Header */}
        <Box
          bg="brand.500"
          p={6}
          textAlign="center"
        >
          <VStack spacing={4}>
            <Box
              w={16}
              h={16}
              bg="white"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              shadow="lg"
            >
              <Image src="/logo.png" alt="Claimtech" />
            </Box>
            <VStack spacing={1}>
              <Text color="white" fontSize="2xl" fontWeight="bold">
                Claimtech
              </Text>
              <Text color="white" fontSize="sm" opacity={0.9}>
                Staff Portal
              </Text>
            </VStack>
          </VStack>
        </Box>

        {/* Login Form */}
        <CardBody p={8}>
          <VStack spacing={6}>
            <VStack spacing={1} textAlign="center">
              <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                Welcome back
              </Text>
              <Text fontSize="sm" color="gray.600">
                Sign in to your account to continue
              </Text>
            </VStack>

            {/* Error Alert */}
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <Box w="full">
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  {/* Email Input */}
                  <Box w="full">
                    <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                      Email Address
                    </Text>
                    <Box position="relative">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        pl={10}
                        size="lg"
                        borderRadius="lg"
                        borderColor="gray.300"
                        _focus={{
                          borderColor: 'brand.500',
                          boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                        }}
                        isDisabled={isLoading}
                      />
                      <Box
                        position="absolute"
                        left={3}
                        top="50%"
                        transform="translateY(-50%)"
                        color="gray.400"
                      >
                        <Mail size={16} />
                      </Box>
                    </Box>
                  </Box>

                  {/* Password Input */}
                  <Box w="full">
                    <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                      Password
                    </Text>
                    <Box position="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        pl={10}
                        pr={10}
                        size="lg"
                        borderRadius="lg"
                        borderColor="gray.300"
                        _focus={{
                          borderColor: 'brand.500',
                          boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                        }}
                        isDisabled={isLoading}
                      />
                      <Box
                        position="absolute"
                        left={3}
                        top="50%"
                        transform="translateY(-50%)"
                        color="gray.400"
                      >
                        <Lock size={16} />
                      </Box>
                      <IconButton
                        position="absolute"
                        right={2}
                        top="50%"
                        transform="translateY(-50%)"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        icon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        color="gray.400"
                        _hover={{ color: 'gray.600' }}
                        isDisabled={isLoading}
                      />
                    </Box>
                  </Box>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    w="full"
                    size="lg"
                    bg="brand.500"
                    color="white"
                    _hover={{ bg: 'brand.600' }}
                    _active={{ bg: 'brand.700' }}
                    isLoading={isLoading}
                    loadingText="Signing in..."
                    borderRadius="lg"
                    fontWeight="semibold"
                    isDisabled={!email || !password}
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>
            </Box>

            {/* Security Badge */}
            <Divider />
            <HStack spacing={2} pt={2}>
              <Box
                w={5}
                h={5}
                bg="green.100"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Lock size={12} color="#38a169" />
              </Box>
              <Text fontSize="xs" color="gray.500">
                Secured with SSL encryption
              </Text>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}