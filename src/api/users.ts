import apiClient from './config';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  phone_number?: string;
  mobile?: string;
  mobile_number?: string;
  date_of_birth: string;
  age?: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  role?: string;
}

export interface Claim {
  id: string;
  status: string;
  lender: string;
  created_at: string;
  updated_at: string;
  agreements: any[];
  lender_name: string;
}

export interface UserDetailsResponse {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    date_of_birth: string;
    is_enabled: boolean;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
  };
  claims: Claim[];
}

export interface UsersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

export interface UsersParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}

export const usersAPI = {
  // Get all users with pagination
  getUsers: async (params: UsersParams = {}): Promise<UsersResponse> => {
    const response = await apiClient.get('/staff-portal/users/', { params });
    return response.data;
  },

  // Get single user by ID
  getUser: async (id: string): Promise<UserDetailsResponse> => {
    const response = await apiClient.get(`/staff-portal/users/${id}/`);
    return response.data;
  },

  // Create new user
  createUser: async (userData: Partial<User>): Promise<User> => {
    const response = await apiClient.post('/staff-portal/users/', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put(`/staff-portal/users/${id}/`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/staff-portal/users/${id}/`);
  },
};

// Claims and Lenders API
export interface Lender {
  id: string;
  name: string;
  uuid: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface ClaimResponse {
  id: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'processing';
  lender: string;
  lender_name: string;
  created_at: string;
  updated_at: string;
  agreements: any[];
}

export interface CreateClaimsRequest {
  lenders: string[];
}

export const claimsAPI = {
  // Get all lenders
  getLenders: async (): Promise<Lender[]> => {
    const response = await apiClient.get('/staff-portal/lenders/');
    return response.data;
  },

  // Create new claims for specified lenders
  createClaims: async (data: CreateClaimsRequest): Promise<ClaimResponse[]> => {
    const response = await apiClient.post('/claims/', data);
    return response.data;
  },

  // Get all claims
  getClaims: async (): Promise<ClaimResponse[]> => {
    const response = await apiClient.get('/claims/');
    return response.data;
  },

  // Get single claim by ID
  getClaim: async (id: string): Promise<ClaimResponse> => {
    const response = await apiClient.get(`/claims/${id}/`);
    return response.data;
  },
}; 