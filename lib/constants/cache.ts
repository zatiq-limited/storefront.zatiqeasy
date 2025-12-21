/**
 * React Query Cache Configuration
 * Centralized cache timing constants for consistent caching behavior
 */

// Time constants in milliseconds
const MINUTE = 60 * 1000;

/**
 * Cache configurations for different data types
 * - staleTime: How long data is considered fresh (won't refetch)
 * - gcTime: How long unused data stays in cache before garbage collection
 */
export const CACHE_TIMES = {
  /** Products and collections list - frequently updated */
  PRODUCTS: {
    staleTime: 1 * MINUTE,  // 1 minute
    gcTime: 5 * MINUTE,     // 5 minutes
  },

  /** Single product details - slightly longer cache */
  PRODUCT_DETAIL: {
    staleTime: 2 * MINUTE,  // 2 minutes
    gcTime: 10 * MINUTE,    // 10 minutes
  },

  /** Collections list */
  COLLECTIONS: {
    staleTime: 1 * MINUTE,  // 1 minute
    gcTime: 5 * MINUTE,     // 5 minutes
  },

  /** Page configuration (layout, sections) - changes less frequently */
  PAGE_CONFIG: {
    staleTime: 5 * MINUTE,  // 5 minutes
    gcTime: 30 * MINUTE,    // 30 minutes
  },

  /** Static content (homepage, about, theme) - only refresh on page reload */
  STATIC: {
    staleTime: Infinity,
    gcTime: Infinity,
  },
} as const;

/**
 * Default query options for React Query
 */
export const DEFAULT_QUERY_OPTIONS = {
  refetchOnWindowFocus: false,
  retry: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

export type CacheTimesKey = keyof typeof CACHE_TIMES;
