import { ref, onUnmounted } from 'vue';
import { ERROR_MESSAGES, getErrorMessage } from '../config/error-messages';

export interface ExpandableNodeOptions {
  /** If true, will not refetch on re-expand (default: true) */
  cache?: boolean;
}

/**
 * Composable for expandable tree nodes with lazy loading and optional caching
 * Eliminates code duplication between ClientNode, ProjectNode, etc.
 * Includes cleanup on unmount to prevent memory leaks
 */
export function useExpandableNode<T>(
  loadFn: () => Promise<T[]>,
  errorMessage: string = ERROR_MESSAGES.loadItems,
  options: ExpandableNodeOptions = {}
) {
  const { cache = true } = options;
  
  const isExpanded = ref(false);
  const isLoading = ref(false);
  const items = ref<T[]>([]);
  const error = ref<string | null>(null);
  const hasLoaded = ref(false);
  
  // Track unmount state to prevent state updates after cleanup
  let isUnmounted = false;
  let currentRequestId = 0;

  async function toggleExpand() {
    // Load data if not loaded yet, or if caching is disabled
    if ((!hasLoaded.value || !cache) && !isLoading.value) {
      await load();
    }
    if (!isUnmounted) {
      isExpanded.value = !isExpanded.value;
    }
  }

  async function load() {
    const requestId = ++currentRequestId;
    
    isLoading.value = true;
    error.value = null;

    try {
      const data = await loadFn();
      
      // Ignore if unmounted or superseded by newer request
      if (isUnmounted || requestId !== currentRequestId) return;
      
      items.value = data as T[];
      hasLoaded.value = true;
    } catch (e) {
      if (isUnmounted || requestId !== currentRequestId) return;
      error.value = getErrorMessage(e, errorMessage);
    } finally {
      if (!isUnmounted && requestId === currentRequestId) {
        isLoading.value = false;
      }
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    isUnmounted = true;
  });

  return {
    isExpanded,
    isLoading,
    items,
    error,
    hasLoaded,
    toggleExpand,
    load,
  };
}
