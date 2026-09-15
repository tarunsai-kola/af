import { Schema, model, Document, Types } from 'mongoose';
import {
  BLOOD_GROUPS,
  URGENCY,
  BLOOD_REQUEST_STATUS,
  BloodGroup,
  Urgency,
  BloodRequestStatus,
} from './constants';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IBloodRequest extends Document {
  _id: Types.ObjectId;
  /**
   * Either a hospital OR an individual user can raise a blood request,
   * but not both. Validated in pre-save hook.
   */
  hospitalId?: Types.ObjectId;          // Ref: Hospital
  requestedByUserId?: Types.ObjectId;   // Ref: User (individual requester)
  patientCaseId?: Types.ObjectId;       // Ref: PatientCase (if linked to a case)
  bloodGroup: BloodGroup;
  units: number;
  urgency: Urgency;
  requiredBy?: Date;
  location: {
    city: string;
    state: string;
    pincode: string;
    hospitalName?: string;
  };
  contactName: string;
  contactPhone: string;
  notes?: string;
  status: BloodRequestStatus;
  fulfilledUnits: number;
  fulfilledAt?: Date;
  expiresAt: Date;                      // Auto-expire stale requests
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const BloodRequestSchema = new Schema<IBloodRequest>(
  {
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      default: null,
      index: { sparse: true },
    },

    requestedByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: { sparse: true },
    },

    patientCaseId: {
      type: Schema.Types.ObjectId,
      ref: 'PatientCase',
      default: null,
    },

    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: { values: BLOOD_GROUPS, message: '{VALUE} is not a valid blood group' },
      index: true,
    },

    units: {
      type: Number,
      required: [true, 'Number of units is required'],
      min: [1, 'At least 1 unit must be requested'],
      max: [20, 'Cannot request more than 20 units at once'],
    },

    urgency: {
      type: String,
      required: [true, 'Urgency level is required'],
      enum: { values: URGENCY, message: '{VALUE} is not a valid urgency level' },
      default: 'medium',
      index: true,
    },

    requiredBy: { type: Date, default: null },

    location: {
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, match: [/^\d{6}$/, 'Invalid pincode'] },
      hospitalName: { type: String, trim: true },
    },

    contactName: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
    },

    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      match: [/^\+?[1-9]\d{6,14}$/, 'Invalid phone number'],
    },

    notes: { type: String, trim: true, maxlength: [500, 'Notes must not exceed 500 characters'] },

    status: {
      type: String,
      enum: { values: BLOOD_REQUEST_STATUS, message: '{VALUE} is not a valid blood request status' },
      default: 'REQUEST_CREATED',
      index: true,
    },

    fulfilledUnits: {
      type: Number,
      default: 0,
      min: 0,
    },

    fulfilledAt: { type: Date, default: null },

    expiresAt: {
      type: Date,
      required: [true, 'Expiry date is required'],
      index: { expireAfterSeconds: 0 },  // MongoDB TTL index — auto-removes expired documents
    },
  },
  {
    timestamps: true,
    collection: 'blood_requests',
  },
);

// ─── Validation: must have at least one requester ────────────────────────────
BloodRequestSchema.pre('validate', function (next) {
  if (!this.hospitalId && !this.requestedByUserId) {
    this.invalidate(
      'hospitalId',
      'Either hospitalId or requestedByUserId must be provided',
    );
  }
  next();
});

// ─── Indexes ──────────────────────────────────────────────────────────────────

BloodRequestSchema.index({ bloodGroup: 1, status: 1, urgency: 1 });
BloodRequestSchema.index({ 'location.city': 1, bloodGroup: 1, status: 1 });
BloodRequestSchema.index({ status: 1, expiresAt: 1 });

// ─── Model ────────────────────────────────────────────────────────────────────

export const BloodRequest = model<IBloodRequest>('BloodRequest', BloodRequestSchema);
