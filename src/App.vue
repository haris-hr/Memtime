<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { computed } from 'vue';
import MemtimeLogo from './components/MemtimeLogo.vue';
import Icon from './components/Icon.vue';
import { A11Y_LABELS } from './config/ui-strings';

const route = useRoute();

const currentRouteName = computed(() => route.name);
</script>

<template>
  <div class="app">
    <!-- Skip link for keyboard users -->
    <a href="#main-content" class="skip-link">{{ A11Y_LABELS.skipToContent }}</a>
    
    <header class="header" role="banner">
      <div class="header-content">
        <RouterLink to="/" class="logo-link">
          <MemtimeLogo :size="32" />
          <span class="logo-text">Memtime</span>
        </RouterLink>
        <nav class="nav" role="navigation" :aria-label="A11Y_LABELS.mainNav">
          <RouterLink to="/" class="nav-link" :class="{ active: currentRouteName === 'hierarchy' }">
            <Icon name="home" />
            <span>Overview</span>
          </RouterLink>
          <RouterLink to="/time-entries" class="nav-link" :class="{ active: currentRouteName === 'time-entries' }">
            <Icon name="clock" />
            <span>Time Entries</span>
          </RouterLink>
          <RouterLink v-if="currentRouteName !== 'time-entries'" to="/time-entry/new" class="nav-link nav-link-cta">
            <Icon name="clockPlus" />
            <span>New Entry</span>
          </RouterLink>
        </nav>
      </div>
    </header>
    <main id="main-content" class="main" role="main">
      <RouterView />
    </main>
    <footer class="footer" role="contentinfo">
      <p>Built for Memtime Interview Task</p>
    </footer>
  </div>
</template>

<style scoped>
/* Skip link for keyboard navigation */
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  background: var(--accent-color);
  color: white;
  padding: 0.75rem 1.5rem;
  z-index: 1000;
  font-weight: 600;
  text-decoration: none;
  border-radius: 0 0 var(--radius-md) 0;
}

.skip-link:focus {
  top: 0;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

.header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
  background: var(--bg-header-blur);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text-primary);
  transition: opacity 0.2s ease;
}

.logo-link:hover {
  opacity: 0.8;
}

.logo-text {
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.nav {
  display: flex;
  gap: 0.375rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 10px;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.nav-link.active {
  background: var(--accent-bg);
  color: var(--accent-color);
}

.nav-link svg {
  flex-shrink: 0;
}

.nav-link-cta {
  background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-hover) 100%);
  color: white !important;
  box-shadow: 0 2px 8px var(--accent-shadow);
}

.nav-link-cta:hover {
  background: linear-gradient(135deg, var(--accent-hover) 0%, var(--accent-dark) 100%);
  color: white !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--accent-shadow-lg);
}

.main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

.footer {
  border-top: 1px solid var(--border-color);
  padding: 1.5rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .header-content {
    height: auto;
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .nav {
    width: 100%;
    justify-content: center;
  }

  .nav-link span {
    display: none;
  }

  .nav-link {
    padding: 0.75rem;
  }
}
</style>
