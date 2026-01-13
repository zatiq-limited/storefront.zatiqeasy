"use client";

import { useQuery } from "@tanstack/react-query";
import { useHomepageStore } from "@/stores/homepageStore";
import { useShopStore } from "@/stores/shopStore";
import { useEffect } from "react";
import { CACHE_TIMES, DEFAULT_QUERY_OPTIONS, API_ROUTES } from "@/lib/constants";

async function fetchHomepage(shopId?: string | number) {
  // Build URL with shop_id if available
  const url: string = shopId
    ? `${API_ROUTES.PAGE_HOME}?shop_id=${shopId}`
    : API_ROUTES.PAGE_HOME;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch homepage");
  return res.json();
}

export function useHomepage() {
  const { homepage: storeHomepage, setHomepage } = useHomepageStore();
  const shopDetails = useShopStore((state) => state.shopDetails);

  // Get shop_id from store
  const shopId = shopDetails?.id;

  // Check if we have homepage data in store for initialData
  const hasStoreHomepage = storeHomepage && Object.keys(storeHomepage).length > 0;

  const query = useQuery({
    queryKey: ["homepage", shopId],
    queryFn: () => fetchHomepage(shopId),
    // Use store data as initialData for instant page transitions
    initialData: hasStoreHomepage ? storeHomepage : undefined,
    ...CACHE_TIMES.STATIC,
    ...DEFAULT_QUERY_OPTIONS,
    // Only fetch when we have a shop ID
    enabled: !!shopId,
  });

  // Sync to Zustand when data changes
  useEffect(() => {
    if (query.data) {
      setHomepage(query.data);
    }
  }, [query.data, setHomepage]);

  return query;
}
