"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, usePathname } from "next/navigation";
import { useShopStore, useProductsStore, useHomepageStore } from "@/stores";
import { BasicHomePage } from "@/app/_themes/basic";
import { AuroraHomePage } from "@/app/_themes/aurora";
import { LuxuraHomePage } from "@/app/_themes/luxura";
import { PremiumHomePage } from "@/app/_themes/premium";
import { SelloraHomePage } from "@/app/_themes/sellora";
import { useShopProfile, useShopInventories, useShopCategories, useHomepage } from "@/hooks";
import type { ShopTheme } from "@/types/shop.types";
import BlockRenderer from "@/components/renderers/block-renderer";

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
  const pathname = usePathname();
  const { shopDetails } = useShopStore();
  const { setFilters } = useProductsStore();
  const { homepage } = useHomepageStore();
  const { isLoading: isHomepageLoading, error: homepageError } = useHomepage();

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

  // Check if using legacy theme (static themes) or theme builder
  const isLegacyTheme = shopDetails?.legacy_theme ?? true;

  // Check if current route is a homepage
  // Homepage routes: "/" or "/merchant/[shopId]"
  const isHomepageRoute =
    pathname === "/" ||
    /^\/merchant\/[^/]+$/.test(pathname);

  // Legacy mode + Homepage: ThemeRouter already rendered the static theme, skip this
  if (isLegacyTheme && isHomepageRoute) {
    return null;
  }

  // Handle loading state (only for theme builder mode)
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

  // Theme Builder mode: Render blocks from homepage data
  if (isHomepageLoading) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <p>Loading homepage...</p>
      </main>
    );
  }

  if (homepageError) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <p>Error loading homepage data</p>
      </main>
    );
  }

  // Extract sections from homepage data
  const pageData =
    (homepage as Record<string, unknown>)?.data || homepage || {};
  const sections = (pageData as Record<string, unknown>)?.sections || [];

  return (
    <main className="zatiq-homepage">
      {(sections as Array<Record<string, unknown>>).map((section, index) => {
        // Get the first block from each section
        const block = (section.blocks as Array<Record<string, unknown>>)?.[0];
        if (!block || !section.enabled) return null;

        return (
          <BlockRenderer
            key={(section.id as string) || `section-${index}`}
            block={
              block as import("@/components/renderers/block-renderer").Block
            }
            data={(block.data as Record<string, unknown>) || {}}
          />
        );
      })}
    </main>
  );
}

// Single Product Landing Page Component
// Renders landing page for shops with singleProductTheme enabled
function SingleProductLandingPage({ shopId }: { shopId: string }) {
  const { shopDetails } = useShopStore();
  const shopUuid = shopDetails?.shop_uuid ?? "";

  // State for landing page data
  const [landingData, setLandingData] = useState<import("@/types/landing-page.types").SingleProductPage | null>(null);
  const [isLandingLoading, setIsLandingLoading] = useState(true);
  const [landingError, setLandingError] = useState<string | null>(null);

  // Fetch the shop's default landing page
  useEffect(() => {
    async function fetchDefaultLandingPage() {
      if (!shopUuid && !shopId) {
        setLandingError("Shop information not available");
        setIsLandingLoading(false);
        return;
      }

      try {
        setIsLandingLoading(true);
        // First try to get the shop's default/primary landing page
        // The API uses "home" or "default" as the default slug for single product shops
        const response = await fetch(
          `/api/storefront/v1/landing/default?shop_id=${shopId}&shop_uuid=${shopUuid}`
        );

        if (!response.ok) {
          // Try "home" slug as fallback
          const homeResponse = await fetch(
            `/api/storefront/v1/landing/home?shop_id=${shopId}&shop_uuid=${shopUuid}`
          );

          if (!homeResponse.ok) {
            throw new Error("No default landing page found for this shop");
          }

          const homeResult = await homeResponse.json();
          if (homeResult.success && homeResult.data) {
            setLandingData(homeResult.data as import("@/types/landing-page.types").SingleProductPage);
          } else {
            throw new Error("Landing page data not available");
          }
        } else {
          const result = await response.json();
          if (result.success && result.data) {
            setLandingData(result.data as import("@/types/landing-page.types").SingleProductPage);
          } else {
            throw new Error("Landing page data not available");
          }
        }
      } catch (err) {
        setLandingError(err instanceof Error ? err.message : "Failed to load landing page");
      } finally {
        setIsLandingLoading(false);
      }
    }

    fetchDefaultLandingPage();
  }, [shopId, shopUuid]);

  // Loading state
  if (isLandingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500">Loading landing page...</p>
        </div>
      </div>
    );
  }

  // Error state - show a user-friendly message
  if (landingError || !landingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Landing Page Not Available
          </h2>
          <p className="text-gray-600 mb-4">
            {landingError || "This shop's landing page is currently being set up."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Import landing themes dynamically to avoid circular deps
  const { GripLandingPage } = require("@/app/_themes/landing/themes/grip");
  const { ArcadiaLandingPage } = require("@/app/_themes/landing/themes/arcadia");
  const { NirvanaLandingPage } = require("@/app/_themes/landing/themes/nirvana");

  const themeName = landingData.theme_name;

  // Render based on theme
  switch (themeName) {
    case "Grip":
      return <GripLandingPage landingData={landingData} />;
    case "Arcadia":
      return <ArcadiaLandingPage landingData={landingData} />;
    case "Nirvana":
      return <NirvanaLandingPage landingData={landingData} />;
    default:
      // Fallback to Grip theme for unsupported themes
      return <GripLandingPage landingData={landingData} />;
  }
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
