"use client";

import React, { useEffect } from 'react';
import { useShopStore } from '@/stores';

interface ShopProviderProps {
  children: React.ReactNode;
  initialShopData: any;
}

export function ShopProvider({ children, initialShopData }: ShopProviderProps) {
  const { setShopDetails } = useShopStore();

  useEffect(() => {
    if (initialShopData) {
      setShopDetails(initialShopData);
    }
  }, [initialShopData, setShopDetails]);

  return <>{children}</>;
}