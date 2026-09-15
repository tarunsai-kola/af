import axiosInstance from './axiosInstance';

export interface FamilyMember {
  _id: string;
  userId: string;
  name: string;
  email?: string;
  phone: string;
  dateOfBirth: string;
  bloodGroup?: string;
  relation: string;
  createdAt: string;
  updatedAt: string;
}

export const familyApi = {
  getMyFamilyMembers: async (): Promise<FamilyMember[]> => {
    const { data } = await axiosInstance.get('/family-members');
    return data.data;
  },

  createFamilyMember: async (payload: Omit<FamilyMember, '_id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<FamilyMember> => {
    const { data } = await axiosInstance.post('/family-members', payload);
    return data.data;
  },

  updateFamilyMember: async (id: string, payload: Partial<Omit<FamilyMember, '_id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<FamilyMember> => {
    const { data } = await axiosInstance.put(`/family-members/${id}`, payload);
    return data.data;
  },

  deleteFamilyMember: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/family-members/${id}`);
  },
};
