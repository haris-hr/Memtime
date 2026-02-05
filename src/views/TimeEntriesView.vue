<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { TimeEntry } from '../types';
import { getTimeEntries } from '../api/services';
import { formatDate, formatTime, formatDuration } from '../utils/date';
import { usePagination } from '../composables/usePagination';
import { useDeleteTimeEntry } from '../composables/useDeleteTimeEntry';
import { ERROR_MESSAGES } from '../config/error-messages';
import { PAGE_TITLES, EMPTY_STATES, BUTTON_LABELS, TABLE_HEADERS, A11Y_LABELS } from '../config/ui-strings';
import ErrorMessage from '../components/ErrorMessage.vue';
import PaginationControls from '../components/PaginationControls.vue';
import Icon from '../components/Icon.vue';
import TableSkeleton from '../components/TableSkeleton.vue';
import ConfirmModal from '../components/ConfirmModal.vue';
import Toast from '../components/Toast.vue';

const router = useRouter();

const {
  items: entries,
  currentPage,
  hasMore,
  isLoading,
  error,
  load: loadEntries,
  goToPage,
} = usePagination<TimeEntry>(
  (params) => getTimeEntries(params),
  {
    sortBy: 'createdAt',
    order: 'desc',
    errorMessage: ERROR_MESSAGES.loadTimeEntries,
  }
);

// Delete functionality - reload list after successful delete
const {
  showModal: showDeleteModal,
  entryToDelete,
  error: deleteError,
  confirmDelete,
  cancelDelete,
  handleDelete,
  clearError: clearDeleteError,
} = useDeleteTimeEntry(() => loadEntries());

function editEntry(entry: TimeEntry) {
  router.push(`/time-entry/${entry.id}/edit`);
}

onMounted(() => {
  loadEntries();
});
</script>

<template>
  <div class="time-entries-view">
    <div class="page-header">
      <div class="page-header-left">
        <div class="page-header-icon">
          <Icon name="clock" :size="28" />
        </div>
        <div>
          <h2>{{ PAGE_TITLES.timeEntries }}</h2>
          <p class="page-description">{{ PAGE_TITLES.timeEntriesDescription }}</p>
        </div>
      </div>
      <router-link to="/time-entry/new" class="btn btn-primary">
        <Icon name="clockPlus" />
        {{ BUTTON_LABELS.newEntry }}
      </router-link>
    </div>
    
    <div v-if="isLoading" class="card">
      <TableSkeleton :rows="5" :columns="6" />
    </div>
    
    <ErrorMessage 
      v-else-if="error" 
      :message="error" 
      :retryable="true"
      @retry="loadEntries"
    />
    
    <div v-else-if="entries.length === 0" class="empty-state">
      <div class="empty-icon">
        <Icon name="clock" :size="48" :stroke-width="1.5" />
      </div>
      <h3>{{ EMPTY_STATES.noTimeEntries }}</h3>
      <p>{{ EMPTY_STATES.noTimeEntriesDescription }}</p>
      <router-link to="/time-entry/new" class="btn btn-primary mt-6">
        <Icon name="clockPlus" />
        {{ BUTTON_LABELS.createTimeEntry }}
      </router-link>
    </div>
    
    <div v-else class="card">
      <div class="table-container">
        <table class="table" role="grid" :aria-label="A11Y_LABELS.timeEntriesList">
          <thead>
            <tr>
              <th scope="col">{{ TABLE_HEADERS.id }}</th>
              <th scope="col">{{ TABLE_HEADERS.task }}</th>
              <th scope="col">{{ TABLE_HEADERS.comment }}</th>
              <th scope="col">{{ TABLE_HEADERS.time }}</th>
              <th scope="col">{{ TABLE_HEADERS.duration }}</th>
              <th scope="col">{{ TABLE_HEADERS.created }}</th>
              <th scope="col" class="actions-header">{{ TABLE_HEADERS.actions }}</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="entry in entries" 
              :key="entry.id"
              @click="editEntry(entry)"
              @keydown.enter.self="editEntry(entry)"
              class="entry-row"
              tabindex="0"
              role="row"
              :aria-label="A11Y_LABELS.timeEntryRow(entry.id, entry.taskId, entry.comment)"
            >
              <td class="id-cell">
                <span class="id-badge">#{{ entry.id }}</span>
              </td>
              <td class="task-cell">
                <span class="task-badge">
                  <span class="task-label">Task</span>
                  <span class="task-id">{{ entry.taskId }}</span>
                </span>
              </td>
              <td class="comment-cell">
                <span class="comment-text">{{ entry.comment || '—' }}</span>
              </td>
              <td class="time-cell">
                <div class="time-range">
                  <span class="time-start">{{ formatTime(entry.start) }}</span>
                  <Icon name="arrowRight" :size="12" />
                  <span class="time-end">{{ formatTime(entry.end) }}</span>
                </div>
                <span class="time-date">{{ formatDate(entry.start) }}</span>
              </td>
              <td class="duration-cell">
                <span class="duration-badge">{{ formatDuration(entry.start, entry.end) }}</span>
              </td>
              <td class="date-cell">{{ formatDate(entry.createdAt) }}</td>
              <td class="actions-cell">
                <button 
                  class="btn-icon btn-icon-danger"
                  @click="confirmDelete(entry, $event)"
                  :aria-label="`Delete time entry #${entry.id}`"
                  title="Delete"
                >
                  <Icon name="trash" :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <PaginationControls 
        :current-page="currentPage" 
        :has-more="hasMore"
        :disabled="isLoading"
        @go-to="goToPage" 
      />
    </div>
    
    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :open="showDeleteModal"
      title="Delete Time Entry"
      :message="entryToDelete ? `Are you sure you want to delete entry #${entryToDelete.id}? This action cannot be undone.` : ''"
      confirm-text="Delete"
      cancel-text="Cancel"
      variant="danger"
      @confirm="handleDelete"
      @cancel="cancelDelete"
    />
    
    <!-- Delete Error Toast -->
    <Toast 
      :message="deleteError ?? ''" 
      variant="error" 
      @dismiss="clearDeleteError" 
    />
  </div>
