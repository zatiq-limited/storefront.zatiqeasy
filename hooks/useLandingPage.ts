/**
 * useLandingPage - React Query hook for fetching single product landing page data
 * Used for landing pages at /single-product/[slug]
 * Supports both legacy landing pages (Grip, Arcadia, Nirvana) and Theme Builder landing pages
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLandingStore } from "@/stores";
import { DEFAULT_QUERY_OPTIONS } from "@/lib/constants";
import type {
  SingleProductPage,
  ThemeBuilderLandingPage,
  LandingPageResponse,
} from "@/types/landing-page.types";

// Landing page cache times
const LANDING_PAGE_CACHE = {
  staleTime: 2 * 60 * 1000, // 2 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
};

interface UseLandingPageParams {
  slug: string;
  // Priority: shopId > subdomain > domain > shopUuid
  shopId?: string | number;
  subdomain?: string;
  domain?: string;
  shopUuid?: string;
  preview?: boolean;
}

interface UseLandingPageOptions {
  enabled?: boolean;
  syncToStore?: boolean;
}

interface LandingPageApiResponse {
  success: boolean;
  type?: "legacy" | "theme-builder";
  data?: SingleProductPage | ThemeBuilderLandingPage;
  error?: string;
}

export function useLandingPage(
  params: UseLandingPageParams,
  options: UseLandingPageOptions = {}
) {
  const { enabled = true, syncToStore = true } = options;
  const { setPageData, setPrimaryColor, setSecondaryColor } = useLandingStore();

  // Get identifiers - Theme Builder uses shop_id, Legacy uses shop_uuid
  const shopId = params.shopId ? String(params.shopId) : "";
  const shopUuid = params.shopUuid || "";

  // Build query key with all relevant identifiers
  const queryKey = [
    "landing-page",
    params.slug,
    shopId,
    params.subdomain,
    params.domain,
    shopUuid,
    params.preview,
  ];

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<LandingPageResponse> => {
      // Build URL with query params for GET request
      // Theme Builder uses shop_id, Legacy uses shop_uuid
      const searchParams = new URLSearchParams();
      if (shopId) {
        searchParams.set("shop_id", shopId);
      }
      if (shopUuid) {
        searchParams.set("shop_uuid", shopUuid);
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

      // Return with type information
      if (result.type === "theme-builder") {
        return {
          type: "theme-builder",
          data: result.data as ThemeBuilderLandingPage,
        };
      }

      // Default to legacy type
      return {
        type: "legacy",
        data: result.data as SingleProductPage,
      };
    },
    enabled: enabled && !!params.slug && !!(shopId || params.subdomain || params.domain || shopUuid),
    ...LANDING_PAGE_CACHE,
    ...DEFAULT_QUERY_OPTIONS,
  });

  // Sync to Zustand store when data changes (only for legacy pages)
  useEffect(() => {
    if (syncToStore && query.data?.type === "legacy") {
      const legacyData = query.data.data as SingleProductPage;
      setPageData(legacyData);

      // Also update colors if available
      const themeData = legacyData.theme_data?.[0];
      if (themeData?.color?.primary_color) {
        setPrimaryColor(themeData.color.primary_color);
      }
      if (themeData?.color?.secondary_color) {
        setSecondaryColor(themeData.color.secondary_color);
      }
    }
  }, [query.data, syncToStore, setPageData, setPrimaryColor, setSecondaryColor]);

  // Determine page type
  const isThemeBuilder = query.data?.type === "theme-builder";
  const isLegacy = query.data?.type === "legacy";

  // Get typed data based on page type
  const legacyData = isLegacy ? (query.data?.data as SingleProductPage) : null;
  const themeBuilderData = isThemeBuilder
    ? (query.data?.data as ThemeBuilderLandingPage)
    : null;

  return {
    // Raw response with type information
    response: query.data,
    // Page type flags
    isThemeBuilder,
    isLegacy,
    // Typed data getters
    legacyData,
    themeBuilderData,
    // Query state
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
    // Legacy convenience getters (for backward compatibility)
    data: legacyData,
    inventory: legacyData?.inventory,
    themeData: legacyData?.theme_data?.[0],
    themeName: legacyData?.theme_name,
    pageTitle: legacyData?.page_title,
    pageDescription: legacyData?.page_description,
  };
}

export type { SingleProductPage, ThemeBuilderLandingPage, LandingPageResponse };
