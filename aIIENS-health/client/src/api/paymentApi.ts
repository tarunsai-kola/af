import axiosInstance from './axiosInstance';

export interface OrderCreationResponse {
  orderId: string;
  amount: number;
  currency: string;
  transactionId: string;
}

export interface VerificationResponse {
  donationId: string;
}

export const paymentApi = {
  createOrder: async (campaignId: string, amount: number, currency: string = 'INR'): Promise<OrderCreationResponse> => {
    const { data } = await axiosInstance.post('/payments/create', { campaignId, amount, currency });
    return data.data;
  },

  verifyPayment: async (
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
    campaignId: string,
    isAnonymous: boolean = false,
    donorMessage: string = ''
  ): Promise<VerificationResponse> => {
    const { data } = await axiosInstance.post('/payments/verify', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      campaignId,
      isAnonymous,
      donorMessage
    });
    return data.data;
  }
};
