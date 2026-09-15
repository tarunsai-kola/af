/**
 * Shared enums and constants for all AIIENS HEALTH Mongoose models.
 * Single source of truth — import from here, never re-declare inline.
 */

// ─── User ─────────────────────────────────────────────────────────────────────

export const USER_STATUS = ['active', 'inactive', 'suspended', 'pending_verification'] as const;
export type UserStatus = (typeof USER_STATUS)[number];

export const USER_ROLE = [
  'PUBLIC_USER',
  'DONOR',
  'PATIENT_GUARDIAN',
  'HOSPITAL_VERIFIER',
  'CASE_OFFICER',
  'MEDICAL_REVIEWER',
  'FRAUD_REVIEWER',
  'CAMPAIGN_APPROVER',
  'FINANCE_OFFICER',
  'ADMIN',
  'SUPER_ADMIN'
] as const;
export type UserRole = (typeof USER_ROLE)[number];

export const CONSENT_STATUS = ['not_given', 'given', 'withdrawn', 'expired'] as const;
export type ConsentStatus = (typeof CONSENT_STATUS)[number];

// ─── Donor ────────────────────────────────────────────────────────────────────

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export const GENDER = ['male', 'female', 'other', 'prefer_not_to_say'] as const;
export type Gender = (typeof GENDER)[number];

export const DONOR_VERIFICATION_STATUS = ['unverified', 'pending', 'verified', 'rejected'] as const;
export type DonorVerificationStatus = (typeof DONOR_VERIFICATION_STATUS)[number];

export const DONOR_AVAILABILITY = ['available', 'unavailable', 'cooldown'] as const;
export type DonorAvailability = (typeof DONOR_AVAILABILITY)[number];

// ─── Patient Case ─────────────────────────────────────────────────────────────

export const DIAGNOSIS_CATEGORY = [
  'cardiac',
  'oncology',
  'orthopedic',
  'neurology',
  'pediatrics',
  'ophthalmology',
  'nephrology',
  'general_surgery',
  'maternity',
  'mental_health',
  'other',
] as const;
export type DiagnosisCategory = (typeof DIAGNOSIS_CATEGORY)[number];

export const CASE_STATUS = [
  'DRAFT',
  'DOCUMENTS_PENDING',
  'UNDER_VERIFICATION',
  'HOSPITAL_VERIFICATION_PENDING',
  'APPROVED',
  'LIVE',
  'PAUSED',
  'GOAL_REACHED',
  'TREATMENT_IN_PROGRESS',
  'COMPLETED',
  'CANCELLED'
] as const;
export type CaseStatus = (typeof CASE_STATUS)[number];

export const URGENCY = ['low', 'medium', 'high', 'critical'] as const;
export type Urgency = (typeof URGENCY)[number];

// ─── Hospital ─────────────────────────────────────────────────────────────────

export const HOSPITAL_VERIFICATION_STATUS = ['pending', 'verified', 'suspended', 'rejected'] as const;
export type HospitalVerificationStatus = (typeof HOSPITAL_VERIFICATION_STATUS)[number];

export const HOSPITAL_TYPE = ['government', 'private', 'trust', 'ngo_run', 'clinic'] as const;
export type HospitalType = (typeof HOSPITAL_TYPE)[number];

// ─── Medical Document ─────────────────────────────────────────────────────────

export const DOCUMENT_TYPE = [
  'diagnosis_report',
  'discharge_summary',
  'prescription',
  'lab_report',
  'imaging',
  'surgery_notes',
  'consent_form',
  'cost_estimate',
  'insurance_document',
  'id_proof',
  'other',
] as const;
export type DocumentType = (typeof DOCUMENT_TYPE)[number];

export const DOCUMENT_ACCESS_POLICY = ['private', 'case_team', 'hospital', 'admin_only'] as const;
export type DocumentAccessPolicy = (typeof DOCUMENT_ACCESS_POLICY)[number];

export const STORAGE_PROVIDER = ['local', 's3', 'gcs'] as const;
export type StorageProvider = (typeof STORAGE_PROVIDER)[number];

// ─── Campaign ─────────────────────────────────────────────────────────────────

export const CAMPAIGN_STATUS = [
  'draft',
  'pending_review',
  'active',
  'paused',
  'goal_reached',
  'closed',
  'rejected',
] as const;
export type CampaignStatus = (typeof CAMPAIGN_STATUS)[number];

// ─── Donation ─────────────────────────────────────────────────────────────────

export const DONATION_STATUS = ['pending', 'completed', 'failed', 'refunded', 'disputed'] as const;
export type DonationStatus = (typeof DONATION_STATUS)[number];

export const CURRENCY = ['INR', 'USD', 'GBP', 'EUR'] as const;
export type Currency = (typeof CURRENCY)[number];

// ─── Payment Transaction ──────────────────────────────────────────────────────

