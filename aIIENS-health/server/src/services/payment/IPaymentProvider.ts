export interface OrderCreationResult {
  providerOrderId: string;
  amount: number;
  currency: string;
  metadata?: any;
}

export interface PaymentVerificationPayload {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  [key: string]: any;
}

export interface IPaymentProvider {
  /**
   * Creates an order with the payment provider.
   * @param amount Amount in the smallest currency unit (e.g. paisa for INR)
   * @param currency Currency code (e.g. 'INR')
   * @param receipt Optional receipt string for reconciliation
   */
  createOrder(amount: number, currency: string, receipt?: string): Promise<OrderCreationResult>;

  /**
   * Verifies the payment signature synchronously returned to the client.
   * @param payload The payload received from the client SDK (e.g. razorpay signature, payment id, order id)
   */
  verifyPayment(payload: PaymentVerificationPayload): boolean;

  /**
   * Verifies the webhook signature sent asynchronously by the provider to the server.
   * @param rawBody The raw body string of the request
   * @param signature The signature header from the provider
   * @param secret The webhook secret expected
   */
  verifyWebhookSignature(rawBody: string, signature: string, secret: string): boolean;
}
