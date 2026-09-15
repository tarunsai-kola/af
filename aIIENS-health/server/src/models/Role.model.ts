import { Schema, model, Document, Types } from 'mongoose';
import { USER_ROLE, UserRole } from './constants';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IRole extends Document {
  _id: Types.ObjectId;
  name: UserRole;
  displayName: string;
  description: string;
  permissions: string[];    // Fine-grained permission strings e.g. 'campaign:create', 'case:approve'
  isSystem: boolean;        // System roles cannot be deleted
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const RoleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      enum: { values: USER_ROLE, message: '{VALUE} is not a valid role name' },
      unique: true,
      index: true,
    },

    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
      maxlength: [60, 'Display name must not exceed 60 characters'],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must not exceed 500 characters'],
      default: '',
    },

    permissions: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) => v.every((p) => /^[a-z_]+:[a-z_]+$/.test(p)),
        message: 'Permissions must follow the format "resource:action" (e.g. "campaign:create")',
      },
    },

    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'roles',
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

RoleSchema.index({ isSystem: 1 });

// ─── Model ────────────────────────────────────────────────────────────────────

export const Role = model<IRole>('Role', RoleSchema);
