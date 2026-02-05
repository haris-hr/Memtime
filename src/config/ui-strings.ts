/**
 * UI text strings
 * Centralized user-facing text for consistency and easy updates
 */

// Page titles and descriptions
export const PAGE_TITLES = {
  hierarchy: 'Overview',
  hierarchyDescription: 'Your clients, projects, and tasks.',
  timeEntries: 'Time Entries',
  timeEntriesDescription: 'View and manage your tracked time. Click a row to edit.',
  newTimeEntry: 'New Time Entry',
  editTimeEntry: 'Edit Time Entry',
  newTimeEntryDescription: 'Fill in the details to create a new time entry.',
  editTimeEntryDescription: 'Update the details of your time entry below.',
  notFound: 'Page Not Found',
  notFoundDescription: "The page you're looking for doesn't exist or has been moved.",
} as const;

// Loading states
export const LOADING_TEXT = {
  clients: 'Loading clients...',
  timeEntries: 'Loading time entries...',
  timeEntry: 'Loading time entry...',
} as const;

// Empty states
export const EMPTY_STATES = {
  noClients: 'No clients found',
  noClientsDescription: 'There are no clients available at the moment.',
  noProjects: 'No projects found',
  noTasks: 'No tasks found',
  noTimeEntries: 'No time entries yet',
  noTimeEntriesDescription: 'Start tracking your work by creating your first time entry.',
} as const;

// Form labels and placeholders
export const FORM_LABELS = {
  taskId: 'Task ID',
  taskIdPlaceholder: 'Enter task ID (e.g., 1)',
  taskIdHint: "Don't know the Task ID?",
  taskIdHintLink: 'Browse tasks in the Overview',
  comment: 'Comment',
  commentPlaceholder: 'Describe what you worked on...',
  startTime: 'Start Time',
  endTime: 'End Time',
} as const;

// Button labels
export const BUTTON_LABELS = {
  newEntry: 'New Entry',
  createEntry: 'Create Entry',
  updateEntry: 'Update Entry',
  createTimeEntry: 'Create Time Entry',
  delete: 'Delete',
  cancel: 'Cancel',
  save: 'Save',
  retry: 'Try Again',
  retryShort: 'Retry',
  previous: 'Previous',
  next: 'Next',
  backToHome: 'Back to Home',
  backToTimeEntries: 'Back to Time Entries',
} as const;

// Error component text
export const ERROR_TEXT = {
  title: 'Something went wrong',
} as const;

// Confirmation dialogs
export const CONFIRM_DIALOGS = {
  deleteTimeEntry: {
    title: 'Delete Time Entry',
    message: 'Are you sure you want to delete this time entry? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
  },
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  timeEntryCreated: (id: number) => `Time entry #${id} created successfully!`,
  timeEntryUpdated: (id: number) => `Time entry #${id} updated successfully!`,
} as const;

// Accessibility labels
export const A11Y_LABELS = {
  mainNav: 'Main navigation',
  skipToContent: 'Skip to main content',
  clientsList: 'Clients',
  timeEntriesList: 'Time entries list',
  timeRange: 'Time range',
  expandClient: (name: string, status: string, expanded: boolean) => 
    `${name}, ${status}. Click to ${expanded ? 'collapse' : 'expand'}`,
  expandProject: (name: string, status: string, expanded: boolean) => 
    `${name}, ${status}. Click to ${expanded ? 'collapse' : 'expand'}`,
  taskItem: (name: string, id: number, status: string) => 
    `Task: ${name}, ID: ${id}, Status: ${status}`,
  timeEntryRow: (id: number, taskId: number, comment: string) => 
    `Time entry ${id}, Task ${taskId}, ${comment || 'No comment'}`,
} as const;

// Table headers
export const TABLE_HEADERS = {
  id: 'ID',
  task: 'Task',
  comment: 'Comment',
  time: 'Time',
  duration: 'Duration',
  created: 'Created',
  actions: 'Actions',
} as const;
