/**
 * useShopInventories - React Query hook for fetching shop products/inventories
 * Common hook for all themes (Basic, Aurora, Sellora, etc.)
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchShopInventories, type Product } from "@/lib/api/shop";
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
  const { setProducts } = useProductsStore();

  // Build query key
  const queryKey = ["shop-inventories", params.shopUuid, params.ids];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const products = await fetchShopInventories({
        shop_uuid: params.shopUuid,
        ids: params.ids,
      });

      if (!products) {
        return [];
      }

      // Sort products: in-stock items first, out-of-stock items at the end
      if (sortByStock) {
        return [...products].sort((a, b) => {
          const aInStock = (a.quantity ?? 0) > 0;
          const bInStock = (b.quantity ?? 0) > 0;
          if (aInStock === bInStock) return 0;
          return aInStock ? -1 : 1;
        });
      }

      return products;
    },
    enabled: enabled && !!params.shopUuid,
    ...CACHE_TIMES.SHOP_INVENTORIES,
    ...DEFAULT_QUERY_OPTIONS,
  });

  // Sync to Zustand store when data changes
  useEffect(() => {
    if (syncToStore && query.data && query.data.length > 0) {
      setProducts(query.data as any);
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
