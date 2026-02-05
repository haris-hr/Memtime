<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import Icon from './Icon.vue';

/**
 * Accessible confirmation modal
 * Replaces native confirm() with a styled, keyboard-accessible dialog
 */
const props = defineProps<{
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'default';
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const modalRef = ref<HTMLElement | null>(null);
const confirmBtnRef = ref<HTMLButtonElement | null>(null);

// Focus trap: keep focus within modal when open
function handleKeydown(e: KeyboardEvent) {
  if (!props.open) return;
  
  if (e.key === 'Escape') {
    emit('cancel');
  }
  
  // Trap focus within modal
  if (e.key === 'Tab' && modalRef.value) {
    const focusable = modalRef.value.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  }
}

// Focus confirm button when modal opens
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      confirmBtnRef.value?.focus();
    }, 50);
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="open" 
        class="modal-overlay"
        @click.self="emit('cancel')"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? 'modal-title' : undefined"
        :aria-describedby="message ? 'modal-message' : undefined"
      >
        <div ref="modalRef" class="modal-content" :class="[`modal-${variant || 'default'}`]">
          <div class="modal-icon" :class="[`modal-icon-${variant || 'default'}`]">
            <Icon 
              :name="variant === 'danger' ? 'trash' : 'info'" 
              :size="24" 
            />
          </div>
          
          <h3 id="modal-title" class="modal-title">{{ title }}</h3>
          <p id="modal-message" class="modal-message">{{ message }}</p>
          
          <div class="modal-actions">
            <button 
              class="btn btn-secondary"
              @click="emit('cancel')"
            >
              {{ cancelText || 'Cancel' }}
            </button>
            <button 
              ref="confirmBtnRef"
              :class="['btn', variant === 'danger' ? 'btn-danger' : 'btn-primary']"
              @click="emit('confirm')"
            >
              {{ confirmText || 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-xl);
}

.modal-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin-bottom: 1.25rem;
}

.modal-icon-danger {
  background: var(--error-bg);
  color: var(--error-color);
}

.modal-icon-warning {
  background: var(--warning-bg);
  color: var(--warning-color);
}

.modal-icon-default {
  background: var(--accent-bg);
  color: var(--accent-color);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.modal-message {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.modal-actions .btn {
  min-width: 100px;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>
