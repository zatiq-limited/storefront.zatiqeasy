"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useProductsStore } from "@/stores";
import { BasicHomePage } from "@/app/_themes/basic";
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
 * For basic theme, this shows the same content as the home page
 * (products list with categories, same design as home)
 */
export default function MerchantProductsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
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

  // For basic theme, the products page is the same as home page
  return (
    <div
      data-theme="basic"
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <BasicHomePage />
    </div>
  );
}
