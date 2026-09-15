import { Schema, model, Document, Types } from 'mongoose';
import {
  CONSENT_METHOD,
  CONSENT_SUBJECT_TYPE,
  ConsentMethod,
  ConsentSubjectType,
} from './constants';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IConsent extends Document {
  _id: Types.ObjectId;
  subjectUserId: Types.ObjectId;       // Ref: User (the person giving consent)
  subjectType: ConsentSubjectType;
  purpose: string;                     // e.g. 'data_processing', 'blood_donation', 'camp_participation'
  consentVersion: string;              // Version of the consent document e.g. '2.1'
  consentedAt?: Date;
  method: ConsentMethod;
  /**
   * Hash of the specific consent document text shown to the user.
   * Allows forensic verification that the user saw the correct version.
   */
  documentHash: string;
  ipAddress?: string;                  // select: false
  userAgent?: string;                  // select: false
  isActive: boolean;
  withdrawnAt?: Date;
  withdrawalReason?: string;
  expiresAt?: Date;                    // For time-limited consents
  relatedObjectType?: string;          // e.g. 'Campaign', 'BloodRequest'
  relatedObjectId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const ConsentSchema = new Schema<IConsent>(
  {
    subjectUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Subject user reference is required'],
      index: true,
    },

    subjectType: {
      type: String,
      required: [true, 'Subject type is required'],
      enum: { values: CONSENT_SUBJECT_TYPE, message: '{VALUE} is not a valid subject type' },
    },

    purpose: {
      type: String,
      required: [true, 'Consent purpose is required'],
      trim: true,
      maxlength: [200, 'Purpose must not exceed 200 characters'],
    },

    consentVersion: {
      type: String,
      required: [true, 'Consent version is required'],
      trim: true,
    },

    consentedAt: {
      type: Date,
      default: null,
    },

    method: {
      type: String,
      required: [true, 'Consent method is required'],
      enum: { values: CONSENT_METHOD, message: '{VALUE} is not a valid consent method' },
    },

    documentHash: {
      type: String,
      required: [true, 'Document hash is required'],
      trim: true,
      select: false,   // Internal verification only
    },

    ipAddress: { type: String, select: false, default: null },
    userAgent: { type: String, select: false, default: null },

    isActive: { type: Boolean, default: true, index: true },

    withdrawnAt: { type: Date, default: null },
    withdrawalReason: { type: String, trim: true, default: null },
    expiresAt: { type: Date, default: null },

    relatedObjectType: { type: String, default: null },
    relatedObjectId: { type: Schema.Types.ObjectId, default: null },
  },
  {
    timestamps: true,
    collection: 'consents',
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

ConsentSchema.index({ subjectUserId: 1, purpose: 1, isActive: 1 });
ConsentSchema.index({ subjectUserId: 1, consentVersion: 1 });
ConsentSchema.index({ relatedObjectType: 1, relatedObjectId: 1 });

// ─── Model ────────────────────────────────────────────────────────────────────

export const Consent = model<IConsent>('Consent', ConsentSchema);
