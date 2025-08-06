import apiClient from './config';
import { secureTokenStorage } from '../utils/security';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  admin_id: string;
  tokens: {
    access: string;
    refresh: string;
  };
}

export const authAPI = {
  // Login
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post('/accounts/admin/login/', credentials);
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/accounts/logout/');
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      // Clear local storage regardless of API call success
      secureTokenStorage.clearAllTokens();
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get('/accounts/me/');
    return response.data;
  },
}; 