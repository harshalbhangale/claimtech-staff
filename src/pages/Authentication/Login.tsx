import { useState, useEffect, useRef } from 'react';
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
  Collapse,
} from '@chakra-ui/react';
import { Eye, EyeOff, Lock, Mail, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});
  const [showBackendError, setShowBackendError] = useState(false); // Controls visibility of backend error alert

  // Ref for password input to restore focus after toggling visibility
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear validation errors and backend error when component mounts or when user starts typing
  useEffect(() => {
    clearError();
    setValidationErrors({});
    setShowBackendError(false);
  }, [clearError]);

  // Show backend error alert when a backend error occurs
  useEffect(() => {
    if (error) {
      setShowBackendError(true);
    }
  }, [error]);

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    const newValidationErrors: { email?: string; password?: string } = {};
    if (emailError) newValidationErrors.email = emailError;
    if (passwordError) newValidationErrors.password = passwordError;

    setValidationErrors(newValidationErrors);

    if (Object.keys(newValidationErrors).length > 0) {
      setShowBackendError(false); // Hide backend error if client-side validation fails
      return;
    }

    try {
      console.log('Submitting login form...');
      // Clear any previous backend error before new attempt
      clearError();
      setShowBackendError(false);

      await login({ email, password });
      console.log('Login successful, user should be redirected');
      // Don't navigate here - let the useEffect handle it
    } catch (err) {
      // Error is handled by the auth context and will trigger useEffect for setShowBackendError
      console.error('Login failed:', err);
    }
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    // Clear validation errors for the field as user types
    setValidationErrors(prev => ({ ...prev, [field]: undefined }));

    if (field === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }

    // Hide backend error message when user starts typing
    if (error && showBackendError) {
      setShowBackendError(false);
      clearError();
    }
  };

  const getErrorMessage = (backendError: string): string => {
    const errorMap: { [key: string]: string } = {
      'Invalid credentials': 'Incorrect email or password. Please try again.',
      'User not found': 'No account found with this email address.',
      'Invalid password': 'Incorrect password. Please check your password and try again.',
      'Account locked': 'Your account has been temporarily locked. Please contact support.',
      'Too many attempts': 'Too many login attempts. Please try again later.',
      'Network error': 'Connection error. Please check your internet connection.',
      'Server error': 'Server is temporarily unavailable. Please try again.',
      'Unauthorized': 'Access denied. Please check your credentials.',
      'Forbidden': 'Access denied. Please contact your administrator.',
      'Request failed with status code 401': 'Incorrect email or password. Please try again.',
      '401': 'Incorrect email or password. Please try again.',
    };

    if (errorMap[backendError]) {
      return errorMap[backendError];
    }

    const lowerError = backendError.toLowerCase();
    if (lowerError.includes('401') || (lowerError.includes('invalid') && lowerError.includes('credential'))) {
      return 'Incorrect email or password. Please try again.';
    }
    if (lowerError.includes('403') || lowerError.includes('forbidden')) {
      return 'Access denied. Please contact your administrator.';
    }
    if (lowerError.includes('404') || lowerError.includes('not found')) {
      return 'Service not found or user not found. Please verify details.';
    }
    if (lowerError.includes('500') || lowerError.includes('server') || lowerError.includes('unavailable')) {
      return 'Server is temporarily unavailable. Please try again.';
    }
    if (lowerError.includes('network') || lowerError.includes('connection')) {
      return 'Connection error. Please check your internet connection.';
    }

    return 'Login failed. Please check your credentials and try again.';
  };

  // Determine if specific input fields should be highlighted due to backend error
  const shouldHighlightForBackendError = (_field: 'email' | 'password') => {
    const commonAuthErrors = ['401', 'unauthorized', 'invalid credentials', 'user not found', 'invalid password', 'forbidden'];
    const backendErrorString = error?.toLowerCase() || '';

    return showBackendError && commonAuthErrors.some(err => backendErrorString.includes(err));
  };

  // Toggle password visibility and restore focus to password input
  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
    // Restore focus after toggling, with a slight delay to ensure input type changes
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 0);
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

            {/* Error Alert with Toggle */}
            {error && (
              <Collapse in={showBackendError} animateOpacity>
                <Alert
                  status="error"
                  borderRadius="md"
                  position="relative"
                  bg="red.50"
                  border="1px solid"
                  borderColor="red.200"
                  boxShadow="sm"
                >
                  <AlertIcon color="red.500" />
                  <Box flex="1">
                    <VStack align="start" spacing={1}>
                      <Text color="red.700" fontSize="sm" fontWeight="semibold">
                        {getErrorMessage(error)}
                      </Text>
                      {shouldHighlightForBackendError('email') ? ( // Show tip only for specific authentication errors
                        <Text color="red.600" fontSize="xs">
                          💡 Tip: Double-check your email and password. Passwords are case-sensitive.
                        </Text>
                      ) : null}
                    </VStack>
                  </Box>
                  <IconButton
                    aria-label="Close error message"
                    icon={<X size={14} />}
                    size="sm"
                    variant="ghost"
                    color="red.500"
                    _hover={{ bg: 'red.100' }}
                    onClick={() => setShowBackendError(false)}
                    position="absolute"
                    right={2}
                    top={2}
                  />
                </Alert>
              </Collapse>
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
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onBlur={() => setValidationErrors(prev => ({ ...prev, email: validateEmail(email) }))} // Validate on blur
                        pl={10}
                        size="lg"
                        borderRadius="lg"
                        borderColor={
                          validationErrors.email || shouldHighlightForBackendError('email')
                            ? 'red.300'
                            : email ? 'green.300' : 'gray.300' // Green if valid and filled, gray otherwise
                        }
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
                        color={
                          validationErrors.email || shouldHighlightForBackendError('email')
                            ? 'red.400'
                            : email ? 'green.400' : 'gray.400'
                        }
                      >
                        <Mail size={16} />
                      </Box>
                      {validationErrors.email && (
                        <Text fontSize="xs" color="red.500" mt={1}>
                          {validationErrors.email}
                        </Text>
                      )}
                    </Box>
                  </Box>

                  {/* Password Input */}
                  <Box w="full">
                    <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                      Password
                    </Text>
                    <Box position="relative">
                      <Input
                        ref={passwordInputRef}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        onBlur={() => setValidationErrors(prev => ({ ...prev, password: validatePassword(password) }))} // Validate on blur
                        pl={10}
                        pr={10}
                        size="lg"
                        borderRadius="lg"
                        borderColor={
                          validationErrors.password || shouldHighlightForBackendError('password')
                            ? 'red.300'
                            : password ? 'green.300' : 'gray.300'
                        }
                        _focus={{
                          borderColor: 'brand.500',
                          boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                        }}
                        isDisabled={isLoading}
                        autoComplete="current-password"
                      />
                      <Box
                        position="absolute"
                        left={3}
                        top="50%"
                        transform="translateY(-50%)"
                        color={
                          validationErrors.password || shouldHighlightForBackendError('password')
                            ? 'red.400'
                            : password ? 'green.400' : 'gray.400'
                        }
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
                        onClick={handleTogglePassword}
                        color="gray.400"
                        _hover={{ color: 'gray.600' }}
                        isDisabled={isLoading}
                        tabIndex={-1}
                        type="button"
                      />
                      {validationErrors.password && (
                        <Text fontSize="xs" color="red.500" mt={1}>
                          {validationErrors.password}
                        </Text>
                      )}
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