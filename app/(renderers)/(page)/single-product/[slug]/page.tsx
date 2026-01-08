/**
 * ========================================
 * SINGLE PRODUCT / LANDING PAGE
 * ========================================
 *
 * Root-level single product page for standalone/subdomain mode
 * Uses shop details from store (populated by DEV_SHOP_ID or domain detection)
 * Supports both legacy landing pages (Grip, Arcadia, Nirvana) and Theme Builder landing pages
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
import BlockRenderer, { type Block } from "@/components/renderers/block-renderer";
import type { SingleProductTheme, ThemeBuilderSection } from "@/types/landing-page.types";

interface SingleProductPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Renders Theme Builder landing page sections
 */
function ThemeBuilderLandingPageRenderer({
  sections,
}: {
  sections: ThemeBuilderSection[];
}) {
  return (
    <div className="zatiq-theme-builder-landing-page">
      {sections
        .filter((section) => section.enabled !== false)
        .map((section) => {
          // Each section may have blocks array - render each block
          if (section.blocks && section.blocks.length > 0) {
            return (
              <div
                key={section.id}
                data-section-id={section.id}
                data-section-type={section.type}
              >
                {section.blocks.map((block, index) => (
                  <BlockRenderer
                    key={block.id || `${section.id}-block-${index}`}
                    block={block as unknown as Block}
                    data={(block.data as Record<string, unknown>) || {}}
                  />
                ))}
              </div>
            );
          }
          return null;
        })}
    </div>
  );
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

  // Get shop_id for API call
  const shopId = shopDetails?.id;

  // Fetch landing page data using shop_id
  const {
    isLoading,
    error,
    isThemeBuilder,
    isLegacy,
    legacyData,
    themeBuilderData,
    response,
  } = useLandingPage(
    {
      slug,
      shopId: shopId,
      preview: isPreview,
    },
    {
      // Enable query when we have slug and shop_id
      enabled: !!slug && !!shopId,
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
  if (error || !response) {
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

  // Render Theme Builder landing page
  if (isThemeBuilder && themeBuilderData) {
    return (
      <ThemeBuilderLandingPageRenderer sections={themeBuilderData.sections} />
    );
  }

  // Render legacy landing page
  if (isLegacy && legacyData) {
    const themeName = legacyData.theme_name as SingleProductTheme;

    switch (themeName) {
      case "Grip":
        return <GripLandingPage landingData={legacyData} />;

      case "Arcadia":
        return <ArcadiaLandingPage landingData={legacyData} />;

      case "Nirvana":
        return <NirvanaLandingPage landingData={legacyData} />;

      default:
        // Fallback to Grip theme for unsupported themes
        return <GripLandingPage landingData={legacyData} />;
    }
  }

  // Fallback - should not reach here
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
