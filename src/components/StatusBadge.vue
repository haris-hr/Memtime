<script setup lang="ts">
import type { EntityStatus } from '../types';

/**
 * Reusable status badge component
 * Displays entity status (active, inactive, in-progress, pending, completed)
 * with consistent styling across the app
 */
withDefaults(
  defineProps<{
    status: EntityStatus;
    size?: 'sm' | 'md';
  }>(),
  {
    size: 'md',
  }
);
</script>

<template>
  <span :class="['status-badge', `status-${status}`, size === 'sm' && 'status-sm']">
    {{ status }}
  </span>
</template>

<!-- Styles are inherited from global style.css (.status-badge, .status-{status}) -->
