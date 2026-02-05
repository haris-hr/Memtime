<script setup lang="ts">
import Icon from '../components/Icon.vue';
import { PAGE_TITLES, BUTTON_LABELS } from '../config/ui-strings';
</script>

<template>
  <div class="not-found-view">
    <div class="not-found-content">
      <div class="not-found-icon">
        <Icon name="xCircle" :size="64" :stroke-width="1.5" />
      </div>
      <h1>404</h1>
      <h2>{{ PAGE_TITLES.notFound }}</h2>
      <p>{{ PAGE_TITLES.notFoundDescription }}</p>
      <router-link to="/" class="btn btn-primary">
        <Icon name="home" />
        {{ BUTTON_LABELS.backToHome }}
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.not-found-content {
  text-align: center;
  padding: 2rem;
}

.not-found-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background: var(--error-bg);
  color: var(--error-color);
  border-radius: 50%;
  margin-bottom: 1.5rem;
}

.not-found-content h1 {
  font-size: 4rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  letter-spacing: -0.03em;
}

.not-found-content h2 {
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.not-found-content p {
  color: var(--text-muted);
  margin-bottom: 2rem;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
}
</style>
