import apiClient from './config';
import { useQuery } from '@tanstack/react-query';

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
  address?: Address;
  previous_addresses?: Address[];
  id_document?: string;
  is_enabled?: boolean;
  is_verified?: boolean;
}

export interface Address {
  address_line_1: string;
  address_line_2: string;
  address_line_3: string;
  address_line_4: string;
  address_line_5: string;
  city: string;
  postcode: string;
  country: string;
  region: string;
  beureau_id: string;
  is_current: boolean;
  created_at?: string;
}

export interface Claim {
  id: string;
  status: string;
  lender: string;
  created_at: string;
  updated_at: string;
  agreements: Agreement[];
  lender_name: string;
}

export interface Agreement {
  id: string;
  claim_id: string;
  lender_name: string;
  agreement_number: string;
  vehicle_registration?: string;
  agreement_document_url?: string;
  start_date?: string;
  created_at: string;
  updated_at: string;
  status?: string;
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
    address?: Address;
    previous_addresses?: Address[];
    id_document?: string;
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
  limit?: number;
  offset?: number;
  search?: string;
  ordering?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  date_joined_after?: string;
  date_joined_before?: string;
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

// Custom hook for fetching users with TanStack Query
export const useUsers = (params: UsersParams = {}) => {
  const hasSearch = !!params.search || !!params.email || !!params.first_name || !!params.last_name;
  
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersAPI.getUsers(params),
    staleTime: hasSearch ? 30 * 1000 : 2 * 60 * 1000, // 30 seconds for search, 2 minutes for normal
    gcTime: hasSearch ? 2 * 60 * 1000 : 5 * 60 * 1000, // 2 minutes for search, 5 minutes for normal
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// Custom hook for fetching single user with TanStack Query
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersAPI.getUser(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Custom hook for fetching user details with claims count
export const useUserWithClaims = (id: string) => {
  return useQuery({
    queryKey: ['user-with-claims', id],
    queryFn: async () => {
      const userDetails = await usersAPI.getUser(id);
      return {
        ...userDetails.user,
        claimsCount: userDetails.claims?.length || 0,
        claims: userDetails.claims || []
      };
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
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