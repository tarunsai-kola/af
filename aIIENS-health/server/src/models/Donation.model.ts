import { Schema, model, Document, Types } from 'mongoose';
import {
  DONATION_STATUS,
  CURRENCY,
  DonationStatus,
  Currency,
} from './constants';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IDonation extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;                    // Ref: User (donor)
  campaignId: Types.ObjectId;                // Ref: Campaign
  paymentTransactionId: Types.ObjectId;      // Ref: PaymentTransaction
  amount: number;                            // In smallest currency unit (paisa for INR)
  currency: Currency;
  /**
   * Provider-level reference ID (e.g. Razorpay order ID, Stripe payment intent ID).
   * Stored for webhook reconciliation — never exposed in public API responses.
   */
  providerReference: string;
  status: DonationStatus;
  isAnonymous: boolean;                      // If true, donor name not shown on campaign page
  donorMessage?: string;                     // Optional public message from donor
  receiptNumber?: string;                    // Unique receipt for 80G tax certificate
  receiptIssuedAt?: Date;
  refundedAt?: Date;
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const DonationSchema = new Schema<IDonation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },

    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'Campaign reference is required'],
      index: true,
    },

    paymentTransactionId: {
      type: Schema.Types.ObjectId,
      ref: 'PaymentTransaction',
      required: [true, 'Payment transaction reference is required'],
      unique: true,   // One donation record per transaction
    },

    amount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: [100, 'Minimum donation is 100 (smallest currency unit)'],  // ₹1 minimum
    },

    currency: {
      type: String,
      required: [true, 'Currency is required'],
      enum: { values: CURRENCY, message: '{VALUE} is not a supported currency' },
      default: 'INR',
    },

    providerReference: {
      type: String,
      required: [true, 'Provider reference is required'],
      select: false,   // Internal field — not exposed to clients
    },

    status: {
      type: String,
      enum: { values: DONATION_STATUS, message: '{VALUE} is not a valid donation status' },
      default: 'pending',
      index: true,
    },

    isAnonymous: {
      type: Boolean,
      default: false,
    },

    donorMessage: {
      type: String,
      trim: true,
      maxlength: [500, 'Donor message must not exceed 500 characters'],
      default: null,
    },

    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
      index: { sparse: true },
      default: null,
    },

    receiptIssuedAt: { type: Date, default: null },
    refundedAt: { type: Date, default: null },
    refundReason: { type: String, trim: true, default: null },
  },
  {
    timestamps: true,
    collection: 'donations',
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

DonationSchema.index({ campaignId: 1, status: 1, createdAt: -1 });
DonationSchema.index({ userId: 1, status: 1, createdAt: -1 });
DonationSchema.index({ status: 1, createdAt: -1 });

// ─── Model ────────────────────────────────────────────────────────────────────

export const Donation = model<IDonation>('Donation', DonationSchema);
