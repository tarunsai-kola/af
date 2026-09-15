import axiosInstance from './axiosInstance';
import { PaginatedResponse } from './adminApi';

export const bloodApi = {
  createBloodRequest: async (payload: any): Promise<any> => {
    const { data } = await axiosInstance.post('/blood-requests', payload);
    return data.data;
  },

  getBloodRequests: async (params?: { page?: number; limit?: number; status?: string; bloodGroup?: string; city?: string; urgency?: string }): Promise<PaginatedResponse<any>> => {
    const { data } = await axiosInstance.get('/blood-requests', { params });
    return { data: data.data, meta: data.meta };
  },

  getMyBloodRequests: async (): Promise<PaginatedResponse<any>> => {
    const { data } = await axiosInstance.get('/blood-requests/me');
    return { data: data.data, meta: data.meta };
  },

  getBloodRequestDetails: async (id: string): Promise<any> => {
    const { data } = await axiosInstance.get(`/blood-requests/${id}`);
    return data.data;
  },

  cancelBloodRequest: async (id: string): Promise<any> => {
    const { data } = await axiosInstance.patch(`/blood-requests/${id}/cancel`);
    return data.data;
  },
};