</template>

<style scoped>
.time-entries-view {
  max-width: 1000px;
}

/* Override: page-header needs space-between for the action button */
.time-entries-view .page-header {
  justify-content: space-between;
}

.page-header-left {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

/* Override: constrain empty state text width */
.time-entries-view .empty-state p {
  max-width: 280px;
  margin: 0 auto;
}

.table-container {
  overflow-x: auto;
}

.entry-row {
  transition: background var(--transition-fast);
}

.id-cell {
  width: 80px;
}

.id-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: var(--bg-hover);
  border-radius: var(--radius-sm);
  font-family: monospace;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.task-cell {
  width: 100px;
}

.task-badge {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  padding: 0.375rem 0.625rem;
  background: var(--warning-light);
  color: var(--warning-dark);
  border-radius: var(--radius-sm);
  text-align: center;
}

.task-label {
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  opacity: 0.8;
}

.task-id {
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.2;
}

.comment-cell {
  max-width: 240px;
}

.comment-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-primary);
}

.time-cell {
  white-space: nowrap;
}

.time-range {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.time-range svg {
  color: var(--text-muted);
}

.time-date {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.125rem;
}

.duration-cell {
  white-space: nowrap;
}

.duration-badge {
  display: inline-block;
  padding: 0.3125rem 0.75rem;
  background: linear-gradient(135deg, var(--accent-bg) 0%, var(--accent-light) 100%);
  color: var(--accent-color);
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  font-weight: 600;
}

.date-cell {
  font-size: 0.875rem;
  color: var(--text-muted);
  white-space: nowrap;
}

/* Override: pagination inside card has different styling */
.time-entries-view .pagination {
  margin-top: 0;
  border-radius: 0;
  border: none;
  border-top: 1px solid var(--border-color);
  background: var(--bg-hover);
}

.actions-header {
  width: 80px;
  text-align: center;
}

.actions-cell {
  text-align: center;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-icon-danger {
  background: var(--error-bg);
  color: var(--text-muted);
}

.btn-icon-danger:hover {
  color: var(--error-color);
}

/* Toast notification */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }

  .page-header .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
