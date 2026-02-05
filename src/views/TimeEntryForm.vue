<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { TimeEntryPayload } from '../types';
import { getTimeEntry, createTimeEntry, updateTimeEntry } from '../api/services';
import { toLocalDatetime, toISOString, formatDuration } from '../utils/date';
import { ERROR_MESSAGES, getErrorMessage, isApiError } from '../config/error-messages';
import { useDeleteTimeEntry } from '../composables/useDeleteTimeEntry';
import { PAGE_TITLES, LOADING_TEXT, FORM_LABELS, BUTTON_LABELS, CONFIRM_DIALOGS, SUCCESS_MESSAGES, A11Y_LABELS } from '../config/ui-strings';
import { VALIDATION_MESSAGES } from '../config/validation-messages';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import ErrorMessage from '../components/ErrorMessage.vue';
import Icon from '../components/Icon.vue';
import ConfirmModal from '../components/ConfirmModal.vue';

const route = useRoute();
const router = useRouter();

// Determine if we're in edit mode
const entryId = computed(() => {
  const id = route.params.id;
  if (id === undefined || id === null || id === '') return null;
  const parsed = parseInt(String(id), 10);
  // Allow ID 0 - API uses 0-based IDs
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
});
const isEditMode = computed(() => entryId.value !== null);

// Form state
const taskId = ref<number | null>(null);
const comment = ref('');
const startDate = ref('');
const endDate = ref('');

// Original values for change detection (edit mode only)
const originalValues = ref<{
  taskId: number | null;
  comment: string;
  startDate: string;
  endDate: string;
} | null>(null);

// Check if form has changes from original values
const hasChanges = computed(() => {
  if (!isEditMode.value || !originalValues.value) return true;
  
  return (
    taskId.value !== originalValues.value.taskId ||
    comment.value !== originalValues.value.comment ||
    startDate.value !== originalValues.value.startDate ||
    endDate.value !== originalValues.value.endDate
  );
});

// UI state
const isLoading = ref(false);
const isSaving = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// Delete functionality - navigate away after successful delete
const {
  showModal: showDeleteConfirm,
  isDeleting,
  error: deleteError,
  confirmDeleteById,
  cancelDelete: closeDeleteConfirm,
  handleDelete,
  clearError: clearDeleteError,
} = useDeleteTimeEntry(async () => {
  await router.push('/time-entries');
});

function openDeleteConfirm() {
  if (entryId.value !== null) {
    confirmDeleteById(entryId.value);
  }
}

// Validation
const validationErrors = ref<Record<string, string>>({});

function validate(): boolean {
  validationErrors.value = {};
  
  if (!taskId.value || taskId.value <= 0) {
    validationErrors.value.taskId = VALIDATION_MESSAGES.taskIdRequired;
  }
  
  if (!comment.value.trim()) {
    validationErrors.value.comment = VALIDATION_MESSAGES.commentRequired;
  }
  
  if (!startDate.value) {
    validationErrors.value.start = VALIDATION_MESSAGES.startRequired;
  }
  
  if (!endDate.value) {
    validationErrors.value.end = VALIDATION_MESSAGES.endRequired;
  }
  
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    if (end <= start) {
      validationErrors.value.end = VALIDATION_MESSAGES.endAfterStart;
    }
  }
  
  return Object.keys(validationErrors.value).length === 0;
}

async function loadEntry() {
  if (entryId.value === null) return;
  
  isLoading.value = true;
  error.value = null;
  
  try {
    const entry = await getTimeEntry(entryId.value);
    taskId.value = entry.taskId;
    comment.value = entry.comment;
    startDate.value = toLocalDatetime(entry.start);
    endDate.value = toLocalDatetime(entry.end);
    
    // Store original values for change detection
    originalValues.value = {
      taskId: entry.taskId,
      comment: entry.comment,
      startDate: startDate.value,
      endDate: endDate.value,
    };
  } catch (e) {
    error.value = getErrorMessage(e, ERROR_MESSAGES.loadTimeEntry);
  } finally {
    isLoading.value = false;
  }
}

