import api from './config';

// Status types
export type StatusType = 'claim' | 'agreement';

export interface StatusOption {
  value: string;
  label: string;
}

export interface StatusUpdateRequest {
  type: StatusType;
  status: string;
  claim_id?: string;
  agreement_id?: string;
}

export interface StatusUpdateResponse {
  success: boolean;
  message: string;
}

// Status API functions
export const statusAPI = {
  // Get available statuses for a specific type
  getStatuses: async (type: StatusType): Promise<StatusOption[]> => {
    try {
      const response = await api.get(`/staff-portal/claims/status/?type=${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${type} statuses:`, error);
      throw error;
    }
  },

  // Update status for a claim or agreement
  updateStatus: async (data: StatusUpdateRequest): Promise<StatusUpdateResponse> => {
    try {
      const response = await api.post('/staff-portal/claims/status/', data);
      return response.data;
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  }
};

export default statusAPI;