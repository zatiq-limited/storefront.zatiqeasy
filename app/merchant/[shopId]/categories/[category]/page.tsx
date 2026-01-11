"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useShopStore, useProductsStore } from "@/stores";
import { BasicCategoryPage } from "@/app/_themes/basic/modules/home/basic-category-page";
import { AuroraCategoryPage } from "@/app/_themes/aurora/modules/category/aurora-category-page";
import { LuxuraCategoryPage } from "@/app/_themes/luxura/modules/category/luxura-category-page";
import { PremiumCategoryPage } from "@/app/_themes/premium/modules/category/premium-category-page";
import { SelloraCategoryPage } from "@/app/_themes/sellora/modules/category/sellora-category-page";
import { useShopProfile, useShopInventories, useShopCategories } from "@/hooks";
import {
  useShallowSearchParams,
  shallowReplace,
} from "@/lib/utils/shallow-routing";

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
        Error Loading Category
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

interface CategoryPageContentProps {
  shopId: string;
  categoryId: string;
}

function CategoryPageContent({ shopId, categoryId }: CategoryPageContentProps) {
  const searchParams = useShallowSearchParams(); // Use shallow search params for instant updates
  const { shopDetails } = useShopStore();
  const { setFilters } = useProductsStore();

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

  // Add URL params if not present (like old project)
  // Use shallow replace to avoid triggering RSC refetch
  useEffect(() => {
    const selectedCategory = searchParams.get("selected_category");

    if (categoryId && !selectedCategory) {
      const newUrl = `/merchant/${shopId}/categories/${categoryId}?selected_category=${categoryId}&category_id=${categoryId}`;
      shallowReplace(newUrl);
    }
  }, [categoryId, searchParams, shopId]);

  // Update filters when URL params change (without reloading data)
  useEffect(() => {
    const selectedCategoryParam = searchParams.get("selected_category");
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    const filterCategory = selectedCategoryParam || categoryParam || categoryId;

    setFilters({
      page: 1,
      category: filterCategory,
      search: searchParam,
      sort: "newest",
    });
  }, [searchParams, setFilters, categoryId]);

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

  // Get the theme name from shop details
  const themeName = shopDetails?.shop_theme?.theme_name || "Basic";

  // Render the appropriate theme category page
  const renderThemePage = () => {
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
  };

  return (
    <div
      data-theme={themeName.toLowerCase()}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      {renderThemePage()}
    </div>
  );
}

// Main Category Page Component
export default function CategoryPage() {
  const params = useParams();
  const shopId = params?.shopId as string;
  const categoryId = params?.category as string;

  if (!shopId) {
    return (
      <ErrorComponent
        error="Shop ID is required"
        retry={() => window.location.reload()}
      />
    );
  }

  if (!categoryId) {
    return (
      <ErrorComponent
        error="Category ID is required"
        retry={() => window.location.reload()}
      />
    );
  }

  return <CategoryPageContent shopId={shopId} categoryId={categoryId} />;
}
