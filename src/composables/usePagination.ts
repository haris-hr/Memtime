import { ref, computed, onUnmounted, type Ref } from 'vue';
import { PAGINATION } from '../config/constants';
import { getErrorMessage } from '../config/error-messages';

export interface UsePaginationOptions {
  /** Items per page (default: PAGINATION.defaultPageSize) */
  pageSize?: number;
  /** Default sort field */
  sortBy?: string;
  /** Default sort order */
  order?: 'asc' | 'desc';
  /** Error message fallback */
  errorMessage?: string;
}

export interface PaginationParams {
  limit: number;
  offset: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

/**
 * Composable for paginated data fetching
 * Extracts common pagination logic from list views
 * Includes request cancellation on unmount to prevent memory leaks
 */
export function usePagination<T>(
  fetchFn: (params: PaginationParams) => Promise<T[]>,
  options: UsePaginationOptions = {}
) {
  const {
    pageSize = PAGINATION.defaultPageSize,
    sortBy,
    order,
    errorMessage = 'Failed to load items',
  } = options;

  const items: Ref<T[]> = ref([]);
  const currentPage = ref(1);
  const hasMore = ref(true);
  const isLoading = ref(true);
  const error = ref<string | null>(null);
  
  // Track current request to prevent race conditions
  let currentRequestId = 0;
  let isUnmounted = false;

  const offset = computed(() => (currentPage.value - 1) * pageSize);

  async function load() {
    // Increment request ID to invalidate any in-flight requests
    const requestId = ++currentRequestId;
    
    isLoading.value = true;
    error.value = null;

    try {
      // Fetch one extra item to determine if there are more pages
      // This avoids navigating to empty pages since the API doesn't provide total count
      const params: PaginationParams = {
        limit: pageSize + 1,
        offset: offset.value,
      };

      if (sortBy) params.sortBy = sortBy;
      if (order) params.order = order;

      const data = await fetchFn(params);
      
      // Ignore response if component unmounted or a newer request was made
      if (isUnmounted || requestId !== currentRequestId) return;

      // If we got more than pageSize, there's a next page
      hasMore.value = data.length > pageSize;

      // Only keep the page size amount for display
      items.value = data.slice(0, pageSize);
    } catch (e) {
      // Ignore errors if component unmounted or a newer request was made
      if (isUnmounted || requestId !== currentRequestId) return;
      error.value = getErrorMessage(e, errorMessage);
    } finally {
      // Only update loading state if this is still the current request
      if (!isUnmounted && requestId === currentRequestId) {
        isLoading.value = false;
      }
    }
  }

  function goToPage(page: number) {
    // Prevent rapid navigation while loading
    if (isLoading.value) return;
    if (page < 1) return;
    if (page > currentPage.value && !hasMore.value) return;
    
    currentPage.value = page;
    load();
  }

  function nextPage() {
    if (hasMore.value) {
      goToPage(currentPage.value + 1);
    }
  }

  function previousPage() {
    if (currentPage.value > 1) {
      goToPage(currentPage.value - 1);
    }
  }

  function refresh() {
    load();
  }

  // Cleanup on unmount
  onUnmounted(() => {
    isUnmounted = true;
  });

  return {
    items,
    currentPage,
    hasMore,
    isLoading,
    error,
    load,
    goToPage,
    nextPage,
    previousPage,
    refresh,
  };
}
