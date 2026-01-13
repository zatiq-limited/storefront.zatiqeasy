/**
 * useShopInventories - React Query hook for fetching shop products/inventories
 * Common hook for all themes (Basic, Aurora, Sellora, etc.)
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { type Product } from "@/lib/api/types";
import { useProductsStore } from "@/stores";
import { CACHE_TIMES, DEFAULT_QUERY_OPTIONS } from "@/lib/constants";

interface UseShopInventoriesParams {
  shopUuid: string;
  ids?: string[];
}

interface UseShopInventoriesOptions {
  enabled?: boolean;
  syncToStore?: boolean;
  sortByStock?: boolean;
}

export function useShopInventories(
  params: UseShopInventoriesParams,
  options: UseShopInventoriesOptions = {}
) {
  const { enabled = true, syncToStore = true, sortByStock = true } = options;
  const { setProducts, products: storeProducts } = useProductsStore();

  // Build query key
  const queryKey = ["shop-inventories", params.shopUuid, params.ids];

  // Use store products as initial data to prevent unnecessary fetches
  // This helps when navigating between pages that already loaded products
  const hasStoreData = storeProducts && storeProducts.length > 0;

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      // Fetch inventories from local API route
      const response = await fetch("/api/storefront/v1/inventories", {
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
        throw new Error("Failed to fetch inventories");
      }

      const result = await response.json();
      const products = result.data || [];

      if (!products) {
        return [];
      }

      // Sort products: in-stock items first, out-of-stock items at the end
      if (sortByStock) {
        return [...products].sort((a: Product, b: Product) => {
          const aInStock = (a.quantity ?? 0) > 0;
          const bInStock = (b.quantity ?? 0) > 0;
          if (aInStock === bInStock) return 0;
          return aInStock ? -1 : 1;
        });
      }

      return products;
    },
    enabled: enabled && !!params.shopUuid,
    // Use store data as initial data to prevent loading state on navigation
    initialData: hasStoreData ? storeProducts : undefined,
    ...CACHE_TIMES.SHOP_INVENTORIES,
    ...DEFAULT_QUERY_OPTIONS,
  });

  // Sync to Zustand store when data changes
  useEffect(() => {
    if (syncToStore && query.data && query.data.length > 0) {
      setProducts(query.data as Product[]);
    }
  }, [query.data, syncToStore, setProducts]);

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

export type { Product };
