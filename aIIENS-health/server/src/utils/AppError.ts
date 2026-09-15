/**
 * Application-level error class.
 * Throw this anywhere in the app to send a structured HTTP error response.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: { field: string; message: string }[];

  constructor(
    message: string,
    statusCode: number = 500,
    errors?: { field: string; message: string }[],
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;

    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
