<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}>();
</script>

<template>
  <div class="loading-container" :class="{ 'has-text': text }">
    <div :class="['spinner', size ? `spinner-${size}` : '']"></div>
    <span v-if="text" class="loading-text">{{ text }}</span>
  </div>
</template>

<style scoped>
.loading-container {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.loading-container.has-text {
  flex-direction: column;
  gap: 1rem;
}

.loading-text {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  font-weight: 500;
}
</style>