async function handleSubmit() {
  // Prevent double-submission while request is in progress
  if (isSaving.value) return;
  if (!validate()) return;
  
  isSaving.value = true;
  error.value = null;
  successMessage.value = null;
  
  // NOTE: Input sanitization (XSS prevention) should be handled server-side.
  // Vue's template system escapes output by default, but the API must also
  // validate and sanitize all user input before storing/returning it.
  const payload: TimeEntryPayload = {
    taskId: taskId.value!,
    comment: comment.value.trim(),
    start: toISOString(startDate.value),
    end: toISOString(endDate.value),
  };
  
  try {
    if (isEditMode.value) {
      const updated = await updateTimeEntry(entryId.value!, payload);
      successMessage.value = SUCCESS_MESSAGES.timeEntryUpdated(updated.id);
      // Update original values so hasChanges becomes false after save
      originalValues.value = {
        taskId: payload.taskId,
        comment: payload.comment,
        startDate: startDate.value,
        endDate: endDate.value,
      };
    } else {
      const created = await createTimeEntry(payload);
      successMessage.value = SUCCESS_MESSAGES.timeEntryCreated(created.id);
      // Clear form after successful create
      taskId.value = null;
      comment.value = '';
      startDate.value = '';
      endDate.value = '';
    }
  } catch (e) {
    // Provide helpful message for common errors
    if (isApiError(e) && e.status === 404) {
      // 404 during save usually means the Task ID doesn't exist
      error.value = ERROR_MESSAGES.taskNotFound;
    } else {
      error.value = getErrorMessage(e, ERROR_MESSAGES.saveTimeEntry);
    }
  } finally {
    isSaving.value = false;
  }
}


function goBack() {
  router.push('/time-entries');
}

// Calculate duration preview
const durationPreview = computed(() => {
  if (!startDate.value || !endDate.value) return null;
  
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  
  if (end <= start) return null;
  
  return formatDuration(startDate.value, endDate.value);
});

