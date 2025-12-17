/**
 * API Error Classes
 */

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class NetworkError extends APIError {
  constructor(message: string, endpoint?: string) {
    super(message, undefined, endpoint);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends APIError {
  constructor(endpoint?: string) {
    super('Request timeout', 408, endpoint);
    this.name = 'TimeoutError';
  }
}

export class NotFoundError extends APIError {
  constructor(endpoint?: string) {
    super('Resource not found', 404, endpoint);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends APIError {
  constructor(
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

/**
 * Check if error is an API error
 */
export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError;
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (isAPIError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
