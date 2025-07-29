import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserDetails from './pages/UserDetails';
import Claims from './pages/Claims';
import DashboardLayout from './layouts/DashboardLayout';
import { useAuth } from './contexts/AuthContext';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  if (isLoading) {
    console.log('ProtectedRoute - showing loading state');
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute - redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute - rendering dashboard');
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Users />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/users/:userId',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <UserDetails />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/claims',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Claims />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
]);
