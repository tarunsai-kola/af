import { Schema, model, Document, Types } from 'mongoose';
import {
  HOSPITAL_VERIFICATION_STATUS,
  HOSPITAL_TYPE,
  HospitalVerificationStatus,
  HospitalType,
} from './constants';

// ─── Sub-document Interfaces ──────────────────────────────────────────────────

export interface IHospitalAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface IHospitalContact {
  phone: string;
  email: string;
  website?: string;
  emergencyPhone?: string;
}

export interface IAuthorizedContact {
  name: string;
  designation: string;
  email: string;
  phone: string;
  userId?: Types.ObjectId;   // Ref: User (if they have a platform account)
}

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IHospital extends Document {
  _id: Types.ObjectId;
  name: string;
  registrationNumber: string;
  type: HospitalType;
  address: IHospitalAddress;
  contact: IHospitalContact;
  authorizedContacts: IAuthorizedContact[];
  verificationStatus: HospitalVerificationStatus;
  verifiedBy?: Types.ObjectId;           // Ref: User (admin)
  verifiedAt?: Date;
  verificationDocumentKey?: string;      // Storage key — never a public URL
  rejectionReason?: string;
  isActive: boolean;
  specializations: string[];
  bedCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const AddressSchema = new Schema<IHospitalAddress>(
  {
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, match: [/^\d{6}$/, 'Invalid pincode'] },
    country: { type: String, required: true, default: 'India' },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
  },
  { _id: false },
);

const ContactSchema = new Schema<IHospitalContact>(
  {
    phone: {
      type: String,
      required: true,
      match: [/^\+?[1-9]\d{6,14}$/, 'Invalid phone number'],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    website: { type: String },
    emergencyPhone: { type: String },
  },
  { _id: false },
);

const AuthorizedContactSchema = new Schema<IAuthorizedContact>(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    phone: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { _id: true },   // Keep _id for authorized contacts — they are individually referenced
);

// ─── Main Schema ──────────────────────────────────────────────────────────────

const HospitalSchema = new Schema<IHospital>(
  {
    name: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
      maxlength: [200, 'Hospital name must not exceed 200 characters'],
    },

    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true,
      index: true,
    },

    type: {
      type: String,
      required: [true, 'Hospital type is required'],
      enum: { values: HOSPITAL_TYPE, message: '{VALUE} is not a valid hospital type' },
      index: true,
    },

    address: {
      type: AddressSchema,
      required: [true, 'Address is required'],
    },

    contact: {
      type: ContactSchema,
      required: [true, 'Contact information is required'],
    },

    authorizedContacts: {
      type: [AuthorizedContactSchema],
      default: [],
      validate: {
        validator: (v: IAuthorizedContact[]) => v.length <= 10,
        message: 'Cannot have more than 10 authorized contacts',
      },
    },

    verificationStatus: {
      type: String,
      enum: { values: HOSPITAL_VERIFICATION_STATUS, message: '{VALUE} is not a valid verification status' },
      default: 'pending',
      index: true,
    },

    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    verifiedAt: { type: Date, default: null },
    verificationDocumentKey: { type: String, default: null },
    rejectionReason: { type: String, trim: true, default: null },

    isActive: { type: Boolean, default: true, index: true },

    specializations: { type: [String], default: [] },
    bedCount: { type: Number, min: 0 },
  },
  {
    timestamps: true,
    collection: 'hospitals',
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

HospitalSchema.index({ 'address.city': 1, 'address.state': 1 });
HospitalSchema.index({ verificationStatus: 1, isActive: 1 });
HospitalSchema.index({ name: 'text' });   // Text search on hospital name

// ─── Model ────────────────────────────────────────────────────────────────────

export const Hospital = model<IHospital>('Hospital', HospitalSchema);
