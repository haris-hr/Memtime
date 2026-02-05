import { ref } from 'vue';
import type { TimeEntry } from '../types';
import { deleteTimeEntry } from '../api/services';
import { ERROR_MESSAGES } from '../config/error-messages';

/**
 * Composable for handling time entry deletion with confirmation modal
 * 
 * Supports two modes:
 * 1. Entry mode: Pass a TimeEntry object (for list views)
 * 2. ID mode: Pass just an ID (for edit forms)
 * 
 * Usage:
 * const { showModal, confirmDelete, handleDelete, ... } = useDeleteTimeEntry(onSuccess);
 */
export function useDeleteTimeEntry(onSuccess: () => void | Promise<void>) {
  const showModal = ref(false);
  const entryToDelete = ref<TimeEntry | null>(null);
  const idToDelete = ref<number | null>(null);
  const isDeleting = ref(false);
  const error = ref<string | null>(null);

  /**
   * Open delete confirmation modal for an entry (list view)
   */
  function confirmDelete(entry: TimeEntry, event?: Event) {
    event?.stopPropagation(); // Prevent row click from triggering edit
    entryToDelete.value = entry;
    idToDelete.value = entry.id;
    showModal.value = true;
    error.value = null;
  }

  /**
   * Open delete confirmation modal by ID (edit form)
   */
  function confirmDeleteById(id: number) {
    idToDelete.value = id;
    entryToDelete.value = null;
    showModal.value = true;
    error.value = null;
  }

  /**
   * Close the confirmation modal without deleting
   */
  function cancelDelete() {
    showModal.value = false;
    entryToDelete.value = null;
    idToDelete.value = null;
  }

  /**
   * Execute the delete operation
   */
  async function handleDelete() {
    if (idToDelete.value === null || isDeleting.value) return;

    isDeleting.value = true;
    error.value = null;

    try {
      await deleteTimeEntry(idToDelete.value);
      showModal.value = false;
      entryToDelete.value = null;
      idToDelete.value = null;
      await onSuccess();
    } catch (err) {
      error.value = err instanceof Error ? err.message : ERROR_MESSAGES.deleteTimeEntry;
    } finally {
      isDeleting.value = false;
    }
  }

  /**
   * Clear the error message
   */
  function clearError() {
    error.value = null;
  }

  return {
    showModal,
    entryToDelete,
    idToDelete,
    isDeleting,
    error,
    confirmDelete,
    confirmDeleteById,
    cancelDelete,
    handleDelete,
    clearError,
  };
}
