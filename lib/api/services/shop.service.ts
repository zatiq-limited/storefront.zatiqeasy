/**
 * Shop API Service
 * All shop-related API calls (profile, products, categories)
 */

import { cache } from "react";
import { apiClient } from "../client";
import type { Product, Category, ApiResponse } from "../types";
import type { ShopProfile } from "@/types/shop.types";

/**
 * Internal profile fetch function (uncached)
 */
async function fetchProfile(params: {
  shop_id?: string | number;
  domain?: string;
  subdomain?: string;
}): Promise<ShopProfile | null> {
  try {
    const { data } = await apiClient.post<ApiResponse<ShopProfile>>(
      "/api/v1/live/profile",
      params
    );

    if (data?.data?.id) {
      return data.data;
    }
    return null;
  } catch (error) {
    if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "DEV") {
      console.error("Error fetching shop profile:", error);
    }
    return null;
  }
}

/**
 * Cached profile fetch - deduplicates requests within a single render pass
 * This ensures generateMetadata and RootLayout share the same fetch result
 * React's cache() deduplicates calls with the same arguments within a single render
 */
export const getShopProfileCached = cache(
  async (params: {
    shop_id?: string | number;
    domain?: string;
    subdomain?: string;
  }): Promise<ShopProfile | null> => {
    return fetchProfile(params);
  }
);

export const shopService = {
  /**
   * Fetch shop profile data
   * Note: For server components, use getShopProfileCached for request deduplication
   */
  async getProfile(params: {
    shop_id?: string | number;
    domain?: string;
    subdomain?: string;
  }): Promise<ShopProfile | null> {
    return fetchProfile(params);
  },

  /**
   * Fetch shop products/inventories
   * Uses encryption for payload (handled by interceptor)
   * Note: Uses 'identifier' in payload, not 'shop_uuid'
   */
  async getProducts(params: {
    shop_uuid: string;
    ids?: string[];
  }): Promise<Product[] | null> {
    try {
      const endpoint = `/api/v1/live/inventories${
        params.ids && params.ids.length > 0
          ? `?filter[id]=${params.ids.join(",")}`
          : ""
      }`;

      const { data } = await apiClient.post<ApiResponse<Product[]>>(
        endpoint,
        { identifier: params.shop_uuid } // Use 'identifier' key as expected by API
      );

      if (data?.data) {
        return data.data;
      }
      return null;
    } catch (error) {
      if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "DEV") {
        console.error("Error fetching shop products:", error);
      }
      return null;
    }
  },

  /**
   * Fetch shop categories
   * Note: Uses 'identifier' in payload, not 'shop_uuid'
   */
  async getCategories(params: {
    shop_uuid: string;
    ids?: string[];
  }): Promise<Category[] | null> {
    try {
      const endpoint = `/api/v1/live/filtered_categories${
        params.ids && params.ids.length > 0
          ? `?filter[id]=${params.ids.join(",")}`
          : ""
      }`;

      const { data } = await apiClient.post<ApiResponse<Category[]>>(
        endpoint,
        { identifier: params.shop_uuid } // Use 'identifier' key as expected by API
      );

      if (data?.data) {
        return data.data;
      }
      return null;
    } catch (error) {
      if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "DEV") {
        console.error("Error fetching shop categories:", error);
      }
      return null;
    }
  },
};
