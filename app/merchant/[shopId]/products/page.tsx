"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useShopStore, useProductsStore } from "@/stores";
import { BasicHomePage } from "@/app/_themes/basic";
import { AuroraAllProducts } from "@/app/_themes/aurora/modules/products/aurora-all-products";
import { LuxuraAllProducts } from "@/app/_themes/luxura/modules/products/luxura-all-products";
import { PremiumAllProducts } from "@/app/_themes/premium/modules/products/premium-all-products";
import { useShopProfile, useShopInventories, useShopCategories } from "@/hooks";

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

/**
 * Merchant Products Page
 * Renders theme-specific products page based on shop_theme.theme_name
 */
export default function MerchantProductsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { shopDetails } = useShopStore();
  const { setFilters } = useProductsStore();

  const shopId = params?.shopId as string;

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

  // Get the theme name from shop details
  const themeName = shopDetails?.shop_theme?.theme_name || "Basic";

  // Render the appropriate theme products page
  const renderThemePage = () => {
    switch (themeName) {
      case "Aurora":
        return <AuroraAllProducts />;
      case "Luxura":
        return <LuxuraAllProducts />;
      case "Premium":
        return <PremiumAllProducts />;
      case "Basic":
      default:
        return <BasicHomePage />;
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
