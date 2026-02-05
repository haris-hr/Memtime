<script setup lang="ts">
/**
 * Skeleton loading state for tables
 * Provides better UX than a simple spinner for tabular data
 */
defineProps<{
  rows?: number;
  columns?: number;
}>();
</script>

<template>
  <div class="table-skeleton">
    <div class="skeleton-header">
      <div 
        v-for="col in (columns || 6)" 
        :key="`header-${col}`" 
        class="skeleton skeleton-cell skeleton-header-cell"
      ></div>
    </div>
    <div 
      v-for="row in (rows || 5)" 
      :key="`row-${row}`" 
      class="skeleton-row"
    >
      <div 
        v-for="col in (columns || 6)" 
        :key="`cell-${row}-${col}`" 
        class="skeleton skeleton-cell"
        :style="{ animationDelay: `${(row * 0.1)}s` }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.table-skeleton {
  padding: 1rem;
}

.skeleton-header {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--bg-hover);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  margin-bottom: 0.5rem;
}

.skeleton-header-cell {
  height: 12px;
}

.skeleton-row {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.skeleton-row:last-child {
  border-bottom: none;
}

.skeleton-cell {
  flex: 1;
  height: 20px;
  border-radius: var(--radius-sm);
}

.skeleton-cell:first-child {
  max-width: 60px;
}

.skeleton-cell:nth-child(2) {
  max-width: 80px;
}

.skeleton-cell:nth-child(3) {
  max-width: 200px;
}
</style>
