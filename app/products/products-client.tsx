/**
 * Products Client Component
 * Handles all client-side interactivity for the products listing page
 */

"use client";

import { useProducts } from "@/hooks";
import ProductsPageRenderer from "@/components/renderers/page-renderer/products-page-renderer";
import type { Section } from "@/lib/types";

export default function ProductsClient() {
  const {
    products,
    pagination,
    sections,
    filters,
    isLoading,
    isPageConfigLoading,
    error,
    updateFilters,
  } = useProducts();

  // Show loading state while page config is loading
  if (isPageConfigLoading) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  // Show error state
  if (error) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-red-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error loading products
          </h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </main>
    );
  }

  // Default sections if none provided
  const defaultSections: Section[] = [
    {
      id: "products_hero",
      type: "products-hero-1",
      enabled: true,
      settings: {
        title: "All Products",
        description: "Discover our curated collection of premium products",
        show_breadcrumb: true,
        show_product_count: true,
        gradient_start: "#EBF4FF",
        gradient_end: "#F3E8FF",
      },
    },
    {
      id: "products_layout",
      type: "products-layout",
      enabled: true,
      settings: {
        show_sidebar: false,
        show_search: true,
        show_sort: true,
        show_view_toggle: true,
        columns: 4,
        gap: 6,
        sticky: true,
      },
    },
  ];

  const pageSections =
    sections.length > 0 ? (sections as Section[]) : defaultSections;

  return (
    <main className="zatiq-products-page min-h-screen bg-gray-50">
      <ProductsPageRenderer
        sections={pageSections}
        products={products}
        pagination={pagination}
        filters={filters}
        onFiltersChange={updateFilters}
        isLoading={isLoading}
      />
    </main>
  );
}
