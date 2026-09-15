import { AuditEvent } from '../models/AuditEvent.model';
import { Types } from 'mongoose';
import { AuditAction, AuditSource } from '../models/constants';
import { logger } from '../config/logger';

interface AuditLogParams {
  actorUserId?: string | Types.ObjectId;
  actorRole?: string;
  action: AuditAction;
  objectType: string;
  objectId?: string | Types.ObjectId;
  beforeSnapshot?: any;
  afterSnapshot?: any;
  changeSummary: string;
  source: AuditSource;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Safely strips heavy/sensitive data before JSON stringification.
 */
const safeSnapshot = (data: any): string | undefined => {
  if (!data) return undefined;
  
  // Clone to avoid mutating original objects
  let clean = data;
  if (typeof data.toObject === 'function') {
    clean = data.toObject();
  } else if (typeof data === 'object') {
    clean = JSON.parse(JSON.stringify(data));
  }

  // Strip obvious sensitive fields if they exist in the snapshot
  const sensitiveKeys = ['password', 'aadharNumber', 'panNumber', 'documents', 'medicalHistory', 'rawReports'];
  
  const stripSensitive = (obj: any) => {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
      if (sensitiveKeys.includes(key)) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object') {
        stripSensitive(obj[key]);
      }
    }
  };

  stripSensitive(clean);
  return JSON.stringify(clean);
};

export const auditService = {
  log: async (params: AuditLogParams): Promise<void> => {
    try {
      await AuditEvent.create({
        actorUserId: params.actorUserId,
        actorRole: params.actorRole,
        action: params.action,
        objectType: params.objectType,
        objectId: params.objectId,
        beforeSnapshot: safeSnapshot(params.beforeSnapshot),
        afterSnapshot: safeSnapshot(params.afterSnapshot),
        changeSummary: params.changeSummary,
        source: params.source,
        requestId: params.requestId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      });
    } catch (error) {
      // We don't want an audit log failure to crash the main transaction,
      // but we do need to log it securely in the console.
      logger.error({ error, params }, 'Failed to create audit log');
    }
  }
};
