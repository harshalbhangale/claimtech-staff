import { Box} from '@chakra-ui/react';
import Navbar from '@/components/Dashboard/Navbar';
import Sidebar from '@/components/Dashboard/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Box minH="100vh">
      {/* Fixed Navbar */}
      <Box position="fixed" top={0} left={0} right={0} zIndex={1000}>
        <Navbar />
      </Box>
      
      {/* Fixed Sidebar */}
      <Box position="fixed" top="60px" left={0} bottom={0} zIndex={999}>
        <Sidebar />
      </Box>
      
      {/* Main Content with proper spacing */}
      <Box ml="250px" mt="60px" p={6}>
        {children}
      </Box>
    </Box>
  );
} 