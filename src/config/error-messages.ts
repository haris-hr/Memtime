// Error messages for API responses
// Centralized error handling messages

export const ERROR_MESSAGES = {
  // HTTP Status Errors
  badRequest: 'Invalid request. Please check your input.',
  notFound: 'The requested resource was not found.',
  rateLimited: 'Too many requests. Please wait a moment and try again.',
  serverError: 'Server error. Please try again later.',
  
  // Network Errors
  networkError: 'Network error. Please check your connection.',
  
  // Generic
  generic: 'An error occurred',

  // Resource Loading Errors
  loadClients: 'Failed to load clients',
  loadProjects: 'Failed to load projects',
  loadTasks: 'Failed to load tasks',
  loadTimeEntries: 'Failed to load time entries',
  loadTimeEntry: 'Failed to load time entry',
  saveTimeEntry: 'Failed to save time entry',
  deleteTimeEntry: 'Failed to delete time entry',
  loadItems: 'Failed to load items',

  // Context-specific not found errors
  taskNotFound: 'Task not found. Please check the Task ID and try again.',
  timeEntryNotFound: 'Time entry not found. It may have been deleted.',
} as const;

// Map HTTP status codes to error messages
export const STATUS_ERROR_MAP: Record<number, string> = {
  400: ERROR_MESSAGES.badRequest,
  404: ERROR_MESSAGES.notFound,
  429: ERROR_MESSAGES.rateLimited,
  500: ERROR_MESSAGES.serverError,
};

/**
 * Extract error message from caught error
 * Works with both standard Error and ApiError instances
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

/**
 * Type guard to check if error is an API error with status
 */
export function isApiError(error: unknown): error is Error & { status: number; isApiError: true } {
  return error instanceof Error && 'isApiError' in error && (error as any).isApiError === true;
}

/**
 * Check if error is a rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
  return isApiError(error) && 'isRateLimited' in error && (error as any).isRateLimited === true;
}
