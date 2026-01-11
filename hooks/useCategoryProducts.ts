/**
 * useCategoryProducts - Hook for fetching and managing category-filtered products
 * Common hook for all themes (Basic, Aurora, Sellora, etc.)
 *
 * Uses shallow routing for instant category switching without RSC refetches
 */

"use client";

import { useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { useProductsStore } from "@/stores";
import { useShallowSearchParams } from "@/lib/utils/shallow-routing";
import type { Product, Category } from "@/stores/productsStore";

interface Pagination {
  current_page: number;
  total_pages: number;
  per_page: number;
  total: number;
}

export function useCategoryProducts(pageSize: number = 12) {
  const params = useParams();
  const searchParams = useShallowSearchParams(); // Use shallow search params for instant updates
  const { products: allProducts, categories } = useProductsStore();

  // Get category ID from params or search params
  // Route: /merchant/[shopId]/categories/[category] uses "category" param
  const categoryIdParam =
    params?.category ||
    params?.category_id ||
    params?.categoryId ||
    searchParams?.get("category_id") ||
    searchParams?.get("selected_category");
  const categoryId = categoryIdParam ? String(categoryIdParam) : null;

  // Find the current category
  const category = useMemo(() => {
    if (!categoryId || !categories) return null;
    return (
      categories.find((cat: Category) => String(cat.id) === categoryId) || null
    );
  }, [categoryId, categories]);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (!categoryId || !allProducts) return allProducts || [];

    return allProducts.filter((product: Product) => {
      // Check if product belongs to this category
      if (!product.categories) return false;
      return product.categories.some(
        (cat: { id: number | string; name: string }) =>
          String(cat.id) === categoryId
      );
    });
  }, [categoryId, allProducts]);

  // Pagination state with automatic reset when category changes
  // Uses derived state pattern to avoid useEffect setState
  const [pageState, setPageState] = useState<{ categoryId: string | null; page: number }>({
    categoryId,
    page: 1,
  });

  // Derive current page - auto-resets to 1 when categoryId changes
  const currentPage = pageState.categoryId === categoryId ? pageState.page : 1;

  // Memoized setter that includes categoryId to track which category the page belongs to
  const setCurrentPage = useCallback(
    (page: number) => {
      setPageState({ categoryId, page });
    },
    [categoryId]
  );

  // Calculate pagination
  const pagination: Pagination = useMemo(() => {
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / pageSize);
    return {
      current_page: currentPage,
      total_pages: totalPages,
      per_page: pageSize,
      total,
    };
  }, [filteredProducts.length, pageSize, currentPage]);

  // Get products for current page
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, pageSize]);

  // Check loading state based on products availability
  const isLoading = !allProducts || allProducts.length === 0;

  return {
    category,
    products: paginatedProducts,
    allProducts: filteredProducts,
    pagination,
    currentPage,
    setCurrentPage,
    isLoading,
  };
}
