"use client";

import { useEffect } from "react";
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

  console.log("merchant/[shopId]/page.tsx - pathname:", pathname, "isLegacyTheme:", isLegacyTheme, "isHomepageRoute:", isHomepageRoute);

  // Legacy mode + Homepage: ThemeRouter already rendered the static theme, skip this
  if (isLegacyTheme && isHomepageRoute) {
    console.log("merchant/[shopId]/page.tsx - Legacy mode homepage, returning null");
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
  console.log("merchant/[shopId]/page.tsx - Theme Builder mode, rendering BlockRenderer");

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
