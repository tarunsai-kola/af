/**
 * Shared TypeScript types and API response envelope types for the AIIENS HEALTH API.
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
  stack?: string; // only in development
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

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// ─── Validation / Field Errors ────────────────────────────────────────────────

export interface FieldError {
  field: string;
  message: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

import { UserRole } from '../models/constants';

export interface JwtPayload {
  userId: string;
  roles: UserRole[];
  sessionId?: string; // For refresh token rotation
  iat?: number;
  exp?: number;
}


// ─── File / Upload ────────────────────────────────────────────────────────────

export interface StoredFile {
  originalName: string;
  storedName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  provider: 'local' | 's3' | 'gcs';
}
