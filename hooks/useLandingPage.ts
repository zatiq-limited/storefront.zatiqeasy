/**
 * useLandingPage - React Query hook for fetching single product landing page data
 * Used for landing pages at /single-product/[slug]
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLandingStore } from "@/stores";
import { DEFAULT_QUERY_OPTIONS } from "@/lib/constants";
import type { SingleProductPage } from "@/types/landing-page.types";

// Landing page cache times
const LANDING_PAGE_CACHE = {
  staleTime: 2 * 60 * 1000, // 2 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
};

interface UseLandingPageParams {
  slug: string;
  shopUuid?: string;
  shopId?: string | number;
  preview?: boolean;
}

interface UseLandingPageOptions {
  enabled?: boolean;
  syncToStore?: boolean;
}

interface LandingPageApiResponse {
  success: boolean;
  data?: SingleProductPage;
  error?: string;
}

export function useLandingPage(
  params: UseLandingPageParams,
  options: UseLandingPageOptions = {}
) {
  const { enabled = true, syncToStore = true } = options;
  const { setPageData, setPrimaryColor, setSecondaryColor } = useLandingStore();

  // Build query key
  const queryKey = [
    "landing-page",
    params.slug,
    params.shopUuid || params.shopId,
    params.preview,
  ];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      // Build URL with query params for GET request
      const searchParams = new URLSearchParams();
      if (params.shopUuid) {
        searchParams.set("shop_uuid", params.shopUuid);
      }
      if (params.shopId) {
        searchParams.set("shop_id", String(params.shopId));
      }
      if (params.preview) {
        searchParams.set("preview", "true");
      }

      const response = await fetch(
        `/api/storefront/v1/landing/${params.slug}?${searchParams.toString()}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Landing page not found");
        }
        throw new Error("Failed to fetch landing page");
      }

      const result: LandingPageApiResponse = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || "Landing page not found");
      }

      return result.data;
    },
    enabled: enabled && !!params.slug && !!(params.shopUuid || params.shopId),
    ...LANDING_PAGE_CACHE,
    ...DEFAULT_QUERY_OPTIONS,
  });

  // Sync to Zustand store when data changes
  useEffect(() => {
    if (syncToStore && query.data) {
      setPageData(query.data);

      // Also update colors if available
      const themeData = query.data.theme_data?.[0];
      if (themeData?.color?.primary_color) {
        setPrimaryColor(themeData.color.primary_color);
      }
      if (themeData?.color?.secondary_color) {
        setSecondaryColor(themeData.color.secondary_color);
      }
    }
  }, [query.data, syncToStore, setPageData, setPrimaryColor, setSecondaryColor]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
    // Convenience getters
    inventory: query.data?.inventory,
    themeData: query.data?.theme_data?.[0],
    themeName: query.data?.theme_name,
    pageTitle: query.data?.page_title,
    pageDescription: query.data?.page_description,
  };
}

export type { SingleProductPage };
