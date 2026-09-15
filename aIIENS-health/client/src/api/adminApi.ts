import axiosInstance from './axiosInstance';
import { PatientCase } from './caseApi';

export interface AdminMetrics {
  newCases: number;
  underVerification: number;
  approvedCases: number;
  liveCampaigns: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const adminApi = {
  getMetrics: async (): Promise<AdminMetrics> => {
    const { data } = await axiosInstance.get('/admin/metrics');
    return data.data;
  },

  getCases: async (params?: { page?: number; limit?: number; status?: string }): Promise<PaginatedResponse<PatientCase>> => {
    const { data } = await axiosInstance.get('/admin/cases', { params });
    return { data: data.data, meta: data.meta };
  },

  getCaseDetails: async (id: string): Promise<PatientCase> => {
    const { data } = await axiosInstance.get(`/admin/cases/${id}`);
    return data.data;
  },

  updateVerificationGate: async (
    id: string, 
    gateId: string, 
    payload: { status: string; notes?: string; evidence?: string }
  ): Promise<PatientCase> => {
    const { data } = await axiosInstance.post(`/admin/cases/${id}/verify/${gateId}`, payload);
    return data.data;
  },

  updateBloodRequestStatus: async (
    id: string,
    status: string,
    note?: string
  ): Promise<any> => {
    const { data } = await axiosInstance.patch(`/admin/blood-requests/${id}/status`, { status, note });
    return data.data;
  }
};
