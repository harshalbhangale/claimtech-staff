import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../api/auth';
import type { LoginCredentials, LoginResponse } from '../api/auth';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Attempting login with:', credentials);
      const response = await authAPI.login(credentials);
      console.log('Login response:', response);
      
      // Handle different possible response structures
      let token: string;
      let userData: User;
      
      if (response.token && response.user) {
        // Expected structure
        token = response.token;
        userData = response.user;
      } else if (response.access_token) {
        // Alternative structure
        token = response.access_token;
        userData = {
          id: response.user?.id || '1',
          email: credentials.email,
          name: response.user?.name || response.user?.username || 'User',
          role: response.user?.role || 'admin'
        };
      } else if (response.data) {
        // Nested structure
        token = response.data.token || response.data.access_token || '';
        userData = response.data.user || {
          id: '1',
          email: credentials.email,
          name: 'User',
          role: 'admin'
        };
      } else {
        // Fallback - create user data from credentials
        token = response.token || response.access_token || 'dummy-token';
        userData = {
          id: '1',
          email: credentials.email,
          name: credentials.email.split('@')[0],
          role: 'admin'
        };
      }
      
      console.log('Processed token:', token);
      console.log('Processed user data:', userData);
      
      // Save token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      console.log('User state updated:', userData);
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Login failed. Please try again.');
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 