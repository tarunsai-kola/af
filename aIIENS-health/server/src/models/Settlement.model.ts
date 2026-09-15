import { Schema, model, Document, Types } from 'mongoose';
import {
  SETTLEMENT_STATUS,
  CURRENCY,
  SettlementStatus,
  Currency,
} from './constants';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface ISettlement extends Document {
  _id: Types.ObjectId;
  campaignId: Types.ObjectId;              // Ref: Campaign
  hospitalId: Types.ObjectId;             // Ref: Hospital (recipient)
  requestedBy: Types.ObjectId;            // Ref: User (officer who initiated settlement)
  approvedBy?: Types.ObjectId;            // Ref: User (admin who approved)
  amount: number;                         // Amount to be transferred to hospital
  currency: Currency;
  platformFee: number;                    // Deducted platform fee
  netAmount: number;                      // amount - platformFee
  recipientBankName?: string;
  recipientAccountLast4?: string;         // Last 4 digits only — never full account number
  recipientIfscCode?: string;             // IFSC — can be stored (public info)
  paymentReference?: string;             // Bank transfer reference / UTR number
  status: SettlementStatus;
  rejectionReason?: string;
  reconciliationNotes?: string;
  scheduledAt?: Date;
  processedAt?: Date;
  reconciledAt?: Date;
  evidenceDocumentKey?: string;           // Storage key for transfer receipt/evidence
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const SettlementSchema = new Schema<ISettlement>(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'Campaign reference is required'],
      index: true,
    },

    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      required: [true, 'Hospital reference is required'],
      index: true,
    },

    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requester reference is required'],
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    amount: {
      type: Number,
      required: [true, 'Settlement amount is required'],
      min: [1, 'Amount must be greater than 0'],
    },

    currency: {
      type: String,
      required: true,
      enum: { values: CURRENCY, message: '{VALUE} is not a supported currency' },
      default: 'INR',
    },

    platformFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    netAmount: {
      type: Number,
      required: true,
      min: [0, 'Net amount cannot be negative'],
    },

    recipientBankName: { type: String, trim: true, default: null },
    recipientAccountLast4: {
      type: String,
      match: [/^\d{4}$/, 'Must be exactly 4 digits'],
      default: null,
      select: false,
    },
    recipientIfscCode: { type: String, trim: true, default: null },

    paymentReference: {
      type: String,
      trim: true,
      default: null,
      index: { sparse: true },
    },

    status: {
      type: String,
      enum: { values: SETTLEMENT_STATUS, message: '{VALUE} is not a valid settlement status' },
      default: 'SETTLEMENT_REQUESTED',
      index: true,
    },

    rejectionReason: { type: String, trim: true, default: null },
    reconciliationNotes: { type: String, trim: true, default: null },

    scheduledAt: { type: Date, default: null },
    processedAt: { type: Date, default: null },
    reconciledAt: { type: Date, default: null },

    evidenceDocumentKey: { type: String, default: null, select: false },
  },
  {
    timestamps: true,
    collection: 'settlements',
  },
);

// ─── Compound validation ──────────────────────────────────────────────────────

SettlementSchema.pre('validate', function (next) {
  if (this.netAmount !== this.amount - this.platformFee) {
    this.netAmount = this.amount - this.platformFee;
  }
  next();
});

// ─── Indexes ──────────────────────────────────────────────────────────────────

SettlementSchema.index({ campaignId: 1, status: 1 });
SettlementSchema.index({ hospitalId: 1, createdAt: -1 });

// ─── Model ────────────────────────────────────────────────────────────────────

export const Settlement = model<ISettlement>('Settlement', SettlementSchema);
