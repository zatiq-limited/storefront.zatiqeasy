"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useShopStore } from "@/stores";
import type { ShopProfile } from "@/types/shop.types";

interface ShopProviderProps {
  children: React.ReactNode;
  initialShopData: ShopProfile | null;
}

// Use useLayoutEffect on client, useEffect on server (to avoid SSR warnings)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function ShopProvider({ children, initialShopData }: ShopProviderProps) {
  const setShopDetails = useShopStore((state) => state.setShopDetails);
  const hasInitialized = useRef(false);

  // Set shop details synchronously using useLayoutEffect
  // This runs before browser paint, ensuring ThemeRouter sees the correct value
  useIsomorphicLayoutEffect(() => {
    if (initialShopData && !hasInitialized.current) {
      hasInitialized.current = true;
      useShopStore.setState({ shopDetails: initialShopData });
    }
  }, [initialShopData]);

  // Handle updates after initial render (e.g., navigation between shops)
  useEffect(() => {
    if (initialShopData) {
      const currentShopDetails = useShopStore.getState().shopDetails;
      // Update if the shop ID changed
      if (currentShopDetails?.id !== initialShopData.id) {
        setShopDetails(initialShopData);
      }
    }
  }, [initialShopData, setShopDetails]);

  return <>{children}</>;
}
