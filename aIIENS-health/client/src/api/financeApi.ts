import axiosInstance from './axiosInstance';
import { PaginatedResponse } from './adminApi';

export interface FinanceMetrics {
  totalDonations: number;
  todayDonations: number;
  pendingReconciliation: number;
  failedPayments: number;
  refunds: number;
  pendingSettlements: number;
  completedSettlements: number;
}

export const financeApi = {
  getMetrics: async (): Promise<FinanceMetrics> => {
    const { data } = await axiosInstance.get('/admin/finance/metrics');
    return data.data;
  },

  getDonations: async (params?: { page?: number; limit?: number; status?: string }): Promise<PaginatedResponse<any>> => {
    const { data } = await axiosInstance.get('/admin/finance/donations', { params });
    return { data: data.data, meta: data.meta };
  },

  getSettlements: async (params?: { page?: number; limit?: number; status?: string }): Promise<PaginatedResponse<any>> => {
    const { data } = await axiosInstance.get('/admin/finance/settlements', { params });
    return { data: data.data, meta: data.meta };
  },

  updateSettlementStatus: async (
    id: string, 
    payload: { status: string; rejectionReason?: string; paymentReference?: string; notes?: string }
  ): Promise<any> => {
    const { data } = await axiosInstance.post(`/admin/finance/settlements/${id}/update-status`, payload);
    return data.data;
  },

  getReconciliationReport: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/admin/finance/reconciliation');
    return data.data;
  }
};
