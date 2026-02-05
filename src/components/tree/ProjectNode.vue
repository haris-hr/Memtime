<script setup lang="ts">
import type { Project, Task } from '../../types';
import { getProjectTasks } from '../../api/services';
import { useExpandableNode } from '../../composables/useExpandableNode';
import { PAGINATION } from '../../config/constants';
import { ERROR_MESSAGES } from '../../config/error-messages';
import { EMPTY_STATES, A11Y_LABELS, BUTTON_LABELS } from '../../config/ui-strings';
import TaskNode from './TaskNode.vue';
import LoadingSpinner from '../LoadingSpinner.vue';
import Icon from '../Icon.vue';
import StatusBadge from '../StatusBadge.vue';

const props = defineProps<{
  project: Project;
}>();

const {
  isExpanded,
  isLoading,
  items: tasks,
  error,
  hasLoaded,
  toggleExpand,
  load: loadTasks,
} = useExpandableNode<Task>(
  () => getProjectTasks(props.project.id, { limit: PAGINATION.hierarchyLimit }),
  ERROR_MESSAGES.loadTasks
);
</script>

<template>
  <div class="project-node" :class="{ expanded: isExpanded }">
    <div 
      class="project-header" 
      @click="toggleExpand"
      role="button"
      :aria-expanded="isExpanded"
      :aria-label="A11Y_LABELS.expandProject(project.name, project.status, isExpanded)"
    >
      <button class="expand-btn expand-btn-sm" :class="{ expanded: isExpanded }" tabindex="-1">
        <Icon name="chevronRight" :size="12" :stroke-width="2.5" />
      </button>
      <div class="node-icon node-icon-md">
        <Icon name="folder" :size="16" />
      </div>
      <span class="project-name">{{ project.name }}</span>
      <StatusBadge :status="project.status" size="sm" />
      <LoadingSpinner v-if="isLoading" size="sm" />
    </div>
    
    <div v-if="isExpanded" class="project-children">
      <div v-if="error" class="error-inline">
        <Icon name="xCircle" :size="14" />
        <span>{{ error }}</span>
        <button class="retry-btn" @click.stop="loadTasks">{{ BUTTON_LABELS.retryShort }}</button>
      </div>
      
      <div v-else-if="tasks.length === 0 && hasLoaded" class="empty-message">
        <Icon name="checkSquare" :size="14" />
        <span>{{ EMPTY_STATES.noTasks }}</span>
      </div>
      
      <template v-else>
        <TaskNode v-for="task in tasks" :key="task.id" :task="task" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.project-node {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: border-color var(--transition-fast);
  position: relative;
}

/* Horizontal connector from parent tree line */
.project-node::before {
  content: '';
  position: absolute;
  left: -0.75rem;
  top: 50%;
  width: 0.75rem;
  height: 2px;
  background: var(--border-color);
}

.project-node:hover {
  border-color: var(--border-hover);
}

.project-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.project-header:hover {
  background: var(--bg-hover);
}

.project-name {
  flex: 1;
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.project-children {
  padding: 0.5rem;
  padding-left: 1.5rem;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  position: relative;
}

/* Vertical tree line */
.project-children::before {
  content: '';
  position: absolute;
  left: 1rem;
  top: 0.5rem;
  bottom: 0.5rem;
  width: 2px;
  background: var(--border-color);
  border-radius: 1px;
}

/* Hide line when showing empty/error states */
.project-children:has(.empty-message)::before,
.project-children:has(.error-inline)::before {
  display: none;
}

.node-icon {
  background: var(--bg-hover);
  color: var(--text-primary);
}
</style>
