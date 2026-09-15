import { Schema, model, Document, Types } from 'mongoose';
import {
  CAMP_STATUS,
  CAMP_SERVICE,
  CampStatus,
  CampService,
} from './constants';

// ─── Sub-document Interfaces ──────────────────────────────────────────────────

export interface ICampLocation {
  venue: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
}

export interface ICampProvider {
  name: string;
  registrationNumber?: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
}

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IMedicalCamp extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  hostUserId: Types.ObjectId;          // Ref: User (NGO/organizer)
  hospitalId?: Types.ObjectId;         // Ref: Hospital (if hospital-affiliated)
  provider: ICampProvider;
  location: ICampLocation;
  startDate: Date;
  endDate: Date;
  registrationDeadline?: Date;
  timings: string;                     // e.g. "09:00 AM – 05:00 PM"
  services: CampService[];
  capacity: number;
  registeredCount: number;
  attendedCount: number;
  status: CampStatus;
  cancellationReason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const LocationSchema = new Schema<ICampLocation>(
  {
    venue: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, match: [/^\d{6}$/, 'Invalid pincode'] },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
  },
  { _id: false },
);

const ProviderSchema = new Schema<ICampProvider>(
  {
    name: { type: String, required: true, trim: true },
    registrationNumber: { type: String, trim: true },
    contactName: { type: String, required: true, trim: true },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
  },
  { _id: false },
);

// ─── Main Schema ──────────────────────────────────────────────────────────────

const MedicalCampSchema = new Schema<IMedicalCamp>(
  {
    title: {
      type: String,
      required: [true, 'Camp title is required'],
      trim: true,
      maxlength: [200, 'Title must not exceed 200 characters'],
    },

    description: {
      type: String,
      required: [true, 'Camp description is required'],
      trim: true,
      maxlength: [2000, 'Description must not exceed 2000 characters'],
    },

    hostUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Host user reference is required'],
      index: true,
    },

    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      default: null,
      index: { sparse: true },
    },

    provider: {
      type: ProviderSchema,
      required: [true, 'Provider information is required'],
    },

    location: {
      type: LocationSchema,
      required: [true, 'Location is required'],
    },

    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },

    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator(this: IMedicalCamp, v: Date) {
          return v >= this.startDate;
        },
        message: 'End date must be on or after start date',
      },
    },

    registrationDeadline: {
      type: Date,
      default: null,
    },

    timings: {
      type: String,
      required: [true, 'Camp timings are required'],
      trim: true,
    },

    services: {
      type: [{ type: String, enum: CAMP_SERVICE }],
      required: [true, 'At least one service must be specified'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one camp service must be specified',
      },
    },

    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
      max: [10000, 'Capacity must not exceed 10,000'],
    },

    registeredCount: { type: Number, default: 0, min: 0 },
    attendedCount: { type: Number, default: 0, min: 0 },

    status: {
      type: String,
      enum: { values: CAMP_STATUS, message: '{VALUE} is not a valid camp status' },
      default: 'DRAFT',
      index: true,
    },

    cancellationReason: { type: String, trim: true, default: null },
    notes: { type: String, trim: true, default: null },
  },
  {
    timestamps: true,
    collection: 'medical_camps',
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

MedicalCampSchema.index({ status: 1, startDate: 1 });
MedicalCampSchema.index({ 'location.city': 1, startDate: 1 });
MedicalCampSchema.index({ services: 1, status: 1 });
MedicalCampSchema.index({ hostUserId: 1, status: 1 });

// ─── Model ────────────────────────────────────────────────────────────────────

export const MedicalCamp = model<IMedicalCamp>('MedicalCamp', MedicalCampSchema);
