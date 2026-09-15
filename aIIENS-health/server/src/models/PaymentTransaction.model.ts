import { Schema, model, Document, Types } from 'mongoose';
import {
  PAYMENT_STATUS,
  PAYMENT_PROVIDER,
  CURRENCY,
  PaymentStatus,
  PaymentProvider,
  Currency,
} from './constants';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IPaymentTransaction extends Document {
  _id: Types.ObjectId;
  provider: PaymentProvider;
  /**
   * The provider's unique payment/order ID (e.g. Razorpay order_id, Stripe payment_intent id).
   * Used for webhook matching and reconciliation.
   * Select: false — not returned in API responses.
   */
  providerPaymentId: string;
  /**
   * Provider's signature for webhook verification (stored temporarily for audit).
   */
  providerSignature?: string;
  amount: number;                   // In smallest currency unit
  currency: Currency;
  status: PaymentStatus;
  /**
   * Flexible metadata bag: stores provider-specific raw payload fields needed for
   * reconciliation, webhook data, refund details, etc.
   * Not exposed in client API responses.
   */
  metadata: Record<string, unknown>;
  initiatedBy: Types.ObjectId;      // Ref: User
  ipAddress?: string;               // For fraud detection — stored encrypted or hashed
  userAgent?: string;
  failureCode?: string;
  failureMessage?: string;
  refundedAmount: number;           // Partial refunds supported
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const PaymentTransactionSchema = new Schema<IPaymentTransaction>(
  {
    provider: {
      type: String,
      required: [true, 'Payment provider is required'],
      enum: { values: PAYMENT_PROVIDER, message: '{VALUE} is not a supported payment provider' },
      index: true,
    },

    providerPaymentId: {
      type: String,
      required: [true, 'Provider payment ID is required'],
      unique: true,
      select: false,
      trim: true,
    },

    providerSignature: {
      type: String,
      select: false,
      default: null,
    },

    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be greater than 0'],
    },

    currency: {
      type: String,
      required: [true, 'Currency is required'],
      enum: { values: CURRENCY, message: '{VALUE} is not a supported currency' },
      default: 'INR',
    },

    status: {
      type: String,
      required: [true, 'Payment status is required'],
      enum: { values: PAYMENT_STATUS, message: '{VALUE} is not a valid payment status' },
      default: 'initiated',
      index: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
      select: false,   // Raw provider data — internal use only
    },

    initiatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Initiating user reference is required'],
      index: true,
    },

    ipAddress: { type: String, select: false, default: null },
    userAgent: { type: String, select: false, default: null },
    failureCode: { type: String, trim: true, default: null },
    failureMessage: { type: String, trim: true, default: null },

    refundedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: 'payment_transactions',
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

PaymentTransactionSchema.index({ status: 1, createdAt: -1 });
PaymentTransactionSchema.index({ initiatedBy: 1, status: 1 });
PaymentTransactionSchema.index({ provider: 1, status: 1 });

// ─── Model ────────────────────────────────────────────────────────────────────

export const PaymentTransaction = model<IPaymentTransaction>('PaymentTransaction', PaymentTransactionSchema);
