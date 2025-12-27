"use client";

import { useQuery } from "@tanstack/react-query";
import { useThemeBuilderStore } from "@/stores/themeBuilderStore";
import { themeBuilderService } from "@/lib/api/services/theme-builder.service";
import { useEffect } from "react";

// Default shop ID for development - will be replaced with dynamic value
const DEFAULT_SHOP_ID = process.env.NEXT_PUBLIC_SHOP_ID || "85290";

/**
 * Hook to fetch and manage theme builder data
 * 
 * @param shopId - Shop ID to fetch theme for (optional, uses env default)
 * @returns Query result with theme builder data
 * 
 * @example
 * ```tsx
 * const { isLoading, error, theme, homePage } = useThemeBuilder();
 * // or with specific shop ID
 * const { isLoading, error, theme, homePage } = useThemeBuilder("12345");
 * ```
 */
export function useThemeBuilder(shopId?: string | number) {
  const resolvedShopId = String(shopId || DEFAULT_SHOP_ID);
  const { setThemeBuilderData, setLoading, setError } = useThemeBuilderStore();

  const query = useQuery({
    queryKey: ["theme-builder", resolvedShopId],
    queryFn: async () => {
      console.log("[useThemeBuilder] Fetching theme for shop:", resolvedShopId);
      const data = await themeBuilderService.getTheme(resolvedShopId);
      
      if (data) {
        console.log("[useThemeBuilder] ✅ Theme data received:", {
          shopId: data.shopId,
          name: data.name,
          lastPublished: data.last_published,
          hasTheme: !!data.theme,
          hasHomePage: !!data.pages?.home,
        });
      } else {
        console.log("[useThemeBuilder] ℹ️ No theme found for shop:", resolvedShopId);
      }
      
      return data;
    },
    // Don't cache too aggressively - theme may change
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Sync query state to Zustand store
  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);

  useEffect(() => {
    if (query.error) {
      setError(query.error instanceof Error ? query.error.message : "Unknown error");
    }
  }, [query.error, setError]);

  useEffect(() => {
    if (query.data !== undefined) {
      setThemeBuilderData(query.data);
    }
  }, [query.data, setThemeBuilderData]);

  return {
    ...query,
    // Convenience getters
    themeData: query.data,
    theme: query.data?.theme,
    pages: query.data?.pages,
    
    // Individual page getters (matching PageType in merchant panel)
    homePage: query.data?.pages?.home,
    productsPage: query.data?.pages?.products,
    productDetailsPage: query.data?.pages?.productDetails,
    collectionsPage: query.data?.pages?.collections,
    collectionDetailsPage: query.data?.pages?.collectionDetails,
    aboutPage: query.data?.pages?.about,
    contactPage: query.data?.pages?.contact,
    privacyPolicyPage: query.data?.pages?.privacyPolicy,
    cartPage: query.data?.pages?.cart,
    checkoutPage: query.data?.pages?.checkout,
  };
}

export default useThemeBuilder;
