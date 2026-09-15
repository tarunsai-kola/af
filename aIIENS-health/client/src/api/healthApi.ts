import axiosInstance from './axiosInstance';
import { ApiSuccessResponse } from '@/types';

export interface HealthData {
  status: string;
  timestamp: string;
  environment: string;
  version: string;
}

/**
 * Ping the /api/health endpoint to verify server connectivity.
 */
export async function getHealthStatus(): Promise<ApiSuccessResponse<HealthData>> {
  const response = await axiosInstance.get<ApiSuccessResponse<HealthData>>('/health');
  return response.data;
}
