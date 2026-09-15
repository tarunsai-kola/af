import axiosInstance from './axiosInstance';

export const impactApi = {
  getImpactSummary: async (force: boolean = false): Promise<any[]> => {
    const { data } = await axiosInstance.get('/impact/summary', { params: { force } });
    return data.data;
  },

  getImpactInspection: async (metricId: string): Promise<any> => {
    const { data } = await axiosInstance.get('/impact/inspect', { params: { metricId } });
    return data.data;
  }
};
