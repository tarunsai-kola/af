import { Schema, model, Document, Types } from 'mongoose';
import {
  NOTIFICATION_TYPE,
  NOTIFICATION_CHANNEL,
  NOTIFICATION_STATUS,
  NotificationType,
  NotificationChannel,
  NotificationStatus,
} from './constants';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface INotification extends Document {
  _id: Types.ObjectId;
  recipientUserId: Types.ObjectId;     // Ref: User
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  body: string;
  /**
   * Deep link or relative URL for the notification's CTA.
   * e.g. '/campaigns/abc123'
   */
  actionUrl?: string;
  /**
   * Structured payload for push/email templates.
   * Not returned in list queries.
   */
  payload: Record<string, unknown>;
  status: NotificationStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  /**
   * Idempotency key — prevents duplicate notifications for the same event.
   * e.g. 'donation:donationId:completed'
   */
  idempotencyKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const NotificationSchema = new Schema<INotification>(
  {
    recipientUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient user reference is required'],
      index: true,
    },

    type: {
      type: String,
      required: [true, 'Notification type is required'],
      enum: { values: NOTIFICATION_TYPE, message: '{VALUE} is not a valid notification type' },
      index: true,
    },

    channel: {
      type: String,
      required: [true, 'Notification channel is required'],
      enum: { values: NOTIFICATION_CHANNEL, message: '{VALUE} is not a valid notification channel' },
    },

    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [150, 'Title must not exceed 150 characters'],
    },

    body: {
      type: String,
      required: [true, 'Notification body is required'],
      trim: true,
      maxlength: [1000, 'Body must not exceed 1000 characters'],
    },

    actionUrl: {
      type: String,
      trim: true,
      match: [/^\//, 'Action URL must be a relative path starting with /'],
      default: null,
    },

    payload: {
      type: Schema.Types.Mixed,
      default: {},
      select: false,
    },

    status: {
      type: String,
      enum: { values: NOTIFICATION_STATUS, message: '{VALUE} is not a valid notification status' },
      default: 'pending',
      index: true,
    },

    sentAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    readAt: { type: Date, default: null },
    failedAt: { type: Date, default: null },
    failureReason: { type: String, trim: true, default: null },

    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
      index: { sparse: true },
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'notifications',
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

NotificationSchema.index({ recipientUserId: 1, status: 1, createdAt: -1 });
NotificationSchema.index({ recipientUserId: 1, readAt: 1 });   // Unread count query
// TTL: auto-delete read notifications older than 90 days
NotificationSchema.index(
  { readAt: 1 },
  { expireAfterSeconds: 7776000, partialFilterExpression: { readAt: { $ne: null } } },
);

// ─── Model ────────────────────────────────────────────────────────────────────

export const Notification = model<INotification>('Notification', NotificationSchema);
