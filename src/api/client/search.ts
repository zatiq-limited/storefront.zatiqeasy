/**
 * Client-side search API functions
 */
'use client';

import { fetchClient } from '../shared';
import type { Product } from '../types';

/**
 * Search products
 */
export async function searchProducts(query: string): Promise<Product[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const products = await fetchClient<Product[]>(
      `/api/storefront/v1/search?q=${encodeURIComponent(query)}`
    );
    console.log(`[API] Search results loaded for: ${query}`);
    return products;
  } catch {
    console.error(`[API] Search API failed for: ${query}`);
    return [];
  }
}

/**
 * Get search suggestions/autocomplete
 */
export async function getSearchSuggestions(query: string): Promise<string[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const suggestions = await fetchClient<string[]>(
      `/api/storefront/v1/search/suggestions?q=${encodeURIComponent(query)}`
    );
    return suggestions;
  } catch {
    console.error(`[API] Search suggestions failed for: ${query}`);
    return [];
  }
}
