<script setup lang="ts">
import type { Client, Project } from '../../types';
import { getClientProjects } from '../../api/services';
import { useExpandableNode } from '../../composables/useExpandableNode';
import { PAGINATION } from '../../config/constants';
import { ERROR_MESSAGES } from '../../config/error-messages';
import { EMPTY_STATES, A11Y_LABELS, BUTTON_LABELS } from '../../config/ui-strings';
import ProjectNode from './ProjectNode.vue';
import LoadingSpinner from '../LoadingSpinner.vue';
import Icon from '../Icon.vue';
import StatusBadge from '../StatusBadge.vue';

const props = defineProps<{
  client: Client;
}>();

const {
  isExpanded,
  isLoading,
  items: projects,
  error,
  hasLoaded,
  toggleExpand,
  load: loadProjects,
} = useExpandableNode<Project>(
  () => getClientProjects(props.client.id, { limit: PAGINATION.hierarchyLimit }),
  ERROR_MESSAGES.loadProjects
);
</script>

<template>
  <div class="client-node" :class="{ expanded: isExpanded }">
    <div 
      class="client-header" 
      @click="toggleExpand"
      role="button"
      :aria-expanded="isExpanded"
      :aria-label="A11Y_LABELS.expandClient(client.name, client.status, isExpanded)"
    >
      <button class="expand-chevron" :class="{ expanded: isExpanded }" tabindex="-1">
        <Icon name="chevronRight" :size="18" :stroke-width="2.5" />
      </button>
      <div class="client-info">
        <span class="client-name">{{ client.name }}</span>
        <span v-if="client.description" class="client-description">{{ client.description }}</span>
      </div>
      <LoadingSpinner v-if="isLoading" size="sm" />
      <StatusBadge :status="client.status" />
    </div>
    
    <div v-if="isExpanded" class="client-children">
      <div v-if="error" class="error-inline">
        <Icon name="xCircle" :size="16" />
        <span>{{ error }}</span>
        <button class="retry-btn" @click.stop="loadProjects">{{ BUTTON_LABELS.retryShort }}</button>
      </div>
      
      <div v-else-if="projects.length === 0 && hasLoaded" class="empty-message">
        <Icon name="folder" :size="16" />
        <span>{{ EMPTY_STATES.noProjects }}</span>
      </div>
      
      <template v-else>
        <ProjectNode v-for="project in projects" :key="project.id" :project="project" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.client-node {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  overflow: hidden;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.client-node:hover {
  border-color: var(--border-hover);
}

.client-node.expanded {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px var(--accent-ring);
}

.client-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.client-header:hover {
  background: var(--bg-hover);
}

.expand-chevron {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: transform var(--transition-base), background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
  flex-shrink: 0;
}

.expand-chevron:hover {
  background: var(--bg-hover);
  border-color: var(--border-hover);
  color: var(--text-primary);
}

.expand-chevron.expanded {
  transform: rotate(90deg);
  background: var(--accent-bg);
  border-color: var(--accent-light);
  color: var(--accent-color);
}

.client-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.client-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9375rem;
}

.client-description {
  font-size: 0.8125rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.client-children {
  padding: 0.75rem;
  padding-top: 0.5rem;
  padding-left: 2rem;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

/* Vertical tree line */
.client-children::before {
  content: '';
  position: absolute;
  left: 1.25rem;
  top: 0.75rem;
  bottom: 0.75rem;
  width: 2px;
  background: var(--border-color);
  border-radius: 1px;
}

/* Hide line when showing empty/error states */
.client-children:has(.empty-message)::before,
.client-children:has(.error-inline)::before {
  display: none;
}
</style>
