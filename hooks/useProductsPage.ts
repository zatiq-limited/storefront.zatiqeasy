/**
 * useProductsPage Hook
 * Fetches the products page configuration/sections from the API
 * Used by theme builder mode to render the products page design
 */

import { useQuery } from "@tanstack/react-query";
import type { Section } from "@/lib/types";

interface ProductsPageData {
  template: string;
  sections: Section[];
  seo?: {
    title?: string;
    description?: string;
    canonical?: string;
    og?: Record<string, string>;
    twitter?: Record<string, string>;
  };
}

interface ProductsPageResponse {
  success: boolean;
  data: ProductsPageData;
}

export function useProductsPage(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["products-page"],
    queryFn: async (): Promise<ProductsPageData> => {
      const response = await fetch("/api/storefront/v1/page/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products page configuration");
      }
      const result: ProductsPageResponse = await response.json();
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: options?.enabled ?? true,
  });
}
