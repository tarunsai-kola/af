import { Schema, model, Document, Types } from 'mongoose';
import {
  COMPLAINT_STATUS,
  COMPLAINT_CATEGORY,
  ComplaintStatus,
  ComplaintCategory,
} from './constants';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IComplaint extends Document {
  _id: Types.ObjectId;
  complainantUserId: Types.ObjectId;   // Ref: User (who filed the complaint)
  /**
   * The object being complained about.
   * One of these should be set — not enforced at DB level to allow flexibility.
   */
  relatedCampaignId?: Types.ObjectId;  // Ref: Campaign
  relatedUserId?: Types.ObjectId;      // Ref: User (complained against)
  relatedHospitalId?: Types.ObjectId;  // Ref: Hospital
  category: ComplaintCategory;
  subject: string;
  description: string;
  evidenceStorageKeys: string[];       // Storage keys — never public URLs
  status: ComplaintStatus;
  assignedToUserId?: Types.ObjectId;   // Ref: User (admin/moderator assigned)
  internalNotes?: string;              // select: false — internal use only
  resolution?: string;
  resolvedAt?: Date;
  escalatedAt?: Date;
  escalationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const ComplaintSchema = new Schema<IComplaint>(
  {
    complainantUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Complainant user reference is required'],
      index: true,
    },

    relatedCampaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      default: null,
    },

    relatedUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    relatedHospitalId: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      default: null,
    },

    category: {
      type: String,
      required: [true, 'Complaint category is required'],
      enum: { values: COMPLAINT_CATEGORY, message: '{VALUE} is not a valid complaint category' },
      index: true,
    },

    subject: {
      type: String,
      required: [true, 'Complaint subject is required'],
      trim: true,
      minlength: [10, 'Subject must be at least 10 characters'],
      maxlength: [200, 'Subject must not exceed 200 characters'],
    },

    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true,
      minlength: [30, 'Description must be at least 30 characters'],
      maxlength: [5000, 'Description must not exceed 5000 characters'],
    },

    evidenceStorageKeys: {
      type: [String],
      default: [],
      select: false,   // Evidence paths are internal — resolved via storage service
      validate: {
        validator: (v: string[]) => v.length <= 10,
        message: 'Cannot attach more than 10 evidence files',
      },
    },

    status: {
      type: String,
      enum: { values: COMPLAINT_STATUS, message: '{VALUE} is not a valid complaint status' },
      default: 'open',
      index: true,
    },

    assignedToUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: { sparse: true },
    },

    internalNotes: {
      type: String,
      trim: true,
      select: false,
      default: null,
    },

    resolution: {
      type: String,
      trim: true,
      maxlength: [2000, 'Resolution must not exceed 2000 characters'],
      default: null,
    },

    resolvedAt: { type: Date, default: null },
    escalatedAt: { type: Date, default: null },
    escalationReason: { type: String, trim: true, default: null },
  },
  {
    timestamps: true,
    collection: 'complaints',
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

ComplaintSchema.index({ status: 1, createdAt: -1 });
ComplaintSchema.index({ assignedToUserId: 1, status: 1 });
ComplaintSchema.index({ category: 1, status: 1 });

// ─── Model ────────────────────────────────────────────────────────────────────

export const Complaint = model<IComplaint>('Complaint', ComplaintSchema);
