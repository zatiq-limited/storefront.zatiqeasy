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
  const { setTheme } = useThemeStore();
  const shopDetails = useShopStore((state) => state.shopDetails);

  // Get shop_id from store
  const shopId = shopDetails?.id;

  const query = useQuery({
    queryKey: ["theme", shopId],
    queryFn: () => fetchTheme(shopId),
    ...CACHE_TIMES.STATIC,
    ...DEFAULT_QUERY_OPTIONS,
    // Only fetch when we have a shop ID
    enabled: !!shopId,
  });

  // Sync to Zustand when data changes
  useEffect(() => {
    if (query.data) {
      setTheme(query.data);
    }
  }, [query.data, setTheme]);

  return query;
}
