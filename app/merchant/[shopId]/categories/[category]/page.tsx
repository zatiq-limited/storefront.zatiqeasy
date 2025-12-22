"use client";

import { useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useProductsStore } from "@/stores";
import { BasicCategoryPage } from "@/app/_themes/basic/modules/home/basic-category-page";
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
  const searchParams = useSearchParams();
  const router = useRouter();
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
  useEffect(() => {
    const selectedCategory = searchParams.get("selected_category");

    if (categoryId && !selectedCategory) {
      const newUrl = `/merchant/${shopId}/categories/${categoryId}?selected_category=${categoryId}&category_id=${categoryId}`;
      router.replace(newUrl);
    }
  }, [categoryId, searchParams, shopId, router]);

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

  // Return category page with Basic theme
  return (
    <div
      data-theme="basic"
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <BasicCategoryPage />
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
