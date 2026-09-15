import { Schema, model, Document, Types } from 'mongoose';
import {
  USER_STATUS,
  USER_ROLE,
  CONSENT_STATUS,
  BLOOD_GROUPS,
  UserStatus,
  UserRole,
  ConsentStatus,
  BloodGroup,
} from './constants';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;               // Required at registration
  dateOfBirth?: Date;          // Collected at registration for donor eligibility
  bloodGroup?: BloodGroup;     // Collected at registration
  isDonor: boolean;            // Whether user opted in as a donor
  passwordHash: string;
  roles: UserRole[];
  status: UserStatus;
  consentStatus: ConsentStatus;
  avatarStorageKey?: string;   // Never a public URL — always resolved through the storage layer
  emailVerifiedAt?: Date;
  phoneVerifiedAt?: Date;
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
  refreshTokenFamily?: string; // Used for refresh-token rotation detection
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must not exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
      index: true,
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$|^\+?[1-9]\d{6,14}$/, 'Please enter a valid phone number'],
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    bloodGroup: {
      type: String,
      enum: { values: BLOOD_GROUPS, message: '{VALUE} is not a valid blood group' },
      default: null,
      index: { sparse: true },
    },

    isDonor: {
      type: Boolean,
      default: false,
      index: true,
    },

    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false,   // Never returned in queries by default
    },

    roles: {
      type: [{ type: String, enum: USER_ROLE }],
      default: ['PUBLIC_USER'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'User must have at least one role',
      },
    },

    status: {
      type: String,
      enum: USER_STATUS,
      default: 'pending_verification',
      index: true,
    },

    consentStatus: {
      type: String,
      enum: CONSENT_STATUS,
      default: 'not_given',
    },

    avatarStorageKey: {
      type: String,
      default: null,
    },

    emailVerifiedAt: { type: Date, default: null },
    phoneVerifiedAt: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null },
    passwordChangedAt: { type: Date, default: null },

    refreshTokenFamily: {
      type: String,
      select: false,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'users',
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        // Strip sensitive fields from JSON output
        ret['passwordHash'] = undefined;
        ret['refreshTokenFamily'] = undefined;
        return ret;
      },
    },
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

UserSchema.index({ status: 1, createdAt: -1 });
UserSchema.index({ roles: 1 });

// ─── Model ────────────────────────────────────────────────────────────────────

export const User = model<IUser>('User', UserSchema);
