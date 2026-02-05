<script setup lang="ts">
import Icon from './Icon.vue';
import { BUTTON_LABELS } from '../config/ui-strings';

/**
 * Reusable pagination controls component
 * Provides consistent pagination UI across list views
 * Buttons are disabled while loading to prevent rapid clicks
 */
const props = defineProps<{
  currentPage: number;
  hasMore: boolean;
  /** Optional: disable buttons while parent is loading */
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'go-to': [page: number];
}>();

function goToPage(page: number) {
  if (props.disabled) return;
  emit('go-to', page);
}
</script>

<template>
  <div class="pagination" :class="{ 'pagination-disabled': disabled }">
    <button 
      class="btn btn-secondary pagination-btn"
      :disabled="currentPage === 1 || disabled"
      @click="goToPage(currentPage - 1)"
    >
      <Icon name="chevronLeft" :size="16" />
      {{ BUTTON_LABELS.previous }}
    </button>
    <div class="page-numbers">
      <button 
        v-if="currentPage > 1"
        class="page-number"
        :disabled="disabled"
        @click="goToPage(currentPage - 1)"
      >
        {{ currentPage - 1 }}
      </button>
      <span class="page-number active">{{ currentPage }}</span>
      <button 
        v-if="hasMore"
        class="page-number"
        :disabled="disabled"
        @click="goToPage(currentPage + 1)"
      >
        {{ currentPage + 1 }}
      </button>
    </div>
    <button 
      class="btn btn-secondary pagination-btn"
      :disabled="!hasMore || disabled"
      @click="goToPage(currentPage + 1)"
    >
      {{ BUTTON_LABELS.next }}
      <Icon name="chevronRight" :size="16" />
    </button>
  </div>
</template>
