import axiosInstance from './axiosInstance';

export interface DonationDetails {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  receiptNumber: string;
  receiptIssuedAt: string;
  createdAt: string;
  campaignId: {
    _id: string;
    title: string;
    slug: string;
  };
}

export const donationApi = {
  getDonationDetails: async (id: string): Promise<DonationDetails> => {
    const { data } = await axiosInstance.get(`/donations/${id}`);
    return data.data;
  }
};
