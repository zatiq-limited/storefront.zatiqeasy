"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useShopStore, useProductsStore } from "@/stores";
import { BasicHomePage } from "@/app/_themes/basic";
import { AuroraHomePage } from "@/app/_themes/aurora";
import { useShopProfile, useShopInventories, useShopCategories } from "@/hooks";
import type { ShopTheme } from "@/types/shop.types";

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

interface ShopPageProps {
  shopId: string;
}

function ShopPageContent({ shopId }: ShopPageProps) {
  const searchParams = useSearchParams();
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

  // Check if single product theme is enabled
  if (
    (shopDetails?.shop_theme as ShopTheme & { singleProductTheme?: boolean })
      ?.singleProductTheme
  ) {
    return <SingleProductLandingPage shopId={shopId} />;
  }

  // Get the theme name from shop details
  const themeName = shopDetails?.shop_theme?.theme_name || "Basic";

  // Render the appropriate theme page
  const renderThemePage = () => {
    switch (themeName) {
      case "Aurora":
        return <AuroraHomePage />;
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

// Single Product Landing Page Component
function SingleProductLandingPage({ shopId: _shopId }: { shopId: string }) {
  console.log("Rendering Single Product Landing Page for shop:", _shopId);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Single Product Landing Page</h1>
        <p className="text-gray-600">
          This shop has a single product landing page theme enabled.
        </p>
      </div>
    </div>
  );
}

// Main Shop Page Component
export default function ShopPage() {
  const params = useParams();
  const shopId = params?.shopId as string;

  if (!shopId) {
    return (
      <ErrorComponent
        error="Shop ID is required"
        retry={() => window.location.reload()}
      />
    );
  }

  return <ShopPageContent shopId={shopId} />;
}
