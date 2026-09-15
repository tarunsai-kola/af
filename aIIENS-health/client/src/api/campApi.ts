import axiosInstance from './axiosInstance';
import { PaginatedResponse } from './adminApi';

export const campApi = {
  createCamp: async (payload: any): Promise<any> => {
    const { data } = await axiosInstance.post('/camps', payload);
    return data.data;
  },

  updateCamp: async (id: string, payload: any): Promise<any> => {
    const { data } = await axiosInstance.patch(`/camps/${id}`, payload);
    return data.data;
  },

  getPublicCamps: async (params?: { page?: number; limit?: number; city?: string; service?: string; status?: string }): Promise<PaginatedResponse<any>> => {
    const { data } = await axiosInstance.get('/camps', { params });
    return { data: data.data, meta: data.meta };
  },

  getCampDetails: async (id: string): Promise<any> => {
    const { data } = await axiosInstance.get(`/camps/${id}`);
    return data.data;
  },

  registerForCamp: async (id: string, payload: any): Promise<any> => {
    const { data } = await axiosInstance.post(`/camps/${id}/register`, payload);
    return data.data;
  },

  // Admin APIs
  getAllCampsAdmin: async (params?: { page?: number; limit?: number; status?: string }): Promise<PaginatedResponse<any>> => {
    const { data } = await axiosInstance.get('/admin/camps', { params });
    return { data: data.data, meta: data.meta };
  },

  verifyCampStatus: async (id: string, payload: { status: string; notes?: string }): Promise<any> => {
    const { data } = await axiosInstance.patch(`/admin/camps/${id}/verify`, payload);
    return data.data;
  }
};
