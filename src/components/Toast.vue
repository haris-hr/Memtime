<script setup lang="ts">
import Icon from './Icon.vue';
import { A11Y_LABELS } from '../config/ui-strings';

defineProps<{
  message: string;
  variant?: 'error' | 'success' | 'info';
}>();

const emit = defineEmits<{
  dismiss: [];
}>();
</script>

<template>
  <Transition name="toast">
    <div v-if="message" class="toast" :class="[`toast-${variant || 'info'}`]">
      <Icon :name="variant === 'success' ? 'checkCircle' : 'info'" :size="18" />
      <span>{{ message }}</span>
      <button class="toast-close" @click="emit('dismiss')" :aria-label="A11Y_LABELS.dismiss">
        <Icon name="xCircle" :size="14" />
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 1001;
}

.toast-error {
  border-left: 3px solid var(--error-color);
  color: var(--error-color);
}

.toast-success {
  border-left: 3px solid var(--success-color);
  color: var(--success-color);
}

.toast-info {
  border-left: 3px solid var(--accent-color);
  color: var(--accent-color);
}

.toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  margin-left: 0.5rem;
}

.toast-close:hover {
  color: var(--text-primary);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(1rem);
}
</style>
