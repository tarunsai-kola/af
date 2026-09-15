import { Request, Response, NextFunction } from 'express';
import { PaymentTransaction } from '../models/PaymentTransaction.model';
import { Donation } from '../models/Donation.model';
import { Campaign } from '../models/Campaign.model';
import { AuditEvent } from '../models/AuditEvent.model';
import { PaymentProviderFactory } from '../services/payment/PaymentProviderFactory';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/apiResponse';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, currency = 'INR', campaignId } = req.body;
    const userId = (req as any).user.userId;

    if (!amount || amount < 100) {
      throw new AppError('Amount must be at least 100 (₹1)', 400);
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign || campaign.status !== 'active') {
      throw new AppError('Campaign is not active or does not exist', 400);
    }

    const provider = PaymentProviderFactory.getProvider();
    
    // Create the order with the provider
    const order = await provider.createOrder(amount, currency, `receipt_${Date.now()}`);

    // Create our internal PaymentTransaction record
    const transaction = await PaymentTransaction.create({
      provider: 'RAZORPAY', // Assuming razorpay abstraction for now
      providerPaymentId: order.providerOrderId,
      amount: order.amount,
      currency: order.currency,
      status: 'initiated',
      initiatedBy: userId,
      metadata: order.metadata,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    sendSuccess(res, {
      statusCode: 201,
      message: 'Payment order created',
      data: {
        orderId: order.providerOrderId,
        amount: order.amount,
        currency: order.currency,
        transactionId: transaction._id
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      campaignId, 
      isAnonymous = false,
      donorMessage = ''
    } = req.body;
    const userId = (req as any).user.userId;

    const provider = PaymentProviderFactory.getProvider();
    
    const isValid = provider.verifyPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (!isValid) {
      throw new AppError('Payment verification failed. Invalid signature.', 400);
    }

    // Find the initiated transaction
    const transaction = await PaymentTransaction.findOne({ providerPaymentId: razorpay_order_id });
    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    // Idempotency: Check if already confirmed
    if (transaction.status === 'captured') {
      const existingDonation = await Donation.findOne({ paymentTransactionId: transaction._id });
      sendSuccess(res, {
        statusCode: 200,
        message: 'Payment already verified',
        data: { donationId: existingDonation?._id }
      });
      return;
    }

    // Mark transaction as captured
    transaction.status = 'captured';
    transaction.providerSignature = razorpay_signature;
    await transaction.save();

    // Create Donation record
    const donation = await Donation.create({
      userId,
      campaignId,
      paymentTransactionId: transaction._id,
      amount: transaction.amount,
      currency: transaction.currency,
      providerReference: razorpay_payment_id,
      status: 'confirmed',
      isAnonymous,
      donorMessage,
      receiptNumber: `RCPT_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      receiptIssuedAt: new Date()
    });

    // Atomically increment campaign raisedAmount
    await Campaign.findByIdAndUpdate(campaignId, {
      $inc: { raisedAmount: transaction.amount, donorCount: 1 }
    });

    // Audit Event
    await AuditEvent.create({
      userId,
      action: 'create',
      entityType: 'Donation',
      entityId: donation._id,
      details: { amount: transaction.amount, campaignId },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    sendSuccess(res, {
      statusCode: 200,
      message: 'Payment verified and donation recorded',
      data: { donationId: donation._id }
    });
  } catch (error) {
    next(error);
  }
};

export const webhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const provider = PaymentProviderFactory.getProvider();
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';

    const isValid = provider.verifyWebhookSignature(JSON.stringify(req.body), signature, secret);

    if (!isValid) {
      throw new AppError('Invalid webhook signature', 400);
    }

    // Handle webhook payload (omitted for brevity, typically captures payment.captured and does similar logic to verifyPayment)
    // This requires parsing the specific provider payload format.
    
    res.status(200).send('OK');
  } catch (error) {
    next(error);
  }
};
