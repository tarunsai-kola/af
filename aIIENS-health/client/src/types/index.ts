/**
 * Shared TypeScript types used across the AIIENS HEALTH client.
 */

// ─── API Response Envelope ────────────────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: FieldError[];
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ─── Errors ───────────────────────────────────────────────────────────────────

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: FieldError[];
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'PUBLIC_USER' | 'DONOR' | 'PATIENT_GUARDIAN' | 'HOSPITAL_VERIFIER' | 'CASE_OFFICER' | 'MEDICAL_REVIEWER' | 'FRAUD_REVIEWER' | 'CAMPAIGN_APPROVER' | 'FINANCE_OFFICER' | 'FINANCE_ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  isDonor?: boolean;
  roles: UserRole[];
  avatarUrl?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
