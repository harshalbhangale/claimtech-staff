import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Grid, 
  Card, 
  CardBody,
  Button,
  IconButton,
  Avatar,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from '@chakra-ui/react';
import { 
  Folder, 
  FileText, 
  MoreVertical, 
  Grid3X3, 
  Plus,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';

export default function DashboardContent() {
  const quickAccessItems = [
    { 
      name: 'Studio Work', 
      icon: Folder, 
      size: '2.3 GB', 
      items: 23,
      color: 'blue.500'
    },
    { 
      name: 'Source', 
      icon: Folder, 
      size: '1.2 MB', 
      items: 1,
      color: 'blue.500'
    },
    { 
      name: 'Brand Assets', 
      icon: Folder, 
      size: '241 MB', 
      items: 8,
      color: 'blue.500'
    },
    { 
      name: 'Great Studios Pitch...', 
      icon: FileText, 
      size: '12.3 MB', 
      items: 'pptx',
      color: 'orange.500'
    },
  ];

  const fileItems = [
    {
      name: 'Docs',
      type: 'folder',
      sharing: 'Public',
      size: '4.5 MB',
      modified: 'Apr 10, 2022',
      users: []
    },
    {
      name: 'Fonts',
      type: 'folder',
      sharing: 'Public',
      size: '2.5 MB',
      modified: 'Apr 2, 2022',
      users: []
    },
    {
      name: 'Source',
      type: 'folder',
      sharing: 'Shared',
      size: '1.2 MB',
      modified: 'Yesterday',
      users: ['John', 'Sarah', 'Mike', 'Lisa', 'Tom', 'Emma', 'Alex', 'David']
    },
    {
      name: 'Example',
      type: 'folder',
      sharing: 'Shared',
      size: '12.2 MB',
      modified: 'Yesterday',
      users: ['John', 'Sarah']
    },
    {
      name: 'OFL.txt',
      type: 'file',
      sharing: 'Public',
      size: '4 KB',
      modified: 'Oct 12, 2021'
    },
    {
      name: 'Readme.md',
      type: 'file',
      sharing: 'Public',
      size: '2 KB',
      modified: 'Oct 12, 2021'
    },
    {
      name: 'index.html',
      type: 'file',
      sharing: 'Public',
      size: '14 KB',
      modified: 'Oct 12, 2021'
    },
  ];

  return (
    <Box flex={1} bg="gray.50" p={6}>
      <VStack spacing={6} align="stretch">
        {/* Quick Access Section */}
        <Box>
          <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
            {quickAccessItems.map((item, index) => (
              <Card key={index} cursor="pointer" _hover={{ shadow: 'md' }}>
                <CardBody p={4}>
                  <HStack spacing={3}>
                    <Box
                      w={12}
                      h={12}
                      bg={`${item.color}20`}
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <item.icon size={24} color={item.color} />
                    </Box>
                    <VStack spacing={1} align="start" flex={1}>
                      <Text fontWeight="medium" color="gray.800" fontSize="sm">
                        {item.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {item.size} • {item.items} {typeof item.items === 'number' ? 'items' : ''}
                      </Text>
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        </Box>

        {/* Files List Section */}
        <Box>
          <HStack justify="space-between" mb={4}>
            <VStack spacing={1} align="start">
              <Breadcrumb spacing="8px" separator={<ChevronRight size={12} />}>
                <BreadcrumbItem>
                  <BreadcrumbLink color="gray.600" fontSize="sm">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink color="gray.600" fontSize="sm">Concept Font</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink color="gray.800" fontSize="sm" fontWeight="medium">Maszeh</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </VStack>
            
            <HStack spacing={3}>
              <IconButton
                aria-label="Grid view"
                icon={<Grid3X3 size={16} />}
                variant="ghost"
                size="sm"
              />
              <Button
                leftIcon={<Plus size={16} />}
                colorScheme="blue"
                size="sm"
              >
                + Add New
              </Button>
            </HStack>
          </HStack>

          {/* Files Table */}
          <Card>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>
                      <HStack spacing={1}>
                        <Text>Name</Text>
                        <ArrowUpDown size={12} />
                      </HStack>
                    </Th>
                    <Th>Sharing</Th>
                    <Th>Size</Th>
                    <Th>
                      <HStack spacing={1}>
                        <Text>Modified</Text>
                        <ArrowUpDown size={12} />
                      </HStack>
                    </Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {fileItems.map((item, index) => (
                    <Tr 
                      key={index} 
                      _hover={{ bg: 'blue.50' }} 
                      cursor="pointer"
                      bg={item.name === 'Source' ? 'blue.50' : 'transparent'}
                    >
                      <Td>
                        <HStack spacing={3}>
                          <Box
                            w={8}
                            h={8}
                            bg={item.type === 'folder' ? 'blue.100' : 'gray.100'}
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            {item.type === 'folder' ? (
                              <Folder size={16} color="#3182ce" />
                            ) : item.name.includes('.html') ? (
                              <Text fontSize="xs" fontWeight="bold" color="gray.600">{'</>'}</Text>
                            ) : (
                              <FileText size={16} color="#718096" />
                            )}
                          </Box>
                          <Text fontSize="sm" fontWeight="medium">
                            {item.name}
                          </Text>
                        </HStack>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Badge
                            size="sm"
                            colorScheme={
                              item.sharing === 'Public' ? 'green' :
                              item.sharing === 'Private' ? 'red' : 'blue'
                            }
                            variant="subtle"
                          >
                            {item.sharing}
                          </Badge>
                          {item.users && item.users.length > 0 && (
                            <HStack spacing={1}>
                              {item.users.slice(0, 4).map((user, userIndex) => (
                                <Avatar
                                  key={userIndex}
                                  size="xs"
                                  name={user}
                                  src=""
                                />
                              ))}
                              {item.users.length > 4 && (
                                <Text fontSize="xs" color="gray.500">
                                  +{item.users.length - 4}
                                </Text>
                              )}
                            </HStack>
                          )}
                        </HStack>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.600">
                          {item.size}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.600">
                          {item.modified}
                        </Text>
                      </Td>
                      <Td>
                        <IconButton
                          aria-label="More options"
                          icon={<MoreVertical size={14} />}
                          variant="ghost"
                          size="sm"
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      </VStack>
    </Box>
  );
} 