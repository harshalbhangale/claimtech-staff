import { Box, HStack } from '@chakra-ui/react';
import Navbar from '../components/Dashboard/Navbar';
import Sidebar from '../components/Dashboard/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <HStack spacing={0} align="start">
        <Sidebar />
        <Box flex={1}>
          {children}
        </Box>
      </HStack>
    </Box>
  );
} 