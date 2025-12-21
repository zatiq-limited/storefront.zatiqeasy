"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useShopStore, useProductsStore } from "@/stores";
import { BasicCategoryPage } from "@/app/themes/basic/modules/home/basic-category-page";
import {
  fetchShopProfile,
  fetchShopInventories,
  fetchShopCategories,
} from "@/lib/api/shop";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get stores
  const { setShopDetails } = useShopStore();
  const { setProducts, setFilters, setCategories } = useProductsStore();

  // Add URL params if not present (like old project)
  useEffect(() => {
    const selectedCategory = searchParams.get("selected_category");

    if (categoryId && !selectedCategory) {
      // Add params to URL like old project does
      const newUrl = `/merchant/${shopId}/categories/${categoryId}?selected_category=${categoryId}&category_id=${categoryId}`;
      router.replace(newUrl);
    }
  }, [categoryId, searchParams, shopId, router]);

  // Load shop data (only on initial load or shopId change)
  useEffect(() => {
    const loadShopData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch shop profile data from backend API
        const shopProfile = await fetchShopProfile({
          shop_id: shopId,
        });

        if (!shopProfile) {
          throw new Error("Shop not found");
        }

        // Initialize shop store with real data
        setShopDetails({
          ...shopProfile,
          id: Number(shopProfile.id),
          shop_name: shopProfile.shop_name ?? "",
          currency_code: shopProfile.currency_code || "BDT",
          country_currency: shopProfile.country_currency || "BDT",
          shop_email: shopProfile.shop_email ?? "",
          shop_phone: shopProfile.shop_phone ?? "",
          shop_uuid: shopProfile.shop_uuid ?? "",
          hasPixelAccess: shopProfile.hasPixelAccess ?? false,
          hasGTMAccess: shopProfile.hasGTMAccess ?? false,
          hasTikTokPixelAccess: shopProfile.hasTikTokPixelAccess ?? false,
          baseUrl: `/merchant/${shopId}`,
          shopCurrencySymbol: shopProfile.currency_code === "BDT" ? "৳" : "$",
        } as any);

        // Fetch products from backend API
        const products = await fetchShopInventories({
          shop_uuid: shopProfile.shop_uuid,
        });

        if (products && products.length > 0) {
          // Sort products: in-stock items first, out-of-stock items at the end
          const sortedProducts = [...products].sort((a, b) => {
            const aInStock = (a.quantity ?? 0) > 0;
            const bInStock = (b.quantity ?? 0) > 0;
            if (aInStock === bInStock) return 0;
            return aInStock ? -1 : 1;
          });

          setProducts(sortedProducts as any);
        }

        // Fetch categories from backend API
        const fetchedCategories = await fetchShopCategories({
          shop_uuid: shopProfile.shop_uuid,
        });

        if (fetchedCategories) {
          setCategories(fetchedCategories);
        }
      } catch (err) {
        console.error("Failed to load shop:", err);
        setError(err instanceof Error ? err.message : "Failed to load shop");
      } finally {
        setIsLoading(false);
      }
    };

    if (shopId) {
      loadShopData();
    }
  }, [shopId, setShopDetails, setProducts, setCategories]);

  // Update filters when URL params change (without reloading data)
  useEffect(() => {
    const selectedCategoryParam = searchParams.get("selected_category");
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    // Use selected_category if available, otherwise fall back to category or categoryId from path
    const filterCategory = selectedCategoryParam || categoryParam || categoryId;

    setFilters({
      page: 1,
      category: filterCategory,
      search: searchParam,
      sort: "newest",
    });
  }, [searchParams, setFilters, categoryId]);

  // Handle loading state
  if (isLoading) {
    return <LoadingFallback />;
  }

  // Handle error state
  if (error) {
    return (
      <ErrorComponent error={error} retry={() => window.location.reload()} />
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
