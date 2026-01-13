/**
 * useShopCategories - React Query hook for fetching shop categories
 * Common hook for all themes (Basic, Aurora, Sellora, etc.)
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { type Category } from "@/lib/api/types";
import { useProductsStore } from "@/stores";
import { CACHE_TIMES, DEFAULT_QUERY_OPTIONS } from "@/lib/constants";

interface UseShopCategoriesParams {
  shopUuid: string;
  ids?: string[];
}

interface UseShopCategoriesOptions {
  enabled?: boolean;
  syncToStore?: boolean;
}

export function useShopCategories(
  params: UseShopCategoriesParams,
  options: UseShopCategoriesOptions = {}
) {
  const { enabled = true, syncToStore = true } = options;
  const { setCategories, categories: storeCategories } = useProductsStore();

  // Build query key
  const queryKey = ["shop-categories", params.shopUuid, params.ids];

  // Use store categories as initial data to prevent unnecessary fetches
  const hasStoreData = storeCategories && storeCategories.length > 0;

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      // Fetch categories from local API route
      const response = await fetch("/api/storefront/v1/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shop_uuid: params.shopUuid,
          ids: params.ids,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const result = await response.json();
      const categories = result.data || [];

      if (!categories) {
        return [];
      }

      return categories;
    },
    enabled: enabled && !!params.shopUuid,
    // Use store data as initial data to prevent loading state on navigation
    initialData: hasStoreData ? storeCategories : undefined,
    ...CACHE_TIMES.SHOP_CATEGORIES,
    ...DEFAULT_QUERY_OPTIONS,
  });

  // Sync to Zustand store when data changes
  useEffect(() => {
    if (syncToStore && query.data && query.data.length > 0) {
      // Categories from API match the store's expected type
      setCategories(query.data);
    }
  }, [query.data, syncToStore, setCategories]);

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
    isEmpty: !query.isLoading && (!query.data || query.data.length === 0),
  };
}

export type { Category };
