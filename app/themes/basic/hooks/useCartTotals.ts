"use client";

import { useMemo } from "react";
import { useCartStore } from "@/stores";

/**
 * Hook to calculate cart totals
 * Extracted from basic-home-page and basic-category-page to avoid duplication
 */
export function useCartTotals() {
  // Get cart products directly from store
  const products = useCartStore((state) => state.products);

  // Calculate totals in useMemo to avoid recalculation on every render
  const { totalPrice, totalProducts, productCount } = useMemo(() => {
    const productList = Object.values(products);
    return {
      totalPrice: productList.reduce((sum, p) => sum + p.price * p.qty, 0),
      totalProducts: productList.reduce((sum, p) => sum + p.qty, 0),
      productCount: productList.length,
    };
  }, [products]);

  return {
    /** Total price of all products in cart */
    totalPrice,
    /** Total quantity of all products (sum of qty) */
    totalProducts,
    /** Number of unique products in cart */
    productCount,
    /** Whether cart has any items */
    hasItems: totalProducts > 0,
    /** Raw products object from store */
    products,
  };
}
