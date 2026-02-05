<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Task } from '../../types';
import Icon from '../Icon.vue';
import StatusBadge from '../StatusBadge.vue';
import { A11Y_LABELS } from '../../config/ui-strings';

const props = defineProps<{
  task: Task;
}>();

const router = useRouter();

function logTime() {
  router.push(`/time-entry/new?taskId=${props.task.id}`);
}
</script>

<template>
  <div 
    class="task-node" 
    role="button"
    tabindex="0"
    :aria-label="`${A11Y_LABELS.taskItem(task.name, task.id, task.status)}. Click to log time.`"
    @click="logTime"
    @keydown.enter="logTime"
  >
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
  border-color: var(--accent-color);
  background: var(--accent-bg);
  cursor: pointer;
}

.task-node:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px var(--accent-ring);
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
