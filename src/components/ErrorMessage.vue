<script setup lang="ts">
import Icon from './Icon.vue';
import { BUTTON_LABELS, ERROR_TEXT } from '../config/ui-strings';

defineProps<{
  message: string;
  retryable?: boolean;
}>();

const emit = defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div class="error-container">
    <div class="error-icon">
      <Icon name="xCircle" :size="20" />
    </div>
    <div class="error-content">
      <p class="error-title">{{ ERROR_TEXT.title }}</p>
      <p class="error-message">{{ message }}</p>
      <button v-if="retryable" class="retry-btn" @click="emit('retry')">
        <Icon name="refresh" :size="16" />
        {{ BUTTON_LABELS.retry }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.error-container {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: var(--error-bg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--error-light);
}

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--error-light);
  color: var(--error-color);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.error-content {
  flex: 1;
}

.error-title {
  font-weight: 600;
  color: var(--error-darker);
  margin-bottom: 0.25rem;
}

.error-message {
  color: var(--error-text);
  font-size: 0.9375rem;
  margin-bottom: 0.75rem;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid var(--error-light);
  border-radius: var(--radius-md);
  color: var(--error-color);
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.retry-btn:hover {
  background: var(--error-light);
  border-color: var(--error-color);
}
</style>
