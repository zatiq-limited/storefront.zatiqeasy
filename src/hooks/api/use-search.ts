/**
 * Search Hook - React Query hook for search with debounce
 */
'use client';

import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '../use-debounce';
import { searchProducts } from '@/api/client/search';
import type { Product } from '@/api/types';

/**
 * Query keys for search
 */
export const searchKeys = {
  all: ['search'] as const,
  query: (q: string) => [...searchKeys.all, q] as const,
};

/**
 * Hook to search products with debounce
 */
export function useSearch(query: string, debounceMs: number = 300) {
  const debouncedQuery = useDebounce(query, debounceMs);

  return useQuery<Product[]>({
    queryKey: searchKeys.query(debouncedQuery),
    queryFn: () => searchProducts(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 60 * 1000, // 1 minute
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });
}
