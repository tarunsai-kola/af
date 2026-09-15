import { Schema, model, Document, Types } from 'mongoose';
import {
  RISK_TYPE,
  RISK_SEVERITY,
  RISK_STATUS,
  RISK_OBJECT_TYPE,
  RiskType,
  RiskSeverity,
  RiskStatus,
  RiskObjectType,
} from './constants';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IRiskFlag extends Document {
  _id: Types.ObjectId;
  /**
   * The object that triggered the risk flag.
   * relatedObjectType is the Mongoose model name.
   */
  relatedObjectType: RiskObjectType;
  relatedObjectId: Types.ObjectId;
  /**
   * The user associated with the risk (may differ from the flagged object's owner).
   */
  relatedUserId?: Types.ObjectId;      // Ref: User
  riskType: RiskType;
  severity: RiskSeverity;
  status: RiskStatus;
  /**
   * How the flag was created: 'system' = automated detection, 'manual' = reviewer-created.
   */
  source: 'system' | 'manual';
  /**
   * Array of evidence items — can be text, storage keys, or external ref IDs.
   * select: false — not returned in list queries.
   */
  evidence: {
    type: 'text' | 'storage_key' | 'ref_id';
    value: string;
    label?: string;
  }[];
  assignedReviewerUserId?: Types.ObjectId;   // Ref: User (reviewer)
  reviewStartedAt?: Date;
  decision?: 'confirmed_risk' | 'false_positive' | 'inconclusive';
  decisionReason?: string;
  decisionMadeAt?: Date;
  decisionMadeBy?: Types.ObjectId;           // Ref: User
  escalatedAt?: Date;
  escalationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const EvidenceItemSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['text', 'storage_key', 'ref_id'],
    },
    value: { type: String, required: true, trim: true },
    label: { type: String, trim: true },
  },
  { _id: false },
);

const RiskFlagSchema = new Schema<IRiskFlag>(
  {
    relatedObjectType: {
      type: String,
      required: [true, 'Related object type is required'],
      enum: { values: RISK_OBJECT_TYPE, message: '{VALUE} is not a valid object type' },
      index: true,
    },

    relatedObjectId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Related object ID is required'],
      index: true,
    },

    relatedUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: { sparse: true },
    },

    riskType: {
      type: String,
      required: [true, 'Risk type is required'],
      enum: { values: RISK_TYPE, message: '{VALUE} is not a valid risk type' },
      index: true,
    },

    severity: {
      type: String,
      required: [true, 'Risk severity is required'],
      enum: { values: RISK_SEVERITY, message: '{VALUE} is not a valid risk severity' },
      index: true,
    },

    status: {
      type: String,
      enum: { values: RISK_STATUS, message: '{VALUE} is not a valid risk status' },
      default: 'open',
      index: true,
    },

    source: {
      type: String,
      required: [true, 'Flag source is required'],
      enum: { values: ['system', 'manual'], message: '{VALUE} is not a valid source' },
    },

    evidence: {
      type: [EvidenceItemSchema],
      default: [],
      select: false,   // Evidence details are internal — not returned in list queries
    },

    assignedReviewerUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: { sparse: true },
    },

    reviewStartedAt: { type: Date, default: null },

    decision: {
      type: String,
      enum: {
        values: ['confirmed_risk', 'false_positive', 'inconclusive'],
        message: '{VALUE} is not a valid decision',
      },
      default: null,
    },

    decisionReason: {
      type: String,
      trim: true,
      maxlength: [2000, 'Decision reason must not exceed 2000 characters'],
      default: null,
    },

    decisionMadeAt: { type: Date, default: null },
    decisionMadeBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },

    escalatedAt: { type: Date, default: null },
    escalationReason: { type: String, trim: true, default: null },
  },
  {
    timestamps: true,
    collection: 'risk_flags',
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

RiskFlagSchema.index({ relatedObjectType: 1, relatedObjectId: 1 });
RiskFlagSchema.index({ severity: 1, status: 1, createdAt: -1 });
RiskFlagSchema.index({ assignedReviewerUserId: 1, status: 1 });
RiskFlagSchema.index({ riskType: 1, status: 1 });

// ─── Model ────────────────────────────────────────────────────────────────────

export const RiskFlag = model<IRiskFlag>('RiskFlag', RiskFlagSchema);
