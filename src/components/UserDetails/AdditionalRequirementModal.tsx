import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Textarea,
    VStack,
    Text,
    Spinner,
    Box,
    FormControl,
    FormLabel,
    useToast,
    HStack,
    Icon,
    Badge,
    Divider,
    Alert,
    AlertIcon,
    useColorModeValue,
    Collapse,
    useDisclosure,
    Avatar,
    Card,
    CardBody,
    IconButton,
    Tooltip
  } from '@chakra-ui/react';
  import { 
    FileText, 
    Send, 
    History, 
    ChevronDown, 
    ChevronUp,
    CheckCircle,
    Clock,
    XCircle,
    Download,
    User
  } from 'lucide-react';
  import { useState, useEffect } from 'react';
  import { requirementsAPI, type RequirementItem } from '../../api/requirements';
  
  interface RequirementRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    claimId: string;
    claimLenderName?: string;
  }
  
  export function RequirementRequestModal({ 
    isOpen, 
    onClose, 
    claimId, 
    claimLenderName 
  }: RequirementRequestModalProps) {
    const [requirements, setRequirements] = useState<RequirementItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [requirementReason, setRequirementReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { isOpen: isHistoryOpen, onToggle: onHistoryToggle } = useDisclosure();
    const toast = useToast();
  
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const historyBg = useColorModeValue('gray.50', 'gray.700');
  
    // Fetch requirements history with proper error handling
    const fetchRequirements = async (showSpinner = true) => {
      if (!claimId) return;
      
      try {
        if (showSpinner) setLoading(true);
        setError(null);
        
        const data = await requirementsAPI.getClaimRequirements(claimId);
        
        // **FIX: Ensure data is always an array**
        if (Array.isArray(data)) {
          setRequirements(data);
        } else {
          console.warn('API returned non-array data:', data);
          setRequirements([]); // Fallback to empty array
          setError('Invalid data format received from server');
        }
      } catch (err: any) {
        console.error('Failed to fetch requirements:', err);
        setError(err.message);
        setRequirements([]); // **FIX: Always ensure requirements is an array on error**
        
        toast({
          title: 'Failed to Load History',
          description: err.message,
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      } finally {
        if (showSpinner) setLoading(false);
      }
    };
  
    // Reset state when modal closes
    useEffect(() => {
      if (!isOpen) {
        setRequirements([]);
        setRequirementReason('');
        setError(null);
        setLoading(false);
        setSubmitting(false);
      }
    }, [isOpen]);
  
    // Load requirements when modal opens
    useEffect(() => {
      if (isOpen && claimId) {
        fetchRequirements();
      }
    }, [isOpen, claimId]);
  
    // Handle requirement submission with proper error handling
    const handleSubmit = async () => {
      if (!requirementReason.trim()) {
        toast({
          title: 'Requirement Needed',
          description: 'Please enter a requirement reason',
          status: 'warning',
          duration: 2000,
          isClosable: true
        });
        return;
      }
  
      try {
        setSubmitting(true);
        setError(null);
        
        const updatedRequirements = await requirementsAPI.createRequirement(claimId, {
          requirement_reason: requirementReason.trim()
        });
        
        // **FIX: Ensure response is always an array**
        if (Array.isArray(updatedRequirements)) {
          setRequirements(updatedRequirements);
        } else {
          console.warn('Create requirement API returned non-array data:', updatedRequirements);
          // Refresh the requirements list manually
          await fetchRequirements(false);
        }
        
        setRequirementReason('');
        
        toast({
          title: 'Requirement Submitted',
          description: 'User has been notified of the new requirement',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
      } catch (err: any) {
        console.error('Failed to create requirement:', err);
        setError(err.message);
        toast({
          title: 'Submission Failed',
          description: err.message,
          status: 'error',
          duration: 4000,
          isClosable: true
        });
      } finally {
        setSubmitting(false);
      }
    };
  
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'completed': return 'green';
        case 'pending': return 'yellow';
        case 'rejected': return 'red';
        default: return 'gray';
      }
    };
  
    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'completed': return CheckCircle;
        case 'pending': return Clock;
        case 'rejected': return XCircle;
        default: return FileText;
      }
    };
    
    const safeRequirements = Array.isArray(requirements) ? requirements : [];
  
    return (
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        size="xl" 
        scrollBehavior="inside"
        motionPreset="slideInBottom"
      >
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg={bgColor} borderRadius="2xl" boxShadow="2xl">
          <ModalHeader borderBottomWidth="1px" borderColor={borderColor} pb={4}>
            <HStack spacing={3}>
              <Avatar size="sm" bg="purple.500" icon={<User size={16} />} />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold" fontSize="lg">Request User Information</Text>
                <Text fontSize="sm" color="gray.500" fontWeight="normal">
                  {claimLenderName} • {claimId}
                </Text>
              </VStack>
            </HStack>
          </ModalHeader>
          
          <ModalCloseButton />
          
          <ModalBody py={6}>
            <VStack align="stretch" spacing={6}>
              {/* Error Alert */}
              {error && (
                <Alert status="error" borderRadius="lg">
                  <AlertIcon />
                  <Text fontSize="sm">{error}</Text>
                </Alert>
              )}
  
              {/* New Requirement Form */}
              <Box>
                <FormControl>
                  <FormLabel fontWeight="semibold" color={textColor}>
                    <HStack spacing={2}>
                      <Icon as={FileText} boxSize={4} />
                      <Text>New Requirement</Text>
                    </HStack>
                  </FormLabel>
                  <Textarea
                    placeholder="Describe the information or document needed from the user..."
                    value={requirementReason}
                    onChange={(e) => setRequirementReason(e.target.value)}
                    rows={3}
                    bg={useColorModeValue('white', 'gray.700')}
                    border="1px solid"
                    borderColor={borderColor}
                    _focus={{
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)'
                    }}
                  />
                </FormControl>
                
                <HStack justify="space-between" mt={4}>
                  <Button
                    variant="outline"
                    leftIcon={<History size={16} />}
                    rightIcon={isHistoryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    onClick={onHistoryToggle}
                    size="sm"
                  >
                    Requirements History ({safeRequirements.length})
                  </Button>
                  
                  <Button
                    colorScheme="blue"
                    leftIcon={<Send size={16} />}
                    onClick={handleSubmit}
                    isLoading={submitting}
                    loadingText="Sending..."
                    isDisabled={!requirementReason.trim()}
                  >
                    Send Requirement
                  </Button>
                </HStack>
              </Box>
  
              <Divider />
  
              {/* Requirements History */}
              <Collapse in={isHistoryOpen} animateOpacity>
                <VStack align="stretch" spacing={4}>
                  <Text fontWeight="semibold" color={textColor}>
                    Requirements History
                  </Text>
                  
                  {loading ? (
                    <HStack justify="center" py={8}>
                      <Spinner size="md" color="blue.500" />
                      <Text color="gray.500">Loading history...</Text>
                    </HStack>
                  ) : safeRequirements.length === 0 ? (
                    <Box 
                      textAlign="center" 
                      py={8} 
                      bg={historyBg} 
                      borderRadius="lg"
                      border="1px solid"
                      borderColor={borderColor}
                    >
                      <Icon as={FileText} boxSize={8} color="gray.400" mb={2} />
                      <Text color="gray.500" fontWeight="medium">No Requirements Yet</Text>
                      <Text color="gray.400" fontSize="sm">
                        This claim has no information requests
                      </Text>
                    </Box>
                  ) : (
                    <VStack spacing={3} align="stretch" maxH="300px" overflowY="auto">
                      {safeRequirements.map((req) => (
                        <Card
                          key={req.id}
                          bg={useColorModeValue('white', 'gray.700')}
                          border="1px solid"
                          borderColor={borderColor}
                          borderRadius="lg"
                          _hover={{ shadow: 'md' }}
                        >
                          <CardBody p={4}>
                            <VStack align="stretch" spacing={3}>
                              <HStack justify="space-between" align="start">
                                <VStack align="start" spacing={1} flex="1">
                                  <Text fontWeight="medium" color={textColor} fontSize="sm">
                                    {req.requirement_reason}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    {new Date(req.created_at).toLocaleString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </Text>
                                </VStack>
                                
                                <VStack align="end" spacing={2}>
                                  <Badge
                                    colorScheme={getStatusColor(req.status)}
                                    variant="solid"
                                    fontSize="xs"
                                    px={2}
                                    py={1}
                                    borderRadius="md"
                                    textTransform="capitalize"
                                  >
                                    <HStack spacing={1}>
                                      <Icon as={getStatusIcon(req.status)} boxSize={3} />
                                      <Text>{req.status}</Text>
                                    </HStack>
                                  </Badge>
                                  
                                  {req.document && (
                                    <Tooltip label="View submitted document">
                                      <IconButton
                                        aria-label="View document"
                                        icon={<Download size={14} />}
                                        size="xs"
                                        colorScheme="blue"
                                        variant="outline"
                                        onClick={() => window.open(req.document!, '_blank')}
                                      />
                                    </Tooltip>
                                  )}
                                </VStack>
                              </HStack>
                              
                              {req.rejected_reason && (
                                <Alert status="error" borderRadius="md" py={2}>
                                  <AlertIcon boxSize={4} />
                                  <Text fontSize="xs">
                                    Rejected: {req.rejected_reason}
                                  </Text>
                                </Alert>
                              )}
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </VStack>
                  )}
                </VStack>
              </Collapse>
            </VStack>
          </ModalBody>
          
          <ModalFooter borderTopWidth="1px" borderColor={borderColor} pt={4}>
            <Button variant="ghost" onClick={onClose} mr={3}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  