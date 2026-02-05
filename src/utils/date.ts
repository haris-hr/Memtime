/**
 * Date and time formatting utilities
 * Centralized date handling for the entire app
 */

// ============================================================================
// Constants
// ============================================================================

/** Fallback string for invalid dates */
export const INVALID_DATE_FALLBACK = '—';

/** Time conversion constants */
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;

// ============================================================================
// Types
// ============================================================================

/**
 * Branded type for ISO 8601 date strings
 * Provides compile-time safety for date string handling
 */
export type ISODateString = string & { readonly __brand: 'ISODateString' };

/**
 * Type guard to check if a string is a valid ISO date string
 */
export function isISODateString(value: string): value is ISODateString {
  const date = new Date(value);
  return isValidDate(date);
}

/**
 * Safely create an ISODateString from a regular string
 * Returns null if the string is not a valid date
 */
export function toISODateString(value: string): ISODateString | null {
  if (isISODateString(value)) {
    return value;
  }
  return null;
}

// ============================================================================
// Internal Helpers
// ============================================================================

/**
 * Get the user's preferred locale from the browser
 * Falls back to 'en-US' if not available
 */
function getUserLocale(): string {
  return navigator.language || 'en-US';
}

/**
 * Check if a date is valid
 */
function isValidDate(date: Date): boolean {
  return !isNaN(date.getTime());
}

// ============================================================================
// Formatting Functions
// ============================================================================

/**
 * Format ISO string to readable date (e.g., "Jan 15, 2024")
 * Uses the user's browser locale for localization
 * Returns fallback string for invalid dates
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  if (!isValidDate(date)) return INVALID_DATE_FALLBACK;
  
  return date.toLocaleDateString(getUserLocale(), {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format ISO string to readable time (e.g., "09:30 AM")
 * Uses the user's browser locale for localization
 * Returns fallback string for invalid dates
 */
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  if (!isValidDate(date)) return INVALID_DATE_FALLBACK;
  
  return date.toLocaleTimeString(getUserLocale(), {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format ISO string to readable date and time (e.g., "Jan 15, 2024 at 09:30 AM")
 * Uses the user's browser locale for localization
 * Returns fallback string for invalid dates
 */
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  if (!isValidDate(date)) return INVALID_DATE_FALLBACK;
  
  return `${formatDate(isoString)} at ${formatTime(isoString)}`;
}

/**
 * Calculate and format duration between two ISO strings
 * Returns formatted string like "2h 30m" or "45m"
 * Returns "Invalid range" for negative durations (end before start)
 * Returns fallback for invalid dates
 */
export function formatDuration(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return INVALID_DATE_FALLBACK;
  }
  
  const diffMs = endDate.getTime() - startDate.getTime();

  if (diffMs < 0) return 'Invalid range';
  if (diffMs === 0) return '0m';

  const MS_PER_DAY = MS_PER_HOUR * 24;
  const days = Math.floor(diffMs / MS_PER_DAY);
  const hours = Math.floor((diffMs % MS_PER_DAY) / MS_PER_HOUR);
  const minutes = Math.floor((diffMs % MS_PER_HOUR) / MS_PER_MINUTE);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);

  return parts.join(' ');
}

// ============================================================================
// Conversion Functions
// ============================================================================

/**
 * Convert ISO string to local datetime-local input format
 * Returns empty string for invalid dates
 */
export function toLocalDatetime(isoString: string): string {
  const date = new Date(isoString);
  if (!isValidDate(date)) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Convert local datetime-local input value to ISO string
 * Returns empty string for invalid dates
 */
export function toISOString(localDatetime: string): string {
  const date = new Date(localDatetime);
  if (!isValidDate(date)) return '';
  return date.toISOString();
}
