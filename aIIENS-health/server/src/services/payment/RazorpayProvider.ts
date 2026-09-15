import Razorpay from 'razorpay';
import crypto from 'crypto';
import { IPaymentProvider, OrderCreationResult, PaymentVerificationPayload } from './IPaymentProvider';

export class RazorpayProvider implements IPaymentProvider {
  private instance: any;

  constructor() {
    this.instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
    });
  }

  async createOrder(amount: number, currency: string, receipt?: string): Promise<OrderCreationResult> {
    const options = {
      amount,
      currency,
      receipt,
    };
    
    // PERMANENT SOLUTION: If we are using dummy keys (local MVP), mock the Razorpay API response
    // instead of actually calling Razorpay (which would fail with 401 Authentication Failed).
    const keyId = process.env.RAZORPAY_KEY_ID || 'dummy_key_id';
    if (keyId === 'dummy_key_id') {
      const mockOrderId = `order_mock_${Date.now()}`;
      return {
        providerOrderId: mockOrderId,
        amount: options.amount,
        currency: options.currency,
        metadata: { id: mockOrderId, entity: "order", amount: options.amount, currency: options.currency, receipt: options.receipt, status: "created", notes: [] }
      };
    }
    
    const order = await this.instance.orders.create(options);
    
    return {
      providerOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      metadata: order
    };
  }

  verifyPayment(payload: PaymentVerificationPayload): boolean {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payload;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return false;
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret';
    
    // PERMANENT SOLUTION: If we are using dummy keys (local MVP), mock the Razorpay API verification
    if (secret === 'dummy_key_secret' && razorpay_order_id.startsWith('order_mock_')) {
      return true;
    }
    
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', secret).update(body.toString()).digest('hex');
    
    return expectedSignature === razorpay_signature;
  }

  verifyWebhookSignature(rawBody: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    return expectedSignature === signature;
  }
}
