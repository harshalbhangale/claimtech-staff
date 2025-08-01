import apiClient from './config';

export interface RequirementItem {
  id: string;
  claim: string;
  requirement_reason: string;
  status: 'pending' | 'completed' | 'rejected';
  rejected_reason: string | null;
  document: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateRequirementRequest {
  requirement_reason: string;
}

export const requirementsAPI = {
  // GET requirements for a claim
  getClaimRequirements: async (claimId: string): Promise<RequirementItem[]> => {
    try {
      const response = await apiClient.get(
        `/staff-portal/claims/${claimId}/requirements/`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Failed to fetch requirements'
      );
    }
  },

  // POST new requirement for a claim
  createRequirement: async (
    claimId: string,
    request: CreateRequirementRequest
  ): Promise<RequirementItem[]> => {
    try {
      const response = await apiClient.post(
        `/staff-portal/claims/${claimId}/requirements/`,
        request
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Failed to create requirement'
      );
    }
  }
};
