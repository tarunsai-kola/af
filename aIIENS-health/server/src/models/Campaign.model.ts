import { Schema, model, Document, Types } from 'mongoose';
import { CAMPAIGN_STATUS, CampaignStatus } from './constants';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface ICampaign extends Document {
  _id: Types.ObjectId;
  caseId: Types.ObjectId;              // Ref: PatientCase (one campaign per case)
  createdBy: Types.ObjectId;           // Ref: User (guardian/NGO who initiated)
  title: string;
  slug: string;                        // URL-safe unique identifier
  summary: string;
  story: string;                       // Full campaign narrative (rich text)
  goal: number;                        // Target amount in smallest currency unit (paisa for INR)
  currency: string;
  raisedAmount: number;                // Running total — updated on each donation captured
  donorCount: number;
  status: CampaignStatus;
  coverImageKey?: string;              // Storage key — resolved to signed URL by API layer
  reviewedBy?: Types.ObjectId;         // Ref: User (admin/moderator)
  reviewedAt?: Date;
  rejectionReason?: string;
  publishedAt?: Date;
  closedAt?: Date;
  closureReason?: string;
  featuredUntil?: Date;                // If set, campaign is featured on homepage until this date
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const CampaignSchema = new Schema<ICampaign>(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: 'PatientCase',
      required: [true, 'Case reference is required'],
      unique: true,   // One active campaign per patient case
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator reference is required'],
      index: true,
    },

    title: {
      type: String,
      required: [true, 'Campaign title is required'],
      trim: true,
      minlength: [10, 'Title must be at least 10 characters'],
      maxlength: [150, 'Title must not exceed 150 characters'],
    },

    slug: {
      type: String,
      required: [true, 'Campaign slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'],
      index: true,
    },

    summary: {
      type: String,
      required: [true, 'Campaign summary is required'],
      trim: true,
      minlength: [50, 'Summary must be at least 50 characters'],
      maxlength: [500, 'Summary must not exceed 500 characters'],
    },

    story: {
      type: String,
      required: [true, 'Campaign story is required'],
      trim: true,
      minlength: [100, 'Story must be at least 100 characters'],
      maxlength: [10000, 'Story must not exceed 10,000 characters'],
    },

    goal: {
      type: Number,
      required: [true, 'Campaign goal is required'],
      min: [100, 'Campaign goal must be at least 100 (in smallest currency unit)'],
    },

    currency: {
      type: String,
      required: true,
      default: 'INR',
      uppercase: true,
    },

    raisedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    donorCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: { values: CAMPAIGN_STATUS, message: '{VALUE} is not a valid campaign status' },
      default: 'draft',
      index: true,
    },

    coverImageKey: { type: String, default: null },

    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
    rejectionReason: { type: String, trim: true, default: null },

    publishedAt: { type: Date, default: null, index: { sparse: true } },
    closedAt: { type: Date, default: null },
    closureReason: { type: String, trim: true, default: null },
    featuredUntil: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: 'campaigns',
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

CampaignSchema.index({ status: 1, publishedAt: -1 });
CampaignSchema.index({ status: 1, raisedAmount: 1 });
CampaignSchema.index({ featuredUntil: 1, status: 1 });
CampaignSchema.index({ title: 'text', summary: 'text' });  // Full-text search

// ─── Model ────────────────────────────────────────────────────────────────────

export const Campaign = model<ICampaign>('Campaign', CampaignSchema);
