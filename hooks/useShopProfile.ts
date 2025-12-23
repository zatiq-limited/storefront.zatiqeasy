/**
 * useShopProfile - React Query hook for fetching shop profile data
 * Common hook for all themes (Basic, Aurora, Sellora, etc.)
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useShopStore } from "@/stores";
import { CACHE_TIMES, DEFAULT_QUERY_OPTIONS } from "@/lib/constants";
import type { ShopProfile } from "@/types/shop.types";

interface UseShopProfileParams {
  shopId?: string | number;
  domain?: string;
  subdomain?: string;
}

interface UseShopProfileOptions {
  enabled?: boolean;
  syncToStore?: boolean;
}

export function useShopProfile(
  params: UseShopProfileParams,
  options: UseShopProfileOptions = {}
) {
  const { enabled = true, syncToStore = true } = options;
  const { setShopDetails } = useShopStore();

  // Build query key based on params
  const queryKey = [
    "shop-profile",
    params.shopId,
    params.domain,
    params.subdomain,
  ];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      // Call local API route instead of external API
      const response = await fetch("/api/storefront/v1/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shop_id: params.shopId,
          domain: params.domain,
          subdomain: params.subdomain,
        }),
      });

      if (!response.ok) {
        throw new Error("Shop not found");
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error("Shop not found");
      }

      return result.data;
    },
    enabled: enabled && !!(params.shopId || params.domain || params.subdomain),
    ...CACHE_TIMES.SHOP_PROFILE,
    ...DEFAULT_QUERY_OPTIONS,
  });

  // Sync to Zustand store when data changes
  useEffect(() => {
    if (syncToStore && query.data) {
      setShopDetails({
        ...query.data,
        id: Number(query.data.id),
        shop_name: query.data.shop_name ?? "",
        currency_code: query.data.currency_code || "BDT",
        country_currency: query.data.country_currency || "BDT",
        shop_email: query.data.shop_email ?? "",
        shop_phone: query.data.shop_phone ?? "",
        shop_uuid: query.data.shop_uuid ?? "",
        hasPixelAccess: query.data.hasPixelAccess ?? false,
        hasGTMAccess: query.data.hasGTMAccess ?? false,
        hasTikTokPixelAccess: query.data.hasTikTokPixelAccess ?? false,
        baseUrl: `/merchant/${params.shopId}`,
        shopCurrencySymbol: query.data.currency_code === "BDT" ? "৳" : "$",
      } as ShopProfile);
    }
  }, [query.data, syncToStore, setShopDetails, params.shopId]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

export type { ShopProfile };
