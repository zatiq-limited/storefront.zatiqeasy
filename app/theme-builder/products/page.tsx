/**
 * Theme Builder Preview - Products Page
 *
 * Route: /theme-builder/products
 *
 * Renders the products page using sections from Theme Builder API.
 * Design logic: ProductsPageRenderer
 * Which sections to show: Theme Builder API (with settings)
 * Real product data: Shop API
 */

"use client";

import { useThemeBuilderStore } from "@/stores/themeBuilderStore";
import { useProducts } from "@/hooks";
import ProductsPageRenderer from "@/components/renderers/page-renderer/products-page-renderer";
import { useRoutePrefix } from "@/providers/RoutePrefixProvider";
import type { Section } from "@/lib/types";

export default function ThemeBuilderProductsPage() {
  const { routePrefix } = useRoutePrefix();
  const { productsPage, themeBuilderData } = useThemeBuilderStore();
  const {
    products,
    pagination,
    filters,
    isLoading,
    updateFilters,
  } = useProducts();

  // No products page data from Theme Builder
  if (!productsPage) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No products page data found</p>
          <p className="text-gray-400 text-sm">
            Add sections to the products page in the theme builder and publish
          </p>
        </div>
      </div>
    );
  }

  // Extract sections from products page data and cast to Section type
  // ProductsPageRenderer only uses type, enabled, and settings - which are compatible
  const sections = (productsPage.data?.sections || []) as Section[];

  // No sections - show message (NOT default sections)
  if (sections.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No sections configured</p>
          <p className="text-gray-400 text-sm">
            Add sections to the products page in the theme builder
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="theme-builder-products-page">
      {/* ProductsPageRenderer handles which sections to show based on Theme Builder API */}
      <ProductsPageRenderer
        sections={sections}
        products={products}
        pagination={pagination}
        filters={filters}
        onFiltersChange={updateFilters}
        isLoading={isLoading}
        routePrefix={routePrefix}
      />
    </main>
  );
}
