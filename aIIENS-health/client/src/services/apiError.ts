import axios, { AxiosError } from 'axios';
import { ApiError, ApiErrorResponse } from '@/types';

/**
 * Extracts a structured ApiError from any thrown value.
 * Works with Axios errors (with our API envelope) and plain errors.
 */
export function extractApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const responseData = axiosError.response?.data;

    if (responseData && !responseData.success) {
      return {
        message: responseData.message,
        statusCode: axiosError.response?.status,
        errors: responseData.errors,
      };
    }

    // Network error or no response
    if (!axiosError.response) {
      return {
        message: 'Network error — check your connection',
        statusCode: 0,
      };
    }

    return {
      message: axiosError.message,
      statusCode: axiosError.response?.status,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: 'An unexpected error occurred' };
}

/**
 * Returns the user-facing error message from any thrown value.
 */
export function getErrorMessage(error: unknown): string {
  return extractApiError(error).message;
}
