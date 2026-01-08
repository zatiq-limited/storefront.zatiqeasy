/**
 * ========================================
 * CATEGORY DETAILS PAGE
 * ========================================
 *
 * Single category page with products
 * Routes between Legacy Static Themes and Theme Builder based on legacy_theme flag
 */

"use client";

import { use, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useShopStore, useProductsStore } from "@/stores";
import {
  useShopInventories,
  useShopCategories,
  useCollectionDetails,
} from "@/hooks";
import CollectionDetailsPageRenderer from "@/components/renderers/page-renderer/collection-details-page-renderer";
import type { Section } from "@/lib/types";
import Link from "next/link";

// Static Theme Category Components
import { BasicCategoryPage } from "@/app/_themes/basic/modules/home/basic-category-page";
import { AuroraCategoryPage } from "@/app/_themes/aurora/modules/category/aurora-category-page";
import { LuxuraCategoryPage } from "@/app/_themes/luxura/modules/category/luxura-category-page";
import { PremiumCategoryPage } from "@/app/_themes/premium/modules/category/premium-category-page";
import { SelloraCategoryPage } from "@/app/_themes/sellora/modules/category/sellora-category-page";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get shop details from store
  const { shopDetails } = useShopStore();
  const { setFilters } = useProductsStore();

  // Determine theme mode
  const isLegacyTheme = shopDetails?.legacy_theme ?? true;
  const themeName = shopDetails?.shop_theme?.theme_name || "Basic";
  const shopUuid = shopDetails?.shop_uuid;

  // Fetch inventories when shop UUID is available (for legacy themes)
  const {
    isLoading: isInventoriesLoading,
    isError: isInventoriesError,
    refetch: refetchInventories,
  } = useShopInventories(
    { shopUuid: shopUuid ?? "" },
    { enabled: !!shopUuid && isLegacyTheme }
  );

  // Fetch categories when shop UUID is available (for legacy themes)
  const { isLoading: isCategoriesLoading } = useShopCategories(
    { shopUuid: shopUuid ?? "" },
    { enabled: !!shopUuid && isLegacyTheme }
  );

  // Fetch collection details for Theme Builder mode only (not for legacy themes)
  const {
    collection,
    sections,
    isLoading: isCollectionLoading,
    isPageConfigLoading,
    error,
    notFound,
    hasShopUuid,
  } = useCollectionDetails(slug, { enabled: !isLegacyTheme });

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [slug]);

  // Add URL params if not present (like old project) - only for legacy themes
  useEffect(() => {
    if (!isLegacyTheme) return;

    const selectedCategory = searchParams.get("selected_category");

    if (slug && !selectedCategory) {
      const newUrl = `/categories/${slug}?selected_category=${slug}&category_id=${slug}`;
      router.replace(newUrl);
    }
  }, [slug, searchParams, router, isLegacyTheme]);

  // Update filters when URL params change - only for legacy themes
  useEffect(() => {
    if (!isLegacyTheme) return;

    const selectedCategoryParam = searchParams.get("selected_category");
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    const filterCategory = selectedCategoryParam || categoryParam || slug;

    setFilters({
      page: 1,
      category: filterCategory,
      search: searchParam,
      sort: "newest",
    });
  }, [searchParams, setFilters, slug, isLegacyTheme]);

  console.log(
    "categories/[slug]/page.tsx - isLegacyTheme:",
    isLegacyTheme,
    "themeName:",
    themeName,
    "slug:",
    slug
  );

  // ========================================
  // STATIC THEME MODE (legacy_theme = true)
  // ========================================
  if (isLegacyTheme) {
    // Determine overall loading state
    const isLoading = !shopUuid || isInventoriesLoading || isCategoriesLoading;

    // Handle loading state
    if (isLoading) {
      return (
        <main className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading category...</p>
          </div>
        </main>
      );
    }

    // Handle error state
    if (isInventoriesError) {
      return (
        <main className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error loading category
            </h2>
            <p className="text-gray-600 mb-4">Failed to load category</p>
            <button
              onClick={() => refetchInventories()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </main>
      );
    }

    // Render the appropriate theme category page
    switch (themeName) {
      case "Aurora":
        return <AuroraCategoryPage />;
      case "Luxura":
        return <LuxuraCategoryPage />;
      case "Premium":
        return <PremiumCategoryPage />;
      case "Sellora":
        return <SelloraCategoryPage />;
      case "Basic":
      default:
        return <BasicCategoryPage />;
    }
  }

  // ========================================
  // THEME BUILDER MODE (legacy_theme = false)
  // ========================================

  // Show loading state - also wait for shop UUID to be available
  if (!hasShopUuid || isCollectionLoading || isPageConfigLoading) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading category...</p>
        </div>
      </main>
    );
  }

  // Show 404 state - only after we have shop UUID and finished loading
  if (notFound || !collection) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <svg
            className="w-24 h-24 text-gray-300 mx-auto mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Category Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The category you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Categories
          </Link>
        </div>
      </main>
    );
  }

  // Show error state
  if (error && !notFound) {
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
            Error loading category
          </h2>
          <p className="text-gray-600 mb-4">Please try again later</p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Categories
          </Link>
        </div>
      </main>
    );
  }

  // Default sections if none provided
  const defaultSections: Section[] = [
    {
      id: "collection_breadcrumb",
      type: "collection-breadcrumb-1",
      enabled: true,
      settings: {
        show_home: true,
        show_collections: true,
        show_product_count: true,
        background_color: "#ffffff",
        text_color: "#6b7280",
        active_color: "#111827",
      },
    },
    {
      id: "collection_banner",
      type: "collection-banner-1",
      enabled: true,
      settings: {
        show_banner: true,
        show_description: true,
        show_product_count: true,
        text_position: "center",
        height: "medium",
        overlay_opacity: "0.5",
        text_color: "#ffffff",
        badge_background_color: "#ffffff",
        badge_text_color: "#111827",
        banner_button_text: "Explore Category",
        banner_button_link: "#products",
      },
    },
    {
      id: "collection_subcategories",
      type: "collection-subcategories-1",
      enabled: collection.children && collection.children.length > 0,
      settings: {
        title: "Shop by Category",
        show_title: true,
        columns: "6",
        columns_mobile: "3",
        columns_tablet: "4",
        show_product_count: true,
        background_color: "#ffffff",
        title_color: "#181D25",
        text_color: "#374151",
        hover_color: "#7c3aed",
      },
    },
    {
      id: "collection_products",
      type: "collection-products-1",
      enabled: true,
      settings: {
        card_style: "product-card-1",
        columns: "3",
        columns_mobile: "1",
        columns_tablet: "2",
        show_filters: true,
        show_sorting: true,
        show_pagination: true,
        products_per_page: "12",
        background_color: "#ffffff",
        button_bg_color: "#0c2c5f",
        button_text_color: "#eff2f6",
        load_more_button_text: "View More Products",
        load_more_gradient_from: "#4f46e5",
        load_more_gradient_to: "#9333ea",
        load_more_text_color: "#ffffff",
      },
    },
  ];

  const pageSections =
    sections.length > 0 ? (sections as Section[]) : defaultSections;

  return (
    <main className="zatiq-collection-details-page min-h-screen">
      <CollectionDetailsPageRenderer
        sections={pageSections}
        collection={collection}
        isLoading={isCollectionLoading}
      />
    </main>
  );
}
