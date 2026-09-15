import { Schema, model, Document, Types } from 'mongoose';
import {
  DIAGNOSIS_CATEGORY,
  CASE_STATUS,
  URGENCY,
  DiagnosisCategory,
  CaseStatus,
  Urgency,
} from './constants';

// ─── Sub-document Interfaces ──────────────────────────────────────────────────

export interface ITreatmentPlan {
  description: string;
  procedureName: string;
  estimatedDurationDays?: number;
  treatingDoctorName?: string;
  treatingDoctorRegistrationNumber?: string;
}

export interface ICostBreakdown {
  category: string;     // e.g. 'surgery', 'medications', 'physiotherapy'
  amount: number;
  currency: string;
}

export type GateStatus = 'PENDING' | 'IN_REVIEW' | 'PASSED' | 'FAILED' | 'NEEDS_MORE_INFORMATION';
export type GateName = 'G1_IDENTITY' | 'G2_HOSPITAL' | 'G3_CLINICAL' | 'G4_FINANCIAL_NEED' | 'G5_CONSENT' | 'G6_INTEGRITY' | 'G7_FINANCE' | 'G8_PUBLICATION';

export interface IVerificationGate {
  gate: GateName;
  status: GateStatus;
  reviewerId?: Types.ObjectId;
  notes?: string;
  evidence?: string;
  completedAt?: Date;
}

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IPatientCase extends Document {
  _id: Types.ObjectId;
  patientUserId?: Types.ObjectId;        // Ref: User (if patient has account)
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  patientRelation?: string;
  guardianUserId: Types.ObjectId;        // Ref: User (guardian/applicant — required)
  hospitalId: Types.ObjectId;            // Ref: Hospital
  diagnosisCategory: DiagnosisCategory;
  diagnosisDescription: string;
  treatmentPlan: ITreatmentPlan;
  estimatedCost: number;
  currency: string;
  costBreakdown: ICostBreakdown[];
  fundraisingTarget: number;
  urgency: Urgency;
  status: CaseStatus;
  assignedOfficerId?: Types.ObjectId;    // Ref: User (field officer)
  verificationGates: IVerificationGate[];
  reviewNotes?: string;
  rejectionReason?: string;
  approvedAt?: Date;
  closedAt?: Date;
  closureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const TreatmentPlanSchema = new Schema<ITreatmentPlan>(
  {
    description: { type: String, trim: true, default: '' },
    procedureName: { type: String, trim: true, default: '' },
    estimatedDurationDays: { type: Number, min: 0 },
    treatingDoctorName: { type: String, trim: true },
    treatingDoctorRegistrationNumber: { type: String, trim: true },
  },
  { _id: false },
);

const CostBreakdownSchema = new Schema<ICostBreakdown>(
  {
    category: { type: String, trim: true },
    amount: { type: Number, min: 0 },
    currency: { type: String, default: 'INR' },
  },
  { _id: false },
);

const VerificationGateSchema = new Schema<IVerificationGate>(
  {
    gate: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'IN_REVIEW', 'PASSED', 'FAILED', 'NEEDS_MORE_INFORMATION'], default: 'PENDING' },
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String, trim: true },
    evidence: { type: String, trim: true },
    completedAt: { type: Date },
  },
  { _id: false },
);

// ─── Main Schema ──────────────────────────────────────────────────────────────

const PatientCaseSchema = new Schema<IPatientCase>(
  {
    patientUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    
    patientName: { type: String, trim: true, default: '' },
    patientAge: { type: Number, min: 0 },
    patientGender: { type: String, enum: ['male', 'female', 'other'] },
    patientRelation: { type: String, trim: true, default: '' },

    guardianUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Guardian/applicant user reference is required'],
      index: true,
    },

    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      index: true,
      default: null,
    },

    diagnosisCategory: {
      type: String,
      enum: { values: DIAGNOSIS_CATEGORY, message: '{VALUE} is not a valid diagnosis category' },
      index: true,
      default: 'other',
    },

    diagnosisDescription: {
      type: String,
      trim: true,
      maxlength: [2000, 'Diagnosis description must not exceed 2000 characters'],
      default: '',
    },

    treatmentPlan: {
      type: TreatmentPlanSchema,
      default: () => ({ description: '', procedureName: '' }),
    },

    estimatedCost: {
      type: Number,
      min: [0, 'Cost cannot be negative'],
      default: 0,
    },

    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
    },

    costBreakdown: {
      type: [CostBreakdownSchema],
      default: [],
    },

    fundraisingTarget: {
      type: Number,
      min: [0, 'Fundraising target cannot be negative'],
      default: 0,
    },

    urgency: {
      type: String,
      enum: { values: URGENCY, message: '{VALUE} is not a valid urgency level' },
      index: true,
      default: 'medium',
    },

    status: {
      type: String,
      enum: { values: CASE_STATUS, message: '{VALUE} is not a valid case status' },
      default: 'DRAFT',
      index: true,
    },

    assignedOfficerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: { sparse: true },
    },

    verificationGates: {
      type: [VerificationGateSchema],
      default: [
        { gate: 'G1_IDENTITY', status: 'PENDING' },
        { gate: 'G2_HOSPITAL', status: 'PENDING' },
        { gate: 'G3_CLINICAL', status: 'PENDING' },
        { gate: 'G4_FINANCIAL_NEED', status: 'PENDING' },
        { gate: 'G5_CONSENT', status: 'PENDING' },
        { gate: 'G6_INTEGRITY', status: 'PENDING' },
        { gate: 'G7_FINANCE', status: 'PENDING' },
        { gate: 'G8_PUBLICATION', status: 'PENDING' },
      ]
    },

    reviewNotes: { type: String, trim: true, default: null },
    rejectionReason: { type: String, trim: true, default: null },
    approvedAt: { type: Date, default: null },
    closedAt: { type: Date, default: null },
    closureReason: { type: String, trim: true, default: null },
  },
  {
    timestamps: true,
    collection: 'patient_cases',
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

PatientCaseSchema.index({ status: 1, urgency: 1, createdAt: -1 });
PatientCaseSchema.index({ guardianUserId: 1, status: 1 });
PatientCaseSchema.index({ hospitalId: 1, status: 1 });
PatientCaseSchema.index({ assignedOfficerId: 1, status: 1 });

// ─── Model ────────────────────────────────────────────────────────────────────

export const PatientCase = model<IPatientCase>('PatientCase', PatientCaseSchema);
