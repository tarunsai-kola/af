import { Schema, model, Document, Types } from 'mongoose';
import { CAMP_REGISTRATION_STATUS, CampRegistrationStatus } from './constants';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface ICampRegistration extends Document {
  _id: Types.ObjectId;
  campId: Types.ObjectId;              // Ref: MedicalCamp
  userId: Types.ObjectId;             // Ref: User (registrant)
  registrantName: string;             // Captured at registration time (may differ from user.name for dependent)
  registrantAge?: number;
  registrantGender?: string;
  contactPhone: string;
  servicesRequested: string[];         // Subset of camp services
  status: CampRegistrationStatus;
  checkInTime?: Date;
  checkOutTime?: Date;
  notes?: string;                     // Volunteer/staff notes
  feedbackRating?: number;            // 1-5 post-camp rating
  feedbackText?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const CampRegistrationSchema = new Schema<ICampRegistration>(
  {
    campId: {
      type: Schema.Types.ObjectId,
      ref: 'MedicalCamp',
      required: [true, 'Camp reference is required'],
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },

    registrantName: {
      type: String,
      required: [true, 'Registrant name is required'],
      trim: true,
      maxlength: [100, 'Name must not exceed 100 characters'],
    },

    registrantAge: {
      type: Number,
      min: [0, 'Age cannot be negative'],
      max: [120, 'Age must not exceed 120'],
    },

    registrantGender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    },

    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      match: [/^\+?[1-9]\d{6,14}$/, 'Invalid phone number'],
    },

    servicesRequested: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: { values: CAMP_REGISTRATION_STATUS, message: '{VALUE} is not a valid registration status' },
      default: 'registered',
      index: true,
    },

    checkInTime: { type: Date, default: null },
    checkOutTime: { type: Date, default: null },
    notes: { type: String, trim: true, default: null },

    feedbackRating: {
      type: Number,
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
      default: null,
    },

    feedbackText: {
      type: String,
      trim: true,
      maxlength: [1000, 'Feedback text must not exceed 1000 characters'],
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'camp_registrations',
  },
);

// ─── Compound unique: one registration per user per camp ──────────────────────
CampRegistrationSchema.index({ campId: 1, userId: 1 }, { unique: true });
CampRegistrationSchema.index({ campId: 1, status: 1 });
CampRegistrationSchema.index({ userId: 1, createdAt: -1 });

// ─── Model ────────────────────────────────────────────────────────────────────

export const CampRegistration = model<ICampRegistration>('CampRegistration', CampRegistrationSchema);
