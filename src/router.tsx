import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/Authentication/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import UsersList from './pages/Dashboard/UsersList';
import UserDetails from './pages/Dashboard/UserDetails';
import Claims from './pages/Dashboard/Claims';
import SearchPage from './pages/Dashboard/Search';
import DashboardLayout from './components/dashboard/DashboardLayout';
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
          <UsersList />
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
  {
    path: '/search',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <SearchPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
]);
