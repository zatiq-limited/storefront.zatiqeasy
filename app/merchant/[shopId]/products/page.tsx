"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useShopStore, useProductsStore } from "@/stores";
import { BasicAllProducts } from "@/app/_themes/basic/modules/products/basic-all-products";
import { AuroraAllProducts } from "@/app/_themes/aurora/modules/products/aurora-all-products";
import { LuxuraAllProducts } from "@/app/_themes/luxura/modules/products/luxura-all-products";
import { PremiumAllProducts } from "@/app/_themes/premium/modules/products/premium-all-products";
import { SelloraAllProducts } from "@/app/_themes/sellora/modules/products/sellora-all-products";
import { useShopProfile, useShopInventories, useShopCategories } from "@/hooks";
import ProductsPageRenderer from "@/components/renderers/page-renderer/products-page-renderer";
import type { Section } from "@/lib/types";
import type { ComponentType } from "react";

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Error component
const ErrorComponent = ({
  error,
  retry,
}: {
  error: string;
  retry: () => void;
}) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Error Loading Shop
      </h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={retry}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Retry
      </button>
    </div>
  </div>
);

// Map theme names to their products page components
const STATIC_THEME_PRODUCTS_COMPONENTS: Record<string, ComponentType> = {
  Basic: BasicAllProducts,
  Aurora: AuroraAllProducts,
  Luxura: LuxuraAllProducts,
  Premium: PremiumAllProducts,
  Sellora: SelloraAllProducts,
};

/**
 * Merchant Products Page
 *
 * Routes between Legacy Static Themes and Theme Builder based on legacy_theme flag:
 * - legacy_theme === true: Static theme products page
 * - legacy_theme === false: Theme Builder (ProductsPageRenderer)
 */
export default function MerchantProductsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { shopDetails } = useShopStore();
  const { setFilters, products, pagination, filters, isLoading: isProductsLoading } = useProductsStore();

  const shopId = params?.shopId as string;

  // Check if using legacy theme (static themes)
  const isLegacyTheme = shopDetails?.legacy_theme ?? true;
  const themeName = shopDetails?.shop_theme?.theme_name || "Basic";

  console.log("merchant/[shopId]/products/page.tsx - isLegacyTheme:", isLegacyTheme, "themeName:", themeName);

  // Fetch shop profile using React Query hook (auto-syncs to store)
  const {
    data: shopProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
    refetch: refetchProfile,
  } = useShopProfile({ shopId });

  // Fetch inventories when shop profile is available
  const { isLoading: isInventoriesLoading, isError: isInventoriesError } =
    useShopInventories(
      { shopUuid: shopProfile?.shop_uuid ?? "" },
      { enabled: !!shopProfile?.shop_uuid }
    );

  // Fetch categories when shop profile is available
  const { isLoading: isCategoriesLoading } = useShopCategories(
    { shopUuid: shopProfile?.shop_uuid ?? "" },
    { enabled: !!shopProfile?.shop_uuid }
  );

  // Update filters when URL params change (without reloading data)
  useEffect(() => {
    const selectedCategoryParam = searchParams.get("selected_category");
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    const filterCategory = selectedCategoryParam || categoryParam;

    setFilters({
      page: 1,
      category: filterCategory,
      search: searchParam,
      sort: "newest",
    });
  }, [searchParams, setFilters]);

  // Determine overall loading state
  const isLoading =
    isProfileLoading ||
    (shopProfile && (isInventoriesLoading || isCategoriesLoading));

  // Handle loading state
  if (isLoading) {
    return <LoadingFallback />;
  }

  // Handle error state
  if (isProfileError || isInventoriesError) {
    const errorMessage =
      profileError instanceof Error
        ? profileError.message
        : "Failed to load shop";
    return (
      <ErrorComponent error={errorMessage} retry={() => refetchProfile()} />
    );
  }

  // Legacy mode: Render static theme products page
  if (isLegacyTheme) {
    const StaticProductsComponent =
      STATIC_THEME_PRODUCTS_COMPONENTS[themeName] || BasicAllProducts;
    return (
      <div
        data-theme={themeName.toLowerCase()}
        className="min-h-screen bg-gray-50 dark:bg-gray-900"
      >
        <StaticProductsComponent />
      </div>
    );
  }

  // Theme Builder mode: Render with ProductsPageRenderer
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
        columns: 4,
      },
    },
  ];

  return (
    <main className="zatiq-products-page min-h-screen bg-gray-50">
      <ProductsPageRenderer
        sections={defaultSections}
        products={products}
        pagination={pagination}
        filters={filters}
        onFiltersChange={setFilters}
        isLoading={isProductsLoading}
      />
    </main>
  );
}
