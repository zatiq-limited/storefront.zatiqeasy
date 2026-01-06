/**
 * ========================================
 * SINGLE PRODUCT / LANDING PAGE
 * ========================================
 *
 * Root-level single product page for standalone/subdomain mode
 * Uses shop details from store (populated by DEV_SHOP_ID or domain detection)
 */

"use client";

import { use, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLandingPage } from "@/hooks/useLandingPage";
import { useLandingStore } from "@/stores/landingStore";
import { useShopStore } from "@/stores/shopStore";
import { GripLandingPage } from "@/app/_themes/landing/themes/grip";
import { ArcadiaLandingPage } from "@/app/_themes/landing/themes/arcadia";
import { NirvanaLandingPage } from "@/app/_themes/landing/themes/nirvana";
import type { SingleProductTheme } from "@/types/landing-page.types";

interface SingleProductPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Single Product / Landing Page (Root Level)
 * Works with shop detection from DEV_SHOP_ID or domain/subdomain
 */
export default function SingleProductPage({ params }: SingleProductPageProps) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";

  const { shopDetails } = useShopStore();

  // Get shop_uuid for API call (backend expects UUID, not numeric ID)
  const shopUuid = shopDetails?.shop_uuid;

  // Fetch landing page data using shop_uuid
  const { data, isLoading, error } = useLandingPage(
    {
      slug,
      shopUuid: shopUuid,
      preview: isPreview,
    },
    {
      // Enable query when we have slug and shop_uuid
      enabled: !!slug && !!shopUuid,
      syncToStore: true,
    }
  );

  // Get store actions
  const { clearOrderState } = useLandingStore();

  // Clear order state when slug changes (new landing page)
  useEffect(() => {
    clearOrderState();
  }, [slug, clearOrderState]);

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [slug]);

  // Loading state - wait for shop details and landing page data
  if (!shopDetails || isLoading) {
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
