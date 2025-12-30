"use client";

import { useMemo, useCallback } from "react";
import { useShopStore } from "@/stores";

interface PriceFormattingOptions {
  /** Number of decimal places (default: 2) */
  decimals?: number;
  /** Whether to include currency symbol (default: true) */
  includeCurrency?: boolean;
}

/**
 * Hook for consistent price formatting across the application
 * Common hook for all themes (Basic, Aurora, Sellora, etc.)
 * Uses shop currency settings and provides utility functions
 */
export function usePriceFormatting() {
  const { shopDetails } = useShopStore();

  // Get currency symbol based on shop settings
  const currency = useMemo(() => {
    const currencyCode = shopDetails?.currency_code;
    if (currencyCode === "BDT") return "Tk";
    return currencyCode || "$";
  }, [shopDetails?.currency_code]);

  // Format a price with currency
  const formatPrice = useCallback(
    (price: number, options: PriceFormattingOptions = {}) => {
      const { decimals = 2, includeCurrency = true } = options;
      const formattedNumber = Number(price.toFixed(decimals)).toLocaleString();
      return includeCurrency
        ? `${currency} ${formattedNumber}`
        : formattedNumber;
    },
    [currency]
  );

  // Calculate discount amount
  const calculateDiscount = useCallback(
    (price: number, oldPrice: number | null | undefined): number => {
      if (!oldPrice || oldPrice <= price) return 0;
      return oldPrice - price;
    },
    []
  );

  // Calculate discount percentage
  const calculateDiscountPercent = useCallback(
    (price: number, oldPrice: number | null | undefined): number => {
      if (!oldPrice || oldPrice <= price) return 0;
      return Math.round(((oldPrice - price) / oldPrice) * 100);
    },
    []
  );

  // Format discount display (e.g., "Save 100 Tk")
  const formatDiscount = useCallback(
    (price: number, oldPrice: number | null | undefined): string | null => {
      const discount = calculateDiscount(price, oldPrice);
      if (discount === 0) return null;
      return `Save ${Number(discount.toFixed(2)).toLocaleString()} ${currency}`;
    },
    [currency, calculateDiscount]
  );

  return {
    /** Currency symbol (e.g., 'Tk', '$') */
    currency,
    /** Format a price with currency */
    formatPrice,
    /** Calculate discount amount */
    calculateDiscount,
    /** Calculate discount percentage */
    calculateDiscountPercent,
    /** Format discount display text */
    formatDiscount,
  };
}
