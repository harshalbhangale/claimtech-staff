import { Box, useBreakpointValue } from '@chakra-ui/react';
import Navbar from '@/components/Dashboard/Navbar';
import Sidebar from '@/components/Dashboard/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // Responsive values for different screen sizes
  const sidebarWidth = useBreakpointValue({ base: '0px', md: '280px' });
  const contentMarginLeft = useBreakpointValue({ base: '0px', md: '280px' });
  const contentPadding = useBreakpointValue({ base: 4, md: 6 });
  const navbarHeight = useBreakpointValue({ base: '64px', md: '72px' });
  
  return (
    <Box minH="100vh">
      {/* Fixed Navbar */}
      <Box 
        position="fixed" 
        top={0} 
        left={0} 
        right={0} 
        zIndex={1000}
        height={navbarHeight}
      >
        <Navbar />
      </Box>
      
      {/* Fixed Sidebar - Hidden on mobile */}
      <Box 
        position="fixed" 
        top={navbarHeight}
        left={0} 
        bottom={0} 
        zIndex={999}
        width={sidebarWidth}
        display={{ base: 'none', md: 'block' }}
      >
        <Sidebar />
      </Box>
      
      {/* Main Content with responsive spacing */}
      <Box 
        ml={contentMarginLeft}
        mt={navbarHeight}
        p={contentPadding}
        minH={`calc(100vh - ${navbarHeight})`}
        w={{ base: '100%', md: `calc(100% - ${sidebarWidth})` }}
      >
        {children}
      </Box>
    </Box>
  );
} 