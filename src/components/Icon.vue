<script setup lang="ts">
/**
 * Centralized icon component
 * Eliminates repeated inline SVGs throughout the app
 * 
 * SECURITY NOTE: This component uses v-html to render SVG paths.
 * This is SAFE because all icon paths are hardcoded in the icons config.
 * The `name` prop is typed to only accept keys from this object, preventing
 * any user-controlled input from being rendered as HTML.
 * DO NOT modify this component to accept arbitrary SVG content.
 */

import { icons, type IconName } from '../config/icons';

const props = withDefaults(
  defineProps<{
    name: IconName;
    size?: number;
    strokeWidth?: number;
  }>(),
  {
    size: 18,
    strokeWidth: 2,
  }
);

const iconPath = icons[props.name];
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="icon"
    v-html="iconPath"
  />
</template>

<style scoped>
.icon {
  flex-shrink: 0;
}
</style>
