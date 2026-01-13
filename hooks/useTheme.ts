"use client";

import { useQuery } from "@tanstack/react-query";
import { useThemeStore } from "@/stores/themeStore";
import { useShopStore } from "@/stores/shopStore";
import { useEffect } from "react";
import { CACHE_TIMES, DEFAULT_QUERY_OPTIONS, API_ROUTES } from "@/lib/constants";

async function fetchTheme(shopId?: string | number) {
  // Build URL with shop_id if available
  const url: string = shopId
    ? `${API_ROUTES.THEME}?shop_id=${shopId}`
    : API_ROUTES.THEME;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch theme");
  return res.json();
}

export function useTheme() {
  const { theme: storeTheme, setTheme } = useThemeStore();
  const shopDetails = useShopStore((state) => state.shopDetails);

  // Get shop_id and legacy_theme flag from store
  const shopId = shopDetails?.id;
  // Only theme builder mode (legacy_theme === false) needs to fetch theme config
  // Legacy/static themes have hardcoded layouts and don't need this API call
  const isLegacyTheme = shopDetails?.legacy_theme ?? true;

  // Check if we have theme data in store for initialData
  const hasStoreTheme = storeTheme && Object.keys(storeTheme).length > 0;

  const query = useQuery({
    queryKey: ["theme", shopId],
    queryFn: () => fetchTheme(shopId),
    // Use store data as initialData for instant page transitions
    initialData: hasStoreTheme ? storeTheme : undefined,
    ...CACHE_TIMES.STATIC,
    ...DEFAULT_QUERY_OPTIONS,
    // Only fetch when:
    // 1. We have a shop ID
    // 2. We're NOT using legacy theme (static themes don't need theme API)
    enabled: !!shopId && !isLegacyTheme,
  });

  // Sync to Zustand when data changes
  useEffect(() => {
    if (query.data) {
      setTheme(query.data);
    }
  }, [query.data, setTheme]);

  return query;
}
