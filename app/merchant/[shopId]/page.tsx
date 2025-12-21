"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useShopStore, useProductsStore } from '@/stores';
import { BasicHomePage } from '@/app/themes/basic';
import { fetchShopProfile, fetchShopInventories, fetchShopCategories } from '@/lib/api/shop';

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Error component
const ErrorComponent = ({ error, retry }: { error: string; retry: () => void }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Shop</h2>
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Get stores
  const { setShopDetails, shopDetails } = useShopStore();
  const { setProducts, setFilters, setCategories } = useProductsStore();

  // Load shop data (only on initial load or shopId change)
  useEffect(() => {
    const loadShopData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch shop profile data from backend API
        const shopProfile = await fetchShopProfile({
          shop_id: shopId
        });

        if (!shopProfile) {
          throw new Error('Shop not found');
        }

        // Initialize shop store with real data
        setShopDetails({
          ...shopProfile,
          id: Number(shopProfile.id),
          shop_name: shopProfile.shop_name ?? '',
          currency_code: shopProfile.currency_code || 'BDT',
          country_currency: shopProfile.country_currency || 'BDT',
          shop_email: shopProfile.shop_email ?? '',
          shop_phone: shopProfile.shop_phone ?? '',
          shop_uuid: shopProfile.shop_uuid ?? '',
          hasPixelAccess: shopProfile.hasPixelAccess ?? false,
          hasGTMAccess: shopProfile.hasGTMAccess ?? false,
          hasTikTokPixelAccess: shopProfile.hasTikTokPixelAccess ?? false,
          baseUrl: `/merchant/${shopId}`,
          shopCurrencySymbol: shopProfile.currency_code === 'BDT' ? '৳' : '$'
        } as any);

        // Fetch products from backend API
        console.log('[ShopPage] Fetching products for shop_uuid:', shopProfile.shop_uuid);
        const products = await fetchShopInventories({
          shop_uuid: shopProfile.shop_uuid
        });

        console.log('[ShopPage] Products fetched:', products?.length || 0, products);

        if (products && products.length > 0) {
          // Sort products: in-stock items first, out-of-stock items at the end
          const sortedProducts = [...products].sort((a, b) => {
            const aInStock = (a.quantity ?? 0) > 0;
            const bInStock = (b.quantity ?? 0) > 0;

            // If both have same stock status, maintain original order
            if (aInStock === bInStock) return 0;
            // In-stock items come first
            return aInStock ? -1 : 1;
          });

          setProducts(sortedProducts as any);
          console.log('[ShopPage] Products set to store (sorted: in-stock first, out-of-stock last)');
        } else {
          console.warn('[ShopPage] No products returned from API');
        }

        // Fetch categories from backend API
        const categories = await fetchShopCategories({
          shop_uuid: shopProfile.shop_uuid
        });

        if (categories) {
          setCategories(categories);
        }

      } catch (err) {
        console.error('Failed to load shop:', err);
        setError(err instanceof Error ? err.message : 'Failed to load shop');
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
    // Read selected_category for filtering (used by category navigation)
    // Fall back to category param for backwards compatibility
    const selectedCategoryParam = searchParams.get('selected_category');
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    // Use selected_category if available, otherwise fall back to category
    const filterCategory = selectedCategoryParam || categoryParam;

    setFilters({
      page: 1,
      category: filterCategory,
      search: searchParam,
      sort: 'newest'
    });
  }, [searchParams, setFilters]);

  // Handle loading state
  if (isLoading) {
    return <LoadingFallback />;
  }

  // Handle error state
  if (error) {
    return <ErrorComponent error={error} retry={() => window.location.reload()} />;
  }

  // Check if single product theme is enabled
  if ((shopDetails?.shop_theme as any)?.singleProductTheme) {
    // Return single product landing page
    return <SingleProductLandingPage shopId={shopId} />;
  }

  // Return regular shop home page with Basic theme
  return (
    <div data-theme="basic" className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BasicHomePage />
    </div>
  );
}

// Single Product Landing Page Component
function SingleProductLandingPage({ shopId }: { shopId: string }) {
  return (
    <div className="min-h-screen">
      {/* Implementation for single product landing page */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Single Product Landing Page</h1>
        <p className="text-gray-600">
          This shop has a single product landing page theme enabled.
        </p>
        {/* TODO: Implement single product landing page */}
      </div>
    </div>
  );
}

// Main Shop Page Component
export default function ShopPage() {
  const params = useParams();
  const shopId = params?.shopId as string;

  if (!shopId) {
    return <ErrorComponent error="Shop ID is required" retry={() => window.location.reload()} />;
  }

  return <ShopPageContent shopId={shopId} />;
}

