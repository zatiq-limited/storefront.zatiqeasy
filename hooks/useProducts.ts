"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useCallback } from "react";
import {
  useProductsStore,
  type ProductFilters,
  type Product,
  type Pagination,
} from "@/stores/productsStore";
import { CACHE_TIMES, DEFAULT_QUERY_OPTIONS, API_ROUTES } from "@/lib/constants";

interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: Pagination;
  };
}

interface ProductsPageConfigResponse {
  success: boolean;
  data: {
    template: string;
    sections: Array<{
      id: string;
      type: string;
      enabled: boolean;
      settings: Record<string, unknown>;
    }>;
    seo: Record<string, unknown>;
  };
}

// Build query string from filters
function buildQueryString(filters: ProductFilters): string {
  const params = new URLSearchParams();
  params.set("page", filters.page.toString());
  params.set("limit", filters.limit.toString());
  if (filters.category) params.set("category", filters.category);
  if (filters.search) params.set("search", filters.search);
  if (filters.sort) params.set("sort", filters.sort);
  return params.toString();
}

// Fetch products with filters
async function fetchProducts(filters: ProductFilters): Promise<ProductsResponse> {
  const queryString = buildQueryString(filters);
  const res = await fetch(`${API_ROUTES.PRODUCTS}?${queryString}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// Fetch products page configuration
async function fetchProductsPageConfig(): Promise<ProductsPageConfigResponse> {
  const res = await fetch(API_ROUTES.PAGE_PRODUCTS);
  if (!res.ok) throw new Error("Failed to fetch products page config");
  return res.json();
}

export function useProducts() {
  const {
    filters,
    products: storeProducts,
    pagination: storePagination,
    productsPageConfig: storePageConfig,
    setProducts,
    setPagination,
    setFilters,
    setProductsPageConfig,
    setLoading,
    setError,
  } = useProductsStore();

  // Check if we have store data for initialData
  const hasStoreProducts = storeProducts && storeProducts.length > 0;
  const hasStorePageConfig = storePageConfig && Object.keys(storePageConfig).length > 0;

  // Products query with shallow comparison for filters
  const productsQuery = useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
    // Use store data as initialData for instant page transitions
    initialData: hasStoreProducts && storePagination
      ? { success: true, data: { products: storeProducts, pagination: storePagination } }
      : undefined,
    ...CACHE_TIMES.PRODUCTS,
    ...DEFAULT_QUERY_OPTIONS,
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });

  // Products page config query - fetched once and cached longer
  const pageConfigQuery = useQuery({
    queryKey: ["products-page-config"],
    queryFn: fetchProductsPageConfig,
    initialData: hasStorePageConfig
      ? { success: true, data: storePageConfig as ProductsPageConfigResponse["data"] }
      : undefined,
    ...CACHE_TIMES.PAGE_CONFIG,
    ...DEFAULT_QUERY_OPTIONS,
  });

  // Sync products to store
  useEffect(() => {
    if (productsQuery.data?.data) {
      setProducts(productsQuery.data.data.products);
      setPagination(productsQuery.data.data.pagination);
    }
    setLoading(productsQuery.isLoading);
    if (productsQuery.error) {
      setError((productsQuery.error as Error).message);
    } else {
      setError(null);
    }
  }, [
    productsQuery.data,
    productsQuery.isLoading,
    productsQuery.error,
    setProducts,
    setPagination,
    setLoading,
    setError,
  ]);

  // Sync page config to store and extract products_per_page
  useEffect(() => {
    if (pageConfigQuery.data?.data) {
      setProductsPageConfig(pageConfigQuery.data.data as Record<string, unknown>);

      // Extract products_per_page from products-layout section
      const sections = pageConfigQuery.data.data.sections || [];
      const layoutSection = sections.find((s) => s.type.includes("products-layout"));
      if (layoutSection?.settings?.products_per_page) {
        const productsPerPage = layoutSection.settings.products_per_page as number;
        if (productsPerPage !== filters.limit) {
          setFilters({ limit: productsPerPage });
        }
      }
    }
  }, [pageConfigQuery.data, setProductsPageConfig, setFilters, filters.limit]);

  // Update filters and trigger refetch
  const updateFilters = useCallback(
    (newFilters: Partial<ProductFilters>) => {
      setFilters(newFilters);
    },
    [setFilters]
  );

  // Pagination helpers
  const goToPage = useCallback(
    (page: number) => {
      setFilters({ page });
    },
    [setFilters]
  );

  const nextPage = useCallback(() => {
    const { pagination } = useProductsStore.getState();
    if (pagination && filters.page < pagination.total_pages) {
      setFilters({ page: filters.page + 1 });
    }
  }, [filters.page, setFilters]);

  const prevPage = useCallback(() => {
    if (filters.page > 1) {
      setFilters({ page: filters.page - 1 });
    }
  }, [filters.page, setFilters]);

  // Search with debounce-friendly pattern
  const setSearch = useCallback(
    (search: string | null) => {
      setFilters({ search, page: 1 }); // Reset to page 1 on search
    },
    [setFilters]
  );

  // Sort
  const setSort = useCallback(
    (sort: string) => {
      setFilters({ sort, page: 1 }); // Reset to page 1 on sort change
    },
    [setFilters]
  );

  // Category filter
  const setCategory = useCallback(
    (category: string | null) => {
      setFilters({ category, page: 1 }); // Reset to page 1 on category change
    },
    [setFilters]
  );

  return {
    // Queries
    productsQuery,
    pageConfigQuery,

    // Data (from query for reactivity)
    products: productsQuery.data?.data?.products || [],
    pagination: productsQuery.data?.data?.pagination || null,
    sections: pageConfigQuery.data?.data?.sections || [],
    seo: pageConfigQuery.data?.data?.seo || {},

    // State
    isLoading: productsQuery.isLoading || productsQuery.isFetching,
    isPageConfigLoading: pageConfigQuery.isLoading,
    error: productsQuery.error,
    filters,

    // Actions
    updateFilters,
    goToPage,
    nextPage,
    prevPage,
    setSearch,
    setSort,
    setCategory,
    refetch: productsQuery.refetch,
  };
}