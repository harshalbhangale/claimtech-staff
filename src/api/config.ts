import axios , {AxiosError}from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
// API Configuration
const API_BASE_URL = 'https://preprod.theclaimpeople.com/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL || import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage - try both authToken and access_token
    const token = localStorage.getItem('authToken') || localStorage.getItem('access_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('Request:', config.method?.toUpperCase(), config.url);
    console.log('Authorization header:', config.headers.Authorization ? 'Bearer [TOKEN]' : 'None');
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
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
        const refreshToken = localStorage.getItem('refresh_token');
        
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
        
        // Store the new tokens
        const { access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        
        // Update Authorization header and retry request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api; 