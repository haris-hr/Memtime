<script setup lang="ts">
import { onMounted } from 'vue';
import type { Client } from '../types';
import { getClients } from '../api/services';
import { usePagination } from '../composables/usePagination';
import { ERROR_MESSAGES } from '../config/error-messages';
import { PAGE_TITLES, LOADING_TEXT, EMPTY_STATES, A11Y_LABELS, BUTTON_LABELS } from '../config/ui-strings';
import ClientNode from '../components/tree/ClientNode.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import ErrorMessage from '../components/ErrorMessage.vue';
import PaginationControls from '../components/PaginationControls.vue';
import Icon from '../components/Icon.vue';

const {
  items: clients,
  currentPage,
  hasMore,
  isLoading,
  error,
  load: loadClients,
  goToPage,
} = usePagination<Client>(
  (params) => getClients(params),
  { errorMessage: ERROR_MESSAGES.loadClients }
);

onMounted(() => {
  loadClients();
});
</script>

<template>
  <div class="hierarchy-view">
    <div class="page-header">
      <div class="page-header-left">
        <div class="page-header-icon">
          <Icon name="home" :size="28" />
        </div>
        <div>
          <h2>{{ PAGE_TITLES.hierarchy }}</h2>
          <p class="page-description">
            {{ PAGE_TITLES.hierarchyDescription }}
          </p>
        </div>
      </div>
      <router-link to="/time-entry/new" class="btn btn-primary">
        <Icon name="clockPlus" />
        {{ BUTTON_LABELS.newEntry }}
      </router-link>
    </div>
    
    <div v-if="isLoading" class="loading-state">
      <LoadingSpinner size="lg" :text="LOADING_TEXT.clients" />
    </div>
    
    <ErrorMessage 
      v-else-if="error" 
      :message="error" 
      :retryable="true"
      @retry="loadClients"
    />
    
    <div v-else-if="clients.length === 0" class="empty-state">
      <div class="empty-icon">
        <Icon name="briefcase" :size="48" :stroke-width="1.5" />
      </div>
      <h3>{{ EMPTY_STATES.noClients }}</h3>
      <p>{{ EMPTY_STATES.noClientsDescription }}</p>
    </div>
    
    <div v-else>
      <div class="clients-list" role="list" :aria-label="A11Y_LABELS.clientsList">
        <TransitionGroup name="list">
          <ClientNode v-for="client in clients" :key="client.id" :client="client" />
        </TransitionGroup>
      </div>
      
      <!-- Pagination -->
      <PaginationControls 
        :current-page="currentPage" 
        :has-more="hasMore"
        :disabled="isLoading"
        @go-to="goToPage" 
      />
    </div>
  </div>
</template>

<style scoped>
.hierarchy-view {
  max-width: 800px;
  margin: 0 auto;
}

/* Override: page-header needs space-between for the action button */
.hierarchy-view .page-header {
  justify-content: space-between;
}

.page-header-left {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

/* View-specific styles only */
.clients-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
