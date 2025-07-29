import apiClient from './config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  access_token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    username?: string;
  };
  data?: {
    token?: string;
    access_token?: string;
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
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
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get('/accounts/me/');
    return response.data;
  },
}; 