// Watch for route param changes - handles both initial mount and navigation between entries
watch(
  () => route.params.id,
  () => {
    if (isEditMode.value) {
      loadEntry();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="time-entry-form-view">
    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <Icon name="arrowLeft" :size="20" />
        {{ BUTTON_LABELS.backToTimeEntries }}
      </button>
      <div class="page-header-content">
        <div class="page-header-icon">
          <Icon name="clockPlus" :size="28" />
        </div>
        <div>
          <h2>{{ isEditMode ? PAGE_TITLES.editTimeEntry : PAGE_TITLES.newTimeEntry }}</h2>
          <p class="page-description">
            {{ isEditMode ? PAGE_TITLES.editTimeEntryDescription : PAGE_TITLES.newTimeEntryDescription }}
          </p>
        </div>
      </div>
    </div>
    
    <div v-if="isLoading" class="loading-state">
      <LoadingSpinner size="lg" :text="LOADING_TEXT.timeEntry" />
    </div>
    
    <div v-else class="card">
      <div class="card-body">
        <!-- Success Message -->
        <Transition name="fade">
          <div v-if="successMessage" :key="successMessage" class="alert alert-success mb-6">
            <Icon name="checkCircle" :size="20" />
            <span>{{ successMessage }}</span>
          </div>
        </Transition>
        
        <!-- Error Message -->
        <ErrorMessage v-if="error" :message="error" class="mb-6" />
        
        <form @submit.prevent="handleSubmit" class="form">
          <!-- Task ID -->
          <div class="form-group">
            <label for="taskId">
              <Icon name="checkSquare" :size="16" />
              {{ FORM_LABELS.taskId }}
            </label>
            <input
              id="taskId"
              type="number"
              v-model.number="taskId"
              :placeholder="FORM_LABELS.taskIdPlaceholder"
              :class="{ 'input-error': validationErrors.taskId }"
              :aria-invalid="!!validationErrors.taskId"
              :aria-describedby="validationErrors.taskId ? 'taskId-error' : 'taskId-hint'"
            />
            <span v-if="validationErrors.taskId" id="taskId-error" class="field-error" role="alert">
              {{ validationErrors.taskId }}
            </span>
            <span id="taskId-hint" class="field-hint">
              <Icon name="info" :size="14" />
              {{ FORM_LABELS.taskIdHint }}
              <router-link to="/" class="hint-link">{{ FORM_LABELS.taskIdHintLink }}</router-link>
            </span>
          </div>
          
          <!-- Comment -->
          <div class="form-group">
            <label for="comment">
              <Icon name="comment" :size="16" />
              {{ FORM_LABELS.comment }}
            </label>
            <textarea
              id="comment"
              v-model="comment"
              :placeholder="FORM_LABELS.commentPlaceholder"
              rows="4"
              :class="{ 'input-error': validationErrors.comment }"
              :aria-invalid="!!validationErrors.comment"
              :aria-describedby="validationErrors.comment ? 'comment-error' : undefined"
            ></textarea>
            <span v-if="validationErrors.comment" id="comment-error" class="field-error" role="alert">
              {{ validationErrors.comment }}
            </span>
          </div>
          
          <!-- Date/Time Fields -->
          <div class="form-row" role="group" :aria-label="A11Y_LABELS.timeRange">
            <div class="form-group">
              <label for="start">
                <Icon name="clock" :size="16" />
                {{ FORM_LABELS.startTime }}
              </label>
              <input
                id="start"
                type="datetime-local"
                v-model="startDate"
                :class="{ 'input-error': validationErrors.start }"
                :aria-invalid="!!validationErrors.start"
                :aria-describedby="validationErrors.start ? 'start-error' : undefined"
              />
              <span v-if="validationErrors.start" id="start-error" class="field-error" role="alert">
                {{ validationErrors.start }}
              </span>
            </div>
            
            <div class="form-group">
              <label for="end">
                <Icon name="clock" :size="16" />
                {{ FORM_LABELS.endTime }}
              </label>
              <input
                id="end"
                type="datetime-local"
                v-model="endDate"
                :class="{ 'input-error': validationErrors.end }"
                :aria-invalid="!!validationErrors.end"
                :aria-describedby="validationErrors.end ? 'end-error' : undefined"
              />
              <span v-if="validationErrors.end" id="end-error" class="field-error" role="alert">
                {{ validationErrors.end }}
              </span>
            </div>
          </div>
          
          <!-- Duration Preview -->
          <Transition name="fade">
            <div v-if="durationPreview" :key="durationPreview" class="duration-preview">
              <Icon name="clock" />
              <span>Duration: <strong>{{ durationPreview }}</strong></span>
            </div>
          </Transition>
          
          <!-- Actions -->
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="goBack">
              {{ BUTTON_LABELS.cancel }}
            </button>
            
            <div class="action-buttons">
              <button 
                v-if="isEditMode"
                type="button" 
                class="btn btn-danger"
                :disabled="isDeleting"
                @click="openDeleteConfirm"
              >
                <LoadingSpinner v-if="isDeleting" size="sm" />
                <template v-else>
                  <Icon name="trash" />
                  {{ BUTTON_LABELS.delete }}
                </template>
              </button>
              
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="isSaving || (isEditMode && !hasChanges)"
              >
                <LoadingSpinner v-if="isSaving" size="sm" />
                <template v-else>
                  <Icon name="save" />
                  {{ isEditMode ? BUTTON_LABELS.updateEntry : BUTTON_LABELS.createEntry }}
                </template>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :open="showDeleteConfirm"
      :title="CONFIRM_DIALOGS.deleteTimeEntry.title"
      :message="CONFIRM_DIALOGS.deleteTimeEntry.message"
      :confirm-text="CONFIRM_DIALOGS.deleteTimeEntry.confirmText"
      :cancel-text="CONFIRM_DIALOGS.deleteTimeEntry.cancelText"
      variant="danger"
      @confirm="handleDelete"
      @cancel="closeDeleteConfirm"
    />
  </div>
</template>

<style scoped>
.time-entry-form-view {
  max-width: 640px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  transition: color var(--transition-fast);
}

.back-btn:hover {
  color: var(--accent-color);
}

.page-header {
  flex-direction: column;
}

.page-header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
}

.form-group label svg {
  color: var(--text-muted);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 500px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.input-error {
  border-color: var(--error-color) !important;
}

.input-error:focus {
  box-shadow: 0 0 0 4px var(--error-ring) !important;
}

.field-error {
  color: var(--error-color);
  font-size: 0.8125rem;
  margin-top: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.field-hint {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--text-muted);
  font-size: 0.8125rem;
  margin-top: 0.375rem;
}

.field-hint svg {
  flex-shrink: 0;
}

.hint-link {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
}

.hint-link:hover {
  text-decoration: underline;
}

.duration-preview {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, var(--accent-bg) 0%, var(--accent-light) 100%);
  border: 1px solid var(--accent-light);
  border-radius: var(--radius-md);
  color: var(--accent-color);
  font-size: 0.9375rem;
}

.duration-preview strong {
  font-weight: 600;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  margin-top: 0.5rem;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

/* Mobile responsive buttons */
@media (max-width: 500px) {
  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .form-actions .btn {
    width: 100%;
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }
  
  .action-buttons {
    width: 100%;
    flex-direction: column-reverse;
  }
  
  .form-actions > .btn-secondary {
    order: 1;
  }
}

.mb-6 {
  margin-bottom: 1.5rem;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
