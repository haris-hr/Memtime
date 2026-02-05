<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';
import ErrorMessage from './ErrorMessage.vue';

/**
 * Global error boundary component
 * Catches unexpected errors in child components and displays a fallback UI
 * Prevents the entire app from crashing due to a component error
 */
const error = ref<Error | null>(null);
const errorInfo = ref<string>('');

function handleRetry() {
  error.value = null;
  errorInfo.value = '';
}

onErrorCaptured((err: Error, instance, info) => {
  error.value = err;
  errorInfo.value = info;
  
  // Log error for debugging (in production, send to error tracking service)
  console.error('ErrorBoundary caught an error:', err);
  console.error('Component:', instance);
  console.error('Error info:', info);
  
  // Return false to stop error propagation
  return false;
});
</script>

<template>
  <div v-if="error" class="error-boundary">
    <ErrorMessage 
      :message="error.message || 'An unexpected error occurred'" 
      :retryable="true"
      @retry="handleRetry"
    />
    <details v-if="errorInfo" class="error-details">
      <summary>Technical Details</summary>
      <pre>{{ errorInfo }}</pre>
    </details>
  </div>
  <slot v-else />
</template>

<style scoped>
.error-boundary {
  padding: 2rem;
  max-width: 600px;
  margin: 2rem auto;
}

.error-details {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--bg-hover);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.error-details summary {
  cursor: pointer;
  font-weight: 500;
  color: var(--text-primary);
}

.error-details pre {
  margin-top: 0.75rem;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: monospace;
  font-size: 0.8125rem;
}
</style>
