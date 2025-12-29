"use client";

import { useState } from "react";
import { shopService } from "@/lib/api/services/shop.service";
import type { ShopProfile } from "@/types/shop.types";

/**
 * Hook to manage shop profile fetching from client-side
 */
export function useShopProfileManager() {
  const [shopProfile, setShopProfile] = useState<ShopProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShopById = async (shopId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const profile = await shopService.getProfile({ shop_id: shopId });

      if (profile) {
        setShopProfile(profile);
        return profile;
      } else {
        setError("Shop not found");
        return null;
      }
    } catch (err) {
      setError("Failed to fetch shop profile");
      console.error("Error fetching shop:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearShopProfile = () => {
    setShopProfile(null);
    setError(null);
  };

  return {
    shopProfile,
    isLoading,
    error,
    fetchShopById,
    clearShopProfile,
  };
}
