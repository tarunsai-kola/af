import axiosInstance from './axiosInstance';
import { PaginatedResponse } from './adminApi';

export const auditApi = {
  getAuditLogs: async (params?: { 
    page?: number; 
    limit?: number; 
    actor?: string; 
    action?: string; 
    objectType?: string; 
    objectId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<any>> => {
    const { data } = await axiosInstance.get('/admin/audit', { params });
    return { data: data.data, meta: data.meta };
  }
};