export const PAYMENT_STATUS = ['initiated', 'processing', 'captured', 'failed', 'refunded', 'voided'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export const PAYMENT_PROVIDER = ['stripe', 'razorpay', 'paytm', 'upi', 'bank_transfer'] as const;
export type PaymentProvider = (typeof PAYMENT_PROVIDER)[number];

// ─── Settlement ───────────────────────────────────────────────────────────────

export const SETTLEMENT_STATUS = [
  'SETTLEMENT_REQUESTED',
  'UNDER_REVIEW',
  'APPROVED',
  'COMPLETED',
  'RECONCILED'
] as const;
export type SettlementStatus = (typeof SETTLEMENT_STATUS)[number];

// ─── Medical Camp ─────────────────────────────────────────────────────────────

export const CAMP_STATUS = [
  'DRAFT',
  'SUBMITTED',
  'ORGANIZER_VERIFICATION',
  'PROVIDER_VERIFICATION',
  'LOCATION_CONFIRMATION',
  'APPROVED',
  'PUBLISHED',
  'REGISTRATION_OPEN',
  'COMPLETED',
  'CLOSED'
] as const;
export type CampStatus = (typeof CAMP_STATUS)[number];

export const CAMP_SERVICE = [
  'general_checkup',
  'blood_test',
  'eye_checkup',
  'dental',
  'vaccination',
  'bp_sugar_screening',
  'nutrition_counseling',
  'mental_health_screening',
  'gynecology',
  'pediatric_checkup',
] as const;
export type CampService = (typeof CAMP_SERVICE)[number];

export const CAMP_REGISTRATION_STATUS = ['registered', 'attended', 'absent', 'cancelled'] as const;
export type CampRegistrationStatus = (typeof CAMP_REGISTRATION_STATUS)[number];

// ─── Blood Request ────────────────────────────────────────────────────────────

export const BLOOD_REQUEST_STATUS = [
  'REQUEST_CREATED',
  'VALIDATING',
  'HOSPITAL_VERIFICATION_PENDING',
  'VERIFIED',
  'ACTIVE',
  'MATCHING',
  'RESOLVED',
  'FULFILLED',
  'CANCELLED',
  'CLOSED'
] as const;
export type BloodRequestStatus = (typeof BLOOD_REQUEST_STATUS)[number];

// ─── Consent ─────────────────────────────────────────────────────────────────

export const CONSENT_METHOD = ['app_click', 'signed_form', 'verbal_recorded', 'sms_otp'] as const;
export type ConsentMethod = (typeof CONSENT_METHOD)[number];

export const CONSENT_SUBJECT_TYPE = ['user', 'donor', 'patient', 'guardian', 'camp_participant'] as const;
export type ConsentSubjectType = (typeof CONSENT_SUBJECT_TYPE)[number];

// ─── Audit Event ──────────────────────────────────────────────────────────────

export const AUDIT_ACTION = [
  'create',
  'read',
  'update',
  'delete',
  'export',
  'LOGIN',
  'LOGOUT',
  'CASE_CREATED',
  'CASE_UPDATED',
  'DOCUMENT_UPLOADED',
  'DOCUMENT_ACCESSED',
  'HOSPITAL_VERIFIED',
  'CLINICAL_REVIEW_COMPLETED',
  'CAMPAIGN_APPROVED',
  'CAMPAIGN_PUBLISHED',
  'CAMPAIGN_PAUSED',
  'DONATION_CREATED',
  'PAYMENT_CONFIRMED',
  'PAYMENT_FAILED',
  'REFUND_CREATED',
  'SETTLEMENT_REQUESTED',
  'SETTLEMENT_APPROVED',
  'SETTLEMENT_COMPLETED',
  'DONOR_MATCHED',
  'CAMP_APPROVED',
  'RISK_FLAG_CREATED',
  'COMPLAINT_CREATED',
  'ROLE_CHANGED'
] as const;
export type AuditAction = (typeof AUDIT_ACTION)[number];

export const AUDIT_SOURCE = ['web', 'mobile', 'api', 'system', 'admin_panel', 'cron'] as const;
export type AuditSource = (typeof AUDIT_SOURCE)[number];

// ─── Notification ─────────────────────────────────────────────────────────────

export const NOTIFICATION_TYPE = [
  'campaign_update',
  'donation_received',
  'document_uploaded',
  'case_status_change',
  'camp_reminder',
  'blood_request_match',
  'settlement_processed',
  'complaint_update',
  'risk_flag_raised',
  'system_alert',
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPE)[number];

export const NOTIFICATION_CHANNEL = ['in_app', 'email', 'sms', 'push'] as const;
export type NotificationChannel = (typeof NOTIFICATION_CHANNEL)[number];

export const NOTIFICATION_STATUS = ['pending', 'sent', 'delivered', 'read', 'failed'] as const;
export type NotificationStatus = (typeof NOTIFICATION_STATUS)[number];

// ─── Complaint ────────────────────────────────────────────────────────────────

export const COMPLAINT_STATUS = ['open', 'under_review', 'resolved', 'rejected', 'escalated'] as const;
export type ComplaintStatus = (typeof COMPLAINT_STATUS)[number];

export const COMPLAINT_CATEGORY = [
  'fraud',
  'misuse_of_funds',
  'document_forgery',
  'privacy_violation',
  'service_quality',
  'discrimination',
  'other',
] as const;
export type ComplaintCategory = (typeof COMPLAINT_CATEGORY)[number];

// ─── Risk Flag ────────────────────────────────────────────────────────────────

export const RISK_TYPE = [
  'fraud_suspicion',
  'duplicate_identity',
  'document_forgery',
  'unusual_transaction',
  'sanctions_match',
  'multiple_campaigns',
  'rapid_withdrawal',
  'fake_medical_data',
] as const;
export type RiskType = (typeof RISK_TYPE)[number];

export const RISK_SEVERITY = ['low', 'medium', 'high', 'critical'] as const;
export type RiskSeverity = (typeof RISK_SEVERITY)[number];

export const RISK_STATUS = ['open', 'investigating', 'resolved', 'false_positive', 'escalated'] as const;
export type RiskStatus = (typeof RISK_STATUS)[number];

export const RISK_OBJECT_TYPE = [
  'User',
  'Campaign',
  'Donation',
  'PaymentTransaction',
  'Hospital',
  'MedicalDocument',
  'BloodRequest',
] as const;
export type RiskObjectType = (typeof RISK_OBJECT_TYPE)[number];
