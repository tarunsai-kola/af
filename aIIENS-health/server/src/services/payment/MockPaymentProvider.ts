import { IPaymentProvider, OrderCreationResult, PaymentVerificationPayload } from './IPaymentProvider';

export class MockPaymentProvider implements IPaymentProvider {
  async createOrder(amount: number, currency: string, receipt?: string): Promise<OrderCreationResult> {
    const mockOrderId = `mock_order_${Math.random().toString(36).substring(7)}_${Date.now()}`;
    
    return {
      providerOrderId: mockOrderId,
      amount,
      currency,
      metadata: { status: 'created', isMock: true, receipt }
    };
  }

  verifyPayment(payload: PaymentVerificationPayload): boolean {
    // In mock mode, we always assume successful verification if they pass a mock ID
    if (payload.razorpay_order_id?.startsWith('mock_order_') && payload.razorpay_signature === 'mock_signature') {
      return true;
    }
    return false;
  }

  verifyWebhookSignature(_rawBody: string, _signature: string, _secret: string): boolean {
    return true; // Simplified for mock
  }
}
