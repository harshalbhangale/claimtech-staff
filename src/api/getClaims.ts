import apiClient from './config';

export interface Claim {
  id: string;
  status: string;
  lender: string;
  created_at: string;
  updated_at: string;
  agreements: any[];
  lender_name?: string;
  // Additional fields that might be available
  claim_number?: string;
  customer_name?: string;
  customer_email?: string;
  amount?: number;
  priority?: string;
  type?: string;
  submitted_date?: string;
  assigned_to?: string;
  description?: string;
  documents_count?: number;
}

export interface ClaimsResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: Claim[];
  // Handle case where response is directly an array
  length?: number;
}

export interface ClaimsParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  priority?: string;
  type?: string;
  ordering?: string;
}

export const claimsAPI = {
  // Get all claims with pagination and filters
  getClaims: async (params: ClaimsParams = {}): Promise<ClaimsResponse> => {
    const response = await apiClient.get('/staff-portal/claims/', { params });
    
    // Handle different response structures
    if (Array.isArray(response.data)) {
      // If response is directly an array
      return {
        count: response.data.length,
        results: response.data,
        next: null,
        previous: null
      };
    } else {
      // If response has pagination structure
      return response.data;
    }
  },

  // Get single claim by ID
  getClaim: async (id: string): Promise<Claim> => {
    const response = await apiClient.get(`/staff-portal/claims/${id}/`);
    return response.data;
  },

  // Create new claim
  createClaim: async (claimData: Partial<Claim>): Promise<Claim> => {
    const response = await apiClient.post('/staff-portal/claims/', claimData);
    return response.data;
  },

  // Update claim
  updateClaim: async (id: string, claimData: Partial<Claim>): Promise<Claim> => {
    const response = await apiClient.put(`/staff-portal/claims/${id}/`, claimData);
    return response.data;
  },

  // Delete claim
  deleteClaim: async (id: string): Promise<void> => {
    await apiClient.delete(`/staff-portal/claims/${id}/`);
  },

  // Update claim status
  updateClaimStatus: async (id: string, status: string): Promise<Claim> => {
    const response = await apiClient.patch(`/staff-portal/claims/${id}/`, { status });
    return response.data;
  },
};
