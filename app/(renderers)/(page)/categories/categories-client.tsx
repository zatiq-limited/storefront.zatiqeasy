/**
 * Categories Client Component
 * Handles all client-side interactivity for the categories listing page
 *
 * Routes between Legacy Static Themes and Theme Builder based on legacy_theme flag:
 * - legacy_theme === true: Static theme categories page (AllCategoriesRenderer)
 * - legacy_theme === false: Theme Builder (CollectionsPageRenderer) with real shop data
 */

"use client";

import { useShopStore } from "@/stores";
import { useShopCategories } from "@/hooks";
import { AllCategoriesRenderer } from "@/app/_themes/_components/all-categories-renderer";
import CollectionsClient from "../collections/collections-client";

export default function CategoriesClient() {
  // Get shop details from store
  const { shopDetails } = useShopStore();

  const isLegacyTheme = shopDetails?.legacy_theme ?? true;
  const themeName = shopDetails?.shop_theme?.theme_name || "Basic";

  // Fetch categories (auto-syncs to store)
  const {
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
    refetch,
  } = useShopCategories(
    { shopUuid: shopDetails?.shop_uuid ?? "" },
    { enabled: !!shopDetails?.shop_uuid, syncToStore: true }
  );

  console.log("categories-client.tsx - isLegacyTheme:", isLegacyTheme, "themeName:", themeName);

  // Legacy mode: Render static theme categories page
  if (isLegacyTheme) {
    // Loading state
    if (isCategoriesLoading) {
      return (
        <main className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading categories...</p>
          </div>
        </main>
      );
    }

    // Error state
    if (isCategoriesError) {
      return (
        <main className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error loading categories
            </h2>
            <p className="text-gray-600 mb-4">
              {categoriesError?.message || "Failed to load categories"}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </main>
      );
    }

    // Render theme-specific categories page
    return (
      <>
        {/* SEO: Hidden headers for search engines */}
        <h1 className="sr-only">All Categories - {shopDetails?.shop_name}</h1>
        <h2 className="sr-only">
          Browse all product categories at {shopDetails?.shop_name}
        </h2>

        {/* Theme-based renderer for legacy themes */}
        <AllCategoriesRenderer />
      </>
    );
  }

  // Theme Builder mode: Use the same renderer as collections
  return <CollectionsClient />;
}
