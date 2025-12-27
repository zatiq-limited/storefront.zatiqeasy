"use client";

import { useQuery } from "@tanstack/react-query";
import { CACHE_TIMES, DEFAULT_QUERY_OPTIONS } from "@/lib/constants";

export interface CustomPages {
  about_us?: string;
  privacy_policy?: string;
  terms_and_condition?: string;
  return_and_cancellation_policy?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://easybill.zatiq.tech";

async function fetchCustomPages(shopId: string | number): Promise<CustomPages> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/live/shop_custom_pages/${shopId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Device-Type": "Web",
          "Application-Type": "Online_Shop",
        },
      }
    );

    if (!res.ok) {
      // Return empty object if custom pages don't exist
      return {};
    }

    const json = await res.json();
    return json.data || json || {};
  } catch (error) {
    console.error("Failed to fetch custom pages:", error);
    return {};
  }
}

export function useShopCustomPages(shopId: string | number | undefined) {
  return useQuery({
    queryKey: ["shopCustomPages", shopId],
    queryFn: () => fetchCustomPages(shopId!),
    enabled: !!shopId,
    ...CACHE_TIMES.STATIC,
    ...DEFAULT_QUERY_OPTIONS,
  });
}
