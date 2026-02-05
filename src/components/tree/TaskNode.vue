<script setup lang="ts">
import type { Task } from '../../types';
import Icon from '../Icon.vue';
import StatusBadge from '../StatusBadge.vue';
import { A11Y_LABELS } from '../../config/ui-strings';

defineProps<{
  task: Task;
}>();
</script>

<template>
  <div class="task-node" role="listitem" :aria-label="A11Y_LABELS.taskItem(task.name, task.id, task.status)">
    <div class="task-content">
      <div class="node-icon node-icon-sm node-icon-task">
        <Icon name="checkSquare" :size="14" />
      </div>
      <div class="task-info">
        <span class="task-name">{{ task.name }}</span>
        <span class="task-id">ID: {{ task.id }}</span>
      </div>
      <StatusBadge :status="task.status" size="sm" />
    </div>
  </div>
</template>

<style scoped>
.task-node {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  transition: border-color var(--transition-fast), background var(--transition-fast);
  position: relative;
}

/* Horizontal connector from parent tree line */
.task-node::before {
  content: '';
  position: absolute;
  left: -0.5rem;
  top: 50%;
  width: 0.5rem;
  height: 2px;
  background: var(--border-color);
}

.task-node:hover {
  border-color: var(--border-hover);
  background: var(--bg-hover);
}

.task-content {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.875rem;
}

.task-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.0625rem;
  min-width: 0;
}

.task-name {
  font-size: 0.8125rem;
  color: var(--text-primary);
  font-weight: 500;
}

.task-id {
  font-size: 0.6875rem;
  color: var(--text-muted);
  font-family: monospace;
}
</style>
