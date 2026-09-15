import { Schema, model, Document, Types } from 'mongoose';
import { BLOOD_GROUPS, BloodGroup } from './constants';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IFamilyMember extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;      // Owner — ref: User
  name: string;
  email?: string;
  phone: string;
  dateOfBirth: Date;
  bloodGroup?: BloodGroup;
  relation: string;            // e.g. 'spouse', 'parent', 'child', 'sibling', 'other'
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const FamilyMemberSchema = new Schema<IFamilyMember>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },

    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
      default: null,
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },

    bloodGroup: {
      type: String,
      enum: { values: BLOOD_GROUPS, message: '{VALUE} is not a valid blood group' },
      default: null,
    },

    relation: {
      type: String,
      required: [true, 'Relation is required'],
      trim: true,
      enum: {
        values: ['spouse', 'parent', 'child', 'sibling', 'grandparent', 'other'],
        message: '{VALUE} is not a valid relation',
      },
    },
  },
  {
    timestamps: true,
    collection: 'family_members',
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

FamilyMemberSchema.index({ userId: 1, createdAt: -1 });

// ─── Model ────────────────────────────────────────────────────────────────────

export const FamilyMember = model<IFamilyMember>('FamilyMember', FamilyMemberSchema);
