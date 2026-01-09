/**
 * Products Client Component
 * Handles all client-side interactivity for the products listing page
 *
 * Routes between Legacy Static Themes and Theme Builder based on legacy_theme flag:
 * - legacy_theme === true: Static theme products page
 * - legacy_theme === false: Theme Builder (ProductsPageRenderer) with real shop data
 */

"use client";

import { useShopStore, useProductsStore } from "@/stores";
import { useShopInventories, useShopCategories, useProductsPage } from "@/hooks";
import ProductsPageRenderer from "@/components/renderers/page-renderer/products-page-renderer";
import { BasicAllProducts } from "@/app/_themes/basic/modules/products/basic-all-products";
import { AuroraAllProducts } from "@/app/_themes/aurora/modules/products/aurora-all-products";
import { LuxuraAllProducts } from "@/app/_themes/luxura/modules/products/luxura-all-products";
import { PremiumAllProducts } from "@/app/_themes/premium/modules/products/premium-all-products";
import { SelloraAllProducts } from "@/app/_themes/sellora/modules/products/sellora-all-products";
import type { ComponentType } from "react";

// Map theme names to their products page components
const STATIC_THEME_PRODUCTS_COMPONENTS: Record<string, ComponentType> = {
  Basic: BasicAllProducts,
  Aurora: AuroraAllProducts,
  Luxura: LuxuraAllProducts,
  Premium: PremiumAllProducts,
  Sellora: SelloraAllProducts,
};

export default function ProductsClient() {
  // Get shop details and products from store
  const { shopDetails } = useShopStore();
  const products = useProductsStore((state) => state.products);
  const categories = useProductsStore((state) => state.categories);
  const pagination = useProductsStore((state) => state.pagination);
  const filters = useProductsStore((state) => state.filters);
  const productsStoreIsLoading = useProductsStore((state) => state.isLoading);
  const setFilters = useProductsStore((state) => state.setFilters);

  const isLegacyTheme = shopDetails?.legacy_theme ?? true;
  const themeName = shopDetails?.shop_theme?.theme_name || "Basic";

  // Fetch shop inventories for real product data (both legacy and theme builder modes)
  const { isLoading: isInventoriesLoading } = useShopInventories(
    { shopUuid: shopDetails?.shop_uuid ?? "" },
    { enabled: !!shopDetails?.shop_uuid, sortByStock: false }
  );

  // Fetch categories
  useShopCategories(
    { shopUuid: shopDetails?.shop_uuid ?? "" },
    { enabled: !!shopDetails?.shop_uuid }
  );

  // Fetch products page configuration (Theme Builder mode only)
  const { data: productsPageData, isLoading: isPageConfigLoading } = useProductsPage({
    enabled: !isLegacyTheme && !!shopDetails?.shop_uuid,
  });

  const isLoading = isInventoriesLoading || productsStoreIsLoading;
  const pageSections = productsPageData?.sections || [];

  console.log("products-client.tsx - isLegacyTheme:", isLegacyTheme, "themeName:", themeName);

  // Legacy mode: Render static theme products page
  if (isLegacyTheme) {
    const StaticProductsComponent =
      STATIC_THEME_PRODUCTS_COMPONENTS[themeName] || BasicAllProducts;
    return <StaticProductsComponent />;
  }

  // Show loading state (Theme Builder mode)
  if ((isLoading || isPageConfigLoading) && products.length === 0) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  // Theme Builder mode: Render with ProductsPageRenderer using real shop data and API page config
  return (
    <main className="zatiq-products-page min-h-screen bg-gray-50">
      <ProductsPageRenderer
        sections={pageSections}
        products={products}
        categories={categories}
        pagination={pagination}
        filters={filters}
        onFiltersChange={setFilters}
        isLoading={isLoading}
      />
    </main>
  );
}
