import { Schema, model, Document, Types } from 'mongoose';
import {
  DOCUMENT_TYPE,
  DOCUMENT_ACCESS_POLICY,
  STORAGE_PROVIDER,
  DocumentType,
  DocumentAccessPolicy,
  StorageProvider,
} from './constants';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IMedicalDocument extends Document {
  _id: Types.ObjectId;
  caseId: Types.ObjectId;              // Ref: PatientCase
  uploadedBy: Types.ObjectId;          // Ref: User
  documentType: DocumentType;
  issuerName: string;                  // e.g. hospital name / lab name
  issuerRegistrationNumber?: string;
  /**
   * SECURITY: storageKey is a private object-storage path (e.g. S3 key).
   * It is NEVER returned directly to the client — the API resolves a
   * short-lived signed URL via the storage service layer before responding.
   */
  storageKey: string;
  storageProvider: StorageProvider;
  /**
   * SHA-256 hex digest of the original file, computed server-side before upload.
   * Used to detect tampering or duplicate uploads.
   */
  fileHash: string;
  mimeType: string;
  fileSizeBytes: number;
  originalFileName: string;
  /**
   * Version counter — incremented on each re-upload for the same document type
   * on the same case. Previous versions are retained and not deleted.
   */
  version: number;
  accessPolicy: DocumentAccessPolicy;
  isVerified: boolean;
  verifiedBy?: Types.ObjectId;         // Ref: User (admin/officer)
  verifiedAt?: Date;
  verificationNotes?: string;
  isArchived: boolean;
  archivedAt?: Date;
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const MedicalDocumentSchema = new Schema<IMedicalDocument>(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: 'PatientCase',
      required: [true, 'Case reference is required'],
      index: true,
    },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader reference is required'],
    },

    documentType: {
      type: String,
      required: [true, 'Document type is required'],
      enum: { values: DOCUMENT_TYPE, message: '{VALUE} is not a valid document type' },
      index: true,
    },

    issuerName: {
      type: String,
      required: [true, 'Issuer name is required'],
      trim: true,
      maxlength: [200, 'Issuer name must not exceed 200 characters'],
    },

    issuerRegistrationNumber: {
      type: String,
      trim: true,
      default: null,
    },

    storageKey: {
      type: String,
      required: [true, 'Storage key is required'],
      select: false,   // NEVER returned in API responses — accessed only via storage service
    },

    storageProvider: {
      type: String,
      required: [true, 'Storage provider is required'],
      enum: { values: STORAGE_PROVIDER, message: '{VALUE} is not a valid storage provider' },
      select: false,
    },

    fileHash: {
      type: String,
      required: [true, 'File hash is required'],
      trim: true,
      select: false,
    },

    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      match: [/^[\w-]+\/[\w.-]+$/, 'Invalid MIME type format'],
    },

    fileSizeBytes: {
      type: Number,
      required: [true, 'File size is required'],
      min: [1, 'File size must be greater than 0'],
      max: [52428800, 'File size must not exceed 50 MB'],
    },

    originalFileName: {
      type: String,
      required: [true, 'Original file name is required'],
      trim: true,
      maxlength: [255, 'File name must not exceed 255 characters'],
    },

    version: {
      type: Number,
      required: true,
      min: [1, 'Version must be at least 1'],
      default: 1,
    },

    accessPolicy: {
      type: String,
      required: [true, 'Access policy is required'],
      enum: { values: DOCUMENT_ACCESS_POLICY, message: '{VALUE} is not a valid access policy' },
      default: 'case_team',
      index: true,
    },

    isVerified: { type: Boolean, default: false, index: true },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    verifiedAt: { type: Date, default: null },
    verificationNotes: { type: String, trim: true, default: null },

    isArchived: { type: Boolean, default: false, index: true },
    archivedAt: { type: Date, default: null },

    uploadedAt: { type: Date, required: true, default: Date.now },
  },
  {
    timestamps: true,
    collection: 'medical_documents',
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

MedicalDocumentSchema.index({ caseId: 1, documentType: 1, version: -1 });
MedicalDocumentSchema.index({ caseId: 1, isArchived: 1 });
MedicalDocumentSchema.index({ uploadedBy: 1, createdAt: -1 });

// ─── Model ────────────────────────────────────────────────────────────────────

export const MedicalDocument = model<IMedicalDocument>('MedicalDocument', MedicalDocumentSchema);
