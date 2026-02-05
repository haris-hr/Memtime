/**
 * Custom API error class
 * Provides typed error properties instead of `as any` assertions
 */
export class ApiError extends Error {
  readonly isApiError = true;
  readonly status: number;
  readonly isRateLimited: boolean;
  readonly isNetworkError: boolean;

  constructor(
    message: string,
    status: number,
    isRateLimited: boolean = false,
    isNetworkError: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isRateLimited = isRateLimited;
    this.isNetworkError = isNetworkError;
    
    // Maintains proper stack trace in V8 environments (Chrome, Node)
    if ('captureStackTrace' in Error) {
      (Error as any).captureStackTrace(this, ApiError);
    }
  }

  /**
   * Create an ApiError from an HTTP response error
   */
  static fromResponse(status: number, message: string): ApiError {
    return new ApiError(message, status, status === 429);
  }

  /**
   * Create a network error (no response received)
   */
  static networkError(message: string): ApiError {
    return new ApiError(message, 0, false, true);
  }
}
