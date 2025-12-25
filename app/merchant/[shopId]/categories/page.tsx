"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useShopProfile, useShopCategories } from "@/hooks";
import { AllCategoriesRenderer } from "@/app/_themes/_components/all-categories-renderer";
import { PageLoading } from "@/components/shared/page-loading";
import { ErrorComponent } from "@/components/shared/error-component";

/**
 * Categories Page
 * Main route for displaying all categories
 * Fetches shop data and renders theme-specific categories page
 *
 * Architecture:
 * 1. Fetch shop profile and categories (React Query)
 * 2. Auto-sync data to Zustand stores
 * 3. Render theme-specific component via AllCategoriesRenderer
 *
 * Matches old project pattern:
 * pages/categories/index.tsx → all-category-page.module.tsx → ThemeHandler
 */
export default function CategoriesPage() {
  const params = useParams();
  const shopId = params?.shopId as string;

  // Fetch shop profile (auto-syncs to store)
  const {
    data: shopProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
    refetch,
  } = useShopProfile({ shopId });

  // Fetch categories when shop profile is available (auto-syncs to store)
  const {
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useShopCategories(
    { shopUuid: shopProfile?.shop_uuid ?? "" },
    { enabled: !!shopProfile?.shop_uuid, syncToStore: true }
  );

  // Loading state - show while fetching data
  if (isProfileLoading || isCategoriesLoading) {
    return <PageLoading />;
  }

  // Error state - show if any fetch fails
  if (isProfileError || isCategoriesError) {
    const errorMessage =
      profileError?.message ||
      categoriesError?.message ||
      "Failed to load categories";

    return <ErrorComponent error={errorMessage} retry={refetch} />;
  }

  // Render theme-specific categories page
  return (
    <>
      {/* SEO: Hidden headers for search engines (matches old project pattern) */}
      <h1 className="sr-only">All Categories - {shopProfile?.shop_name}</h1>
      <h2 className="sr-only">
        Browse all product categories at {shopProfile?.shop_name}
      </h2>

      {/* Theme-based renderer (similar to old project's ThemeHandler) */}
      <AllCategoriesRenderer />
    </>
  );
}
