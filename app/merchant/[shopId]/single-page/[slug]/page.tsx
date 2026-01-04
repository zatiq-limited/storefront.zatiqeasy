"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useLandingPage } from "@/hooks/useLandingPage";
import { useLandingStore } from "@/stores/landingStore";
import { useShopStore } from "@/stores/shopStore";
import { useShopProfile } from "@/hooks";
import { GripLandingPage } from "@/app/_themes/landing/themes/grip";
import { ArcadiaLandingPage } from "@/app/_themes/landing/themes/arcadia";
import { NirvanaLandingPage } from "@/app/_themes/landing/themes/nirvana";
import LandingPageRenderer from "@/components/renderers/page-renderer/landing-page-renderer";
import {
  type SingleProductTheme,
  isBlockBasedLandingPage,
} from "@/types/landing-page.types";
import type { ShopProfile } from "@/types";

/**
 * Merchant Single Page / Landing Page
 * Route: /merchant/[shopId]/single-page/[slug]
 * Example: /merchant/47366/single-page/test
 */
export default function MerchantLandingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const shopId = params.shopId as string;
  const slug = params.slug as string;
  const isPreview = searchParams.get("preview") === "true";

  const { shopDetails, setShopDetails } = useShopStore();

  // Fetch shop profile if not in store
  const hasShopData = shopDetails && shopDetails.id === Number(shopId);
  const { data: shopProfile, isLoading: isProfileLoading } = useShopProfile(
    { shopId },
    { enabled: !hasShopData }
  );

  // Set shop details in store
  useEffect(() => {
    if (shopProfile && !hasShopData) {
      setShopDetails(shopProfile as unknown as ShopProfile);
    }
  }, [shopProfile, hasShopData, setShopDetails]);

  // Use store data if available, otherwise use fetched data
  const activeShopData = hasShopData ? shopDetails : shopProfile;

  // Get shop_uuid for API call (backend expects UUID, not numeric ID)
  const shopUuid = activeShopData?.shop_uuid;

  // Fetch landing page data using shop_uuid AND shopId (for block-based pages)
  const { data, isLoading, error } = useLandingPage(
    {
      slug,
      shopUuid: shopUuid,
      shopId: shopId, // Pass numeric shopId for theme-api-server fallback
      preview: isPreview,
    },
    {
      // Enable query when we have slug and (shop_uuid or shopId)
      enabled: !!slug && !!(shopUuid || shopId),
      syncToStore: true,
    }
  );

  // Get store actions
  const { clearOrderState } = useLandingStore();

  // Clear order state when slug changes (new landing page)
  useEffect(() => {
    clearOrderState();
  }, [slug, clearOrderState]);

  // Loading state
  if (isLoading || isProfileLoading || !activeShopData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Page Not Found
          </h1>
          <p className="text-muted-foreground">
            The landing page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  // Check if this is a block-based landing page
  if (isBlockBasedLandingPage(data)) {
    // Extract product data from inventory
    const inventory = data.inventory;
    const discountPercent =
      inventory?.old_price && inventory?.price
        ? Math.round(
            ((inventory.old_price - inventory.price) / inventory.old_price) * 100
          )
        : 0;

    const productData = {
      title: inventory?.name || data.page_title,
      price: inventory?.price || 0,
      originalPrice: inventory?.old_price || inventory?.price || 0,
      discount: discountPercent,
      stock: inventory?.quantity || 0,
      images: inventory?.images || (inventory?.image_url ? [inventory.image_url] : []),
      variants: inventory?.variant_types?.flatMap((vt) =>
        vt.variants.map((v) => ({
          id: String(v.id || ""),
          name: vt.title || "",
          value: v.name || "",
          price: v.price,
        }))
      ) || [],
      currency: "BDT",
    };

    const shopData = {
      name: activeShopData?.shop_name || "",
      logo: activeShopData?.profile_photo || "",
    };

    return (
      <LandingPageRenderer
        sections={data.sections || []}
        product={productData}
        shop={shopData}
        onOrderSubmit={async (orderData) => {
          // TODO: Implement order submission logic
          console.log("Order submitted:", orderData);
        }}
      />
    );
  }

  // Legacy theme rendering
  const themeName = data.theme_name as SingleProductTheme;

  // Render based on theme
  switch (themeName) {
    case "Grip":
      return <GripLandingPage landingData={data} />;

    case "Arcadia":
      return <ArcadiaLandingPage landingData={data} />;

    case "Nirvana":
      return <NirvanaLandingPage landingData={data} />;

    default:
      // Fallback to Grip theme for unsupported themes
      return <GripLandingPage landingData={data} />;
  }
}
