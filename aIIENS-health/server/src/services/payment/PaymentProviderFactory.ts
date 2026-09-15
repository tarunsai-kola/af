import { IPaymentProvider } from './IPaymentProvider';
import { RazorpayProvider } from './RazorpayProvider';
import { MockPaymentProvider } from './MockPaymentProvider';

export class PaymentProviderFactory {
  static getProvider(): IPaymentProvider {
    const isDemoMode = process.env.DEMO_PAYMENT_MODE === 'true';
    
    if (isDemoMode) {
      return new MockPaymentProvider();
    }
    
    return new RazorpayProvider();
  }
}
