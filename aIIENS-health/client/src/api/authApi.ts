import axiosInstance from './axiosInstance';
import { AuthUser } from '@/types';
import { ApiResponse } from '@/types';

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export const authApi = {
  login: async (credentials: Record<string, string>): Promise<AuthResponse> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Login failed');
    }
    return response.data.data;
  },

  register: async (userData: Record<string, string>): Promise<{ user: AuthUser }> => {
    const response = await axiosInstance.post<ApiResponse<{ user: AuthUser }>>('/auth/register', userData);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Registration failed');
    }
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  getMe: async (): Promise<{ user: AuthUser }> => {
    const response = await axiosInstance.get<ApiResponse<{ user: AuthUser }>>('/auth/me');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch user profile');
    }
    return response.data.data;
  },

  forgotPassword: async (email: string): Promise<string> => {
    const response = await axiosInstance.post<ApiResponse<null>>('/auth/forgot-password', { email });
    return response.data.message;
  },

  resetPassword: async (data: Record<string, string>): Promise<string> => {
    const response = await axiosInstance.post<ApiResponse<null>>('/auth/reset-password', data);
    return response.data.message;
  },
};
