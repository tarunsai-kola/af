import { Schema, model, Document, Types } from 'mongoose';
import { AUDIT_ACTION, AUDIT_SOURCE, AuditAction, AuditSource } from './constants';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IAuditEvent extends Document {
  _id: Types.ObjectId;
  /**
   * The user who performed the action.
   * Null for system-generated events (cron, automated jobs).
   */
  actorUserId?: Types.ObjectId;        // Ref: User
  actorRole?: string;
  action: AuditAction;
  objectType: string;                  // Model name e.g. 'Campaign', 'Settlement'
  objectId?: Types.ObjectId;           // The specific document affected
  /**
   * JSON snapshot of the object state BEFORE the action.
   * Stored as a plain string to prevent Mongoose type coercion from
   * corrupting the snapshot. Parsed only when needed for diff display.
   */
  beforeSnapshot?: string;
  /**
   * JSON snapshot of the object state AFTER the action.
   */
  afterSnapshot?: string;
  /**
   * Human-readable summary of what changed — used in audit UI.
   * e.g. "Campaign status changed from 'draft' to 'active'"
   */
  changeSummary?: string;
  source: AuditSource;
  requestId?: string;                  // Correlation ID from req.requestId
  ipAddress?: string;                  // select: false
  userAgent?: string;                  // select: false
  timestamp: Date;
  createdAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const AuditEventSchema = new Schema<IAuditEvent>(
  {
    actorUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },

    actorRole: { type: String, default: null },

    action: {
      type: String,
      required: [true, 'Audit action is required'],
      enum: { values: AUDIT_ACTION, message: '{VALUE} is not a valid audit action' },
      index: true,
    },

    objectType: {
      type: String,
      required: [true, 'Object type is required'],
      trim: true,
      index: true,
    },

    objectId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    beforeSnapshot: { type: String, default: null },
    afterSnapshot: { type: String, default: null },

    changeSummary: {
      type: String,
      trim: true,
      maxlength: [500, 'Change summary must not exceed 500 characters'],
      default: null,
    },

    source: {
      type: String,
      required: [true, 'Audit source is required'],
      enum: { values: AUDIT_SOURCE, message: '{VALUE} is not a valid audit source' },
      index: true,
    },

    requestId: { type: String, default: null, index: { sparse: true } },

    ipAddress: { type: String, select: false, default: null },
    userAgent: { type: String, select: false, default: null },

    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: -1,
    },
  },
  {
    // Only createdAt — audit events are immutable
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'audit_events',
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

AuditEventSchema.index({ objectType: 1, objectId: 1, timestamp: -1 });
AuditEventSchema.index({ actorUserId: 1, action: 1, timestamp: -1 });
AuditEventSchema.index({ source: 1, timestamp: -1 });
// TTL: auto-delete audit events after retention period
// Default ≈ 7 years (220752000s) for healthcare compliance. Configurable via AUDIT_RETENTION_SECONDS.
const auditRetentionSeconds = parseInt(process.env.AUDIT_RETENTION_SECONDS || '220752000', 10);
AuditEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: auditRetentionSeconds });

// ─── Model ────────────────────────────────────────────────────────────────────

export const AuditEvent = model<IAuditEvent>('AuditEvent', AuditEventSchema);
