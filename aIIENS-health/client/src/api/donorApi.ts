import axiosInstance from './axiosInstance';
import { PaginatedResponse } from './adminApi';

export const donorApi = {
  registerDonor: async (payload: any): Promise<any> => {
    const { data } = await axiosInstance.post('/donors', payload);
    return data.data;
  },

  getMyDonorProfile: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/donors/me');
    return data.data;
  },

  updateAvailability: async (availability: 'available' | 'unavailable' | 'cooldown'): Promise<any> => {
    const { data } = await axiosInstance.patch('/donors/availability', { availability });
    return data.data;
  },

  searchDonors: async (params?: { page?: number; limit?: number; bloodGroup?: string; pincode?: string; city?: string }): Promise<PaginatedResponse<any>> => {
    const { data } = await axiosInstance.get('/donors/search', { params });
    return { data: data.data, meta: data.meta };
  }
};
