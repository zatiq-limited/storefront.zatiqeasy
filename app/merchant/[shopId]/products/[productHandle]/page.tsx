"use client";

import { useParams } from "next/navigation";
import { useShopProfile, useShopCategories, useShopInventories } from "@/hooks";
import { useEffect } from "react";
import { useShopStore } from "@/stores/shopStore";
import type { ShopProfile } from "@/types";
import { BasicProductDetailPage } from "@/app/_themes/basic/modules/product-detail/basic-product-detail-page";
import { AuroraProductDetailPage } from "@/app/_themes/aurora/modules/product-detail/aurora-product-detail-page";
import { LuxuraProductDetailPage } from "@/app/_themes/luxura/modules/product-detail/luxura-product-detail-page";
import { PremiumProductDetailPage } from "@/app/_themes/premium/modules/product-detail/premium-product-detail-page";
import { SelloraProductDetailPage } from "@/app/_themes/sellora/modules/product-detail/sellora-product-detail-page";
import { useProductsStore, type Product } from "@/stores/productsStore";

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
        Error Loading Product
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
 * Merchant Product Detail Page
 * Uses Basic theme product detail component
 */
export default function MerchantProductDetailPage() {
  const params = useParams();
  const { shopDetails, setShopDetails } = useShopStore();
  const products = useProductsStore((state) => state.products);

  const shopId = params?.shopId as string;
  const productHandle = params?.productHandle as string;

  // Check if shop data is already in store
  const hasShopData = shopDetails && shopDetails.id === Number(shopId);

  // Only fetch shop profile if not already in store
  const {
    data: shopProfile,
    isLoading,
    error,
    refetch,
  } = useShopProfile(
    { shopId },
    {
      enabled: true, // Always fetch to ensure we have shop_uuid
      syncToStore: false, // We'll handle store sync manually
    }
  );

  // Use store data if available, otherwise use fetched data
  const activeShopData = hasShopData ? shopDetails : shopProfile;

  // Fetch categories when shop profile is available (need shop_uuid)
  const { isLoading: isCategoriesLoading } = useShopCategories(
    { shopUuid: activeShopData?.shop_uuid ?? "" },
    {
      enabled: !!activeShopData?.shop_uuid, // Fetch when we have shop_uuid
      syncToStore: true, // Sync categories to productsStore
    }
  );

  // Fetch shop inventories for related products
  const { isLoading: isInventoriesLoading } = useShopInventories(
    { shopUuid: activeShopData?.shop_uuid ?? "" },
    {
      enabled: !!activeShopData?.shop_uuid, // Fetch when we have shop_uuid
      syncToStore: true, // Sync products to productsStore for related products
    }
  );

  // Set shop details in store (only if fetched)
  useEffect(() => {
    if (shopProfile && !hasShopData) {
      setShopDetails(shopProfile as unknown as ShopProfile);
    }
  }, [shopProfile, shopId, setShopDetails, hasShopData]);

  // Ensure baseUrl is set even if shop was already in store
  useEffect(() => {
    if (hasShopData && shopDetails && !shopDetails.baseUrl) {
      const updatedShopDetails = { ...shopDetails };
      updatedShopDetails.baseUrl = `/merchant/${shopId}`;
      setShopDetails(updatedShopDetails);
    }
  }, [hasShopData, shopDetails, shopId, setShopDetails]);

  // Handle loading state
  if (isLoading || isCategoriesLoading || isInventoriesLoading) {
    return <LoadingFallback />;
  }

  // Handle error state
  if (error) {
    return <ErrorComponent error={error.message} retry={refetch} />;
  }

  // Use store data if available, otherwise use fetched data (already defined above)

  // Handle no shop found
  if (!activeShopData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Shop Not Found
          </h2>
          <p className="text-gray-600">
            The shop you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  // Get the theme name from shop details
  const themeName = activeShopData?.shop_theme?.theme_name || "Basic";

  // Find product from store for Premium/Sellora themes
  const product = products.find(
    (p: Product) => String(p.id) === productHandle
  );

  // Render the appropriate theme product detail page
  switch (themeName) {
    case "Aurora":
      return <AuroraProductDetailPage handle={productHandle} />;
    case "Luxura":
      return <LuxuraProductDetailPage />;
    case "Premium":
      return product ? (
        <PremiumProductDetailPage product={product} />
      ) : (
        <LoadingFallback />
      );
    case "Sellora":
      return <SelloraProductDetailPage handle={productHandle} />;
    case "Basic":
    default:
      return <BasicProductDetailPage handle={productHandle} />;
  }
}
