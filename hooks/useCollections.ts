/**
 * useCollections - React Query hook for fetching collections (categories)
 * Collections = Categories in the merchant system
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { useShopStore } from "@/stores";
import { CACHE_TIMES, DEFAULT_QUERY_OPTIONS } from "@/lib/constants";

// Types matching the transformed collection format
export interface Collection {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url: string;
  banner_url?: string;
  product_count: number;
  sort_order?: number;
  children?: {
    id: number;
    name: string;
    slug: string;
    image_url: string;
    product_count: number;
  }[];
}

interface CollectionsResponse {
  success: boolean;
  data: {
    collections: Collection[];
    pagination?: {
      current_page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
  };
}

interface CollectionsPageConfigResponse {
  success: boolean;
  data: {
    template: string;
    sections: Array<{
      id: string;
      type: string;
      enabled: boolean;
      settings: Record<string, unknown>;
    }>;
    seo: Record<string, unknown>;
  };
}

// Fetch collections page configuration
async function fetchCollectionsPageConfig(): Promise<CollectionsPageConfigResponse> {
  const res = await fetch("/api/storefront/v1/page/collections");
  if (!res.ok) throw new Error("Failed to fetch collections page config");
  return res.json();
}

export function useCollections() {
  // Get shop_uuid from store
  const shopDetails = useShopStore((state) => state.shopDetails);
  const shopUuid = shopDetails?.shop_uuid;

  // Collections query - uses categories API under the hood
  const collectionsQuery = useQuery({
    queryKey: ["collections", shopUuid],
    queryFn: async (): Promise<CollectionsResponse> => {
      if (!shopUuid) {
        return { success: true, data: { collections: [] } };
      }

      const response = await fetch("/api/storefront/v1/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shop_uuid: shopUuid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch collections");
      }

      return response.json();
    },
    enabled: !!shopUuid,
    ...CACHE_TIMES.COLLECTIONS,
    ...DEFAULT_QUERY_OPTIONS,
  });

  // Collections page config query - fetched once and cached longer
  const pageConfigQuery = useQuery({
    queryKey: ["collections-page-config"],
    queryFn: fetchCollectionsPageConfig,
    ...CACHE_TIMES.PAGE_CONFIG,
    ...DEFAULT_QUERY_OPTIONS,
  });

  return {
    // Queries
    collectionsQuery,
    pageConfigQuery,

    // Data (from query for reactivity)
    collections: collectionsQuery.data?.data?.collections || [],
    sections: pageConfigQuery.data?.data?.sections || [],
    seo: pageConfigQuery.data?.data?.seo || {},

    // State - don't show loading if we don't have shop_uuid yet
    isLoading: shopUuid ? collectionsQuery.isLoading : false,
    isCollectionsLoading: shopUuid ? collectionsQuery.isLoading : false,
    isPageConfigLoading: pageConfigQuery.isLoading,
    error: collectionsQuery.error || pageConfigQuery.error,

    // Shop state
    hasShopUuid: !!shopUuid,

    // Actions
    refetch: () => {
      collectionsQuery.refetch();
      pageConfigQuery.refetch();
    },
  };
}
