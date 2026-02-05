/**
 * Form validation messages
 * Centralized validation error text
 */

export const VALIDATION_MESSAGES = {
  taskIdRequired: 'Task ID is required and must be a positive number',
  commentRequired: 'Comment is required',
  startRequired: 'Start date/time is required',
  endRequired: 'End date/time is required',
  endAfterStart: 'End time must be after start time',
} as const;
