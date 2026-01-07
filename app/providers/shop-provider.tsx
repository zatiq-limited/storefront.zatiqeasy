"use client";

import React, { useEffect, useRef } from "react";
import { useShopStore } from "@/stores";
import type { ShopProfile } from "@/types/shop.types";

interface ShopProviderProps {
  children: React.ReactNode;
  initialShopData: ShopProfile | null;
}

export function ShopProvider({ children, initialShopData }: ShopProviderProps) {
  const setShopDetails = useShopStore((state) => state.setShopDetails);
  const hasInitialized = useRef(false);

  // Set shop details SYNCHRONOUSLY on first render to avoid race conditions
  // This ensures ThemeRouter sees the correct legacy_theme value immediately
  if (initialShopData && !hasInitialized.current) {
    hasInitialized.current = true;
    // Synchronously update the store before children render
    useShopStore.setState({ shopDetails: initialShopData });
  }

  // Also handle updates after initial render (e.g., navigation between shops)
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
