import axiosInstance from './axiosInstance';
import { PaginatedResponse } from './adminApi';

export interface PublicCampaign {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  story: string;
  goal: number;
  currency: string;
  raisedAmount: number;
  donorCount: number;
  status: string;
  coverImageKey?: string;
  publishedAt?: string;
  caseId: {
    patientName: string;
    patientAge: number;
    patientGender: string;
    diagnosisCategory: string;
    diagnosisDescription: string;
    urgency: string;
    hospitalId?: {
      name: string;
      address?: string;
    };
    costBreakdown?: Array<{
      category: string;
      amount: number;
      currency: string;
    }>;
  };
}

export const campaignApi = {
  getCampaigns: async (params?: { 
    page?: number; 
    limit?: number; 
    search?: string;
    category?: string;
    urgency?: string;
  }): Promise<PaginatedResponse<PublicCampaign>> => {
    const { data } = await axiosInstance.get('/campaigns', { params });
    return { data: data.data, meta: data.meta };
  },

  getCampaignDetails: async (slug: string): Promise<PublicCampaign> => {
    const { data } = await axiosInstance.get(`/campaigns/${slug}`);
    return data.data;
  },
};
