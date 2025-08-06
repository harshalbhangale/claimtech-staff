import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../api/auth';
import type { LoginCredentials, LoginResponse } from '../api/auth';
import { secureTokenStorage, loginRateLimiter, sanitizeInput, isValidEmail } from '../utils/security';

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
      const token = secureTokenStorage.getToken('authToken') || secureTokenStorage.getToken('access_token');
      const savedUser = secureTokenStorage.getToken('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          secureTokenStorage.clearAllTokens();
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
      
      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(credentials.email);
      const sanitizedPassword = sanitizeInput(credentials.password);
      
      // Validate email
      if (!isValidEmail(sanitizedEmail)) {
        throw new Error('Invalid email format');
      }
      
      const response: LoginResponse = await authAPI.login({ 
        email: sanitizedEmail, 
        password: sanitizedPassword 
      });
      
      // Handle the actual response structure
      const token = response.tokens?.access;
      const refreshToken = response.tokens?.refresh;
      
      if (!token) {
        throw new Error('No access token received from server');
      }
      
      const userData: User = {
        id: response.admin_id || '1',
        email: sanitizedEmail,
        name: sanitizedEmail.split('@')[0],
        role: 'admin'
      };
      
      // Save tokens and user data securely
      secureTokenStorage.setToken('authToken', token);
      secureTokenStorage.setToken('access_token', token);
      secureTokenStorage.setToken('refresh_token', refreshToken || '');
      secureTokenStorage.setToken('user', JSON.stringify(userData));
      
      setUser(userData);
      
    } catch (error: any) {
      // Record failed attempt for rate limiting
      if (credentials.email) {
        loginRateLimiter.recordAttempt(credentials.email);
      }
      
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
      // Continue with logout even if API call fails
    } finally {
      // Clear all tokens and user data securely
      secureTokenStorage.clearAllTokens();
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