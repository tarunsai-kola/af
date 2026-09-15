/**
 * Barrel export for all AIIENS HEALTH Mongoose models.
 * Import models from here rather than directly from individual files.
 *
 * @example
 * import { User, Campaign, Donation } from '@/models';
 */

export * from './constants';

export { User } from './User.model';
export type { IUser } from './User.model';

export { Role } from './Role.model';
export type { IRole } from './Role.model';

export { Donor } from './Donor.model';
export type { IDonor, IDonorContact, IDonorEligibility, IDonorConsent } from './Donor.model';

export { Hospital } from './Hospital.model';
export type { IHospital, IHospitalAddress, IHospitalContact, IAuthorizedContact } from './Hospital.model';

export { PatientCase } from './PatientCase.model';
export type { IPatientCase, ITreatmentPlan, ICostBreakdown } from './PatientCase.model';

export { MedicalDocument } from './MedicalDocument.model';
export type { IMedicalDocument } from './MedicalDocument.model';

export { Campaign } from './Campaign.model';
export type { ICampaign } from './Campaign.model';

export { Donation } from './Donation.model';
export type { IDonation } from './Donation.model';

export { PaymentTransaction } from './PaymentTransaction.model';
export type { IPaymentTransaction } from './PaymentTransaction.model';

export { Settlement } from './Settlement.model';
export type { ISettlement } from './Settlement.model';

export { MedicalCamp } from './MedicalCamp.model';
export type { IMedicalCamp, ICampLocation, ICampProvider } from './MedicalCamp.model';

export { CampRegistration } from './CampRegistration.model';
export type { ICampRegistration } from './CampRegistration.model';

export { BloodRequest } from './BloodRequest.model';
export type { IBloodRequest } from './BloodRequest.model';

export { Consent } from './Consent.model';
export type { IConsent } from './Consent.model';

export { AuditEvent } from './AuditEvent.model';
export type { IAuditEvent } from './AuditEvent.model';

export { Notification } from './Notification.model';
export type { INotification } from './Notification.model';

export { Complaint } from './Complaint.model';
export type { IComplaint } from './Complaint.model';

export { RiskFlag } from './RiskFlag.model';
export type { IRiskFlag } from './RiskFlag.model';

export { FamilyMember } from './FamilyMember.model';
export type { IFamilyMember } from './FamilyMember.model';
