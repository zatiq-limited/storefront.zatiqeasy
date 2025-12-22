"use client";

import React, { useEffect } from 'react';
import { useShopStore } from '@/stores';

interface ShopProviderProps {
  children: React.ReactNode;
  initialShopData: any;
}

export function ShopProvider({ children, initialShopData }: ShopProviderProps) {
  const setShopDetails = useShopStore((state) => state.setShopDetails);

  // Set shop details if we have them and they're different from current
  useEffect(() => {
    if (initialShopData) {
      const currentShopDetails = useShopStore.getState().shopDetails;
      // Only update if the data is different (avoid unnecessary updates)
      if (!currentShopDetails || currentShopDetails.id !== initialShopData.id) {
        setShopDetails(initialShopData);
      }
    }
  }, [initialShopData, setShopDetails]);

  return <>{children}</>;
}