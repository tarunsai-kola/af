import { Schema, model, Document, Types } from 'mongoose';
import {
  BLOOD_GROUPS,
  GENDER,
  DONOR_VERIFICATION_STATUS,
  DONOR_AVAILABILITY,
  BloodGroup,
  Gender,
  DonorVerificationStatus,
  DonorAvailability,
} from './constants';

// ─── Sub-document Interfaces ──────────────────────────────────────────────────

export interface IDonorContact {
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface IDonorEligibility {
  isEligible: boolean;
  lastDonationDate?: Date;
  lastEligibilityCheckDate?: Date;
  disqualifyingConditions: string[];  // e.g. ['recent_surgery', 'low_hemoglobin']
  notes?: string;
}

export interface IDonorConsent {
  dataProcessingConsented: boolean;
  consentedAt?: Date;
  consentVersion: string;
  withdrawnAt?: Date;
}

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IDonor extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;              // Ref: User
  bloodGroup: BloodGroup;
  dateOfBirth: Date;
  gender: Gender;
  contact: IDonorContact;
  eligibility: IDonorEligibility;
  availability: DonorAvailability;
  consent: IDonorConsent;
  verificationStatus: DonorVerificationStatus;
  verifiedBy?: Types.ObjectId;         // Ref: User (admin/officer who verified)
  verifiedAt?: Date;
  rejectionReason?: string;
  donationCount: number;
  lastDonatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const ContactSchema = new Schema<IDonorContact>(
  {
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, 'Pincode must be a 6-digit number'],
    },
    emergencyContactName: { type: String, trim: true },
    emergencyContactPhone: {
      type: String,
      match: [/^\+?[1-9]\d{6,14}$/, 'Please enter a valid phone number'],
    },
  },
  { _id: false },
);

const EligibilitySchema = new Schema<IDonorEligibility>(
  {
    isEligible: { type: Boolean, default: true },
    lastDonationDate: { type: Date, default: null },
    lastEligibilityCheckDate: { type: Date, default: null },
    disqualifyingConditions: { type: [String], default: [] },
    notes: { type: String, trim: true },
  },
  { _id: false },
);

const DonorConsentSchema = new Schema<IDonorConsent>(
  {
    dataProcessingConsented: { type: Boolean, required: true, default: false },
    consentedAt: { type: Date, default: null },
    consentVersion: { type: String, required: true, default: '1.0' },
    withdrawnAt: { type: Date, default: null },
  },
  { _id: false },
);

// ─── Main Schema ──────────────────────────────────────────────────────────────

const DonorSchema = new Schema<IDonor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,   // One donor profile per user
      index: true,
    },

    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: { values: BLOOD_GROUPS, message: '{VALUE} is not a valid blood group' },
      index: true,
    },

    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
      validate: {
        validator(v: Date) {
          const age = (Date.now() - v.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
          return age >= 18 && age <= 65;
        },
        message: 'Donor must be between 18 and 65 years of age',
      },
    },

    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: { values: GENDER, message: '{VALUE} is not a valid gender value' },
    },

    contact: {
      type: ContactSchema,
      required: [true, 'Contact information is required'],
    },

    eligibility: {
      type: EligibilitySchema,
      default: () => ({ isEligible: true, disqualifyingConditions: [] }),
    },

    availability: {
      type: String,
      enum: { values: DONOR_AVAILABILITY, message: '{VALUE} is not a valid availability status' },
      default: 'available',
      index: true,
    },

    consent: {
      type: DonorConsentSchema,
      required: [true, 'Consent information is required'],
    },

    verificationStatus: {
      type: String,
      enum: { values: DONOR_VERIFICATION_STATUS, message: '{VALUE} is not a valid verification status' },
      default: 'unverified',
      index: true,
    },

    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    verifiedAt: { type: Date, default: null },
    rejectionReason: { type: String, trim: true, default: null },

    donationCount: { type: Number, default: 0, min: 0 },
    lastDonatedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: 'donors',
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

DonorSchema.index({ bloodGroup: 1, availability: 1, verificationStatus: 1 });
DonorSchema.index({ 'contact.city': 1, bloodGroup: 1 });
DonorSchema.index({ verificationStatus: 1, createdAt: -1 });

// ─── Model ────────────────────────────────────────────────────────────────────

export const Donor = model<IDonor>('Donor', DonorSchema);
