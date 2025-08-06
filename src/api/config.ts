import axios , {AxiosError}from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { secureTokenStorage, csrfProtection } from '../utils/security';

// API Configuration - Use environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://preprod.theclaimpeople.com/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from secure storage
    const token = secureTokenStorage.getToken('authToken') || secureTokenStorage.getToken('access_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CSRF protection
    const csrfHeaders = csrfProtection.addCSRFHeader(config.headers as Record<string, string>);
    Object.assign(config.headers, csrfHeaders);
    
    // Add timestamp to prevent caching issues
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // If error is 401 and hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = secureTokenStorage.getToken('refresh_token');
        
        if (!refreshToken) {
          // No refresh token, redirect to login
          // window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Call your token refresh endpoint
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || ''}/auth/refresh`,
          { refresh_token: refreshToken }
        );
        
        // Store the new tokens securely
        const { access_token, refresh_token } = response.data;
        secureTokenStorage.setToken('access_token', access_token);
        secureTokenStorage.setToken('refresh_token', refresh_token);
        
        // Update Authorization header and retry request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, clear tokens and redirect to login
        secureTokenStorage.clearAllTokens();
        // window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api; 