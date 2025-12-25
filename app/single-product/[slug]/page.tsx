"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useLandingPage } from "@/hooks/useLandingPage";
import { useLandingStore } from "@/stores/landingStore";
import { useShopStore } from "@/stores/shopStore";
import { GripLandingPage } from "@/app/_themes/landing/themes/grip";
import { ArcadiaLandingPage } from "@/app/_themes/landing/themes/arcadia";
import { NirvanaLandingPage } from "@/app/_themes/landing/themes/nirvana";
import type { SingleProductTheme } from "@/types/landing-page.types";

export default function LandingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const isPreview = searchParams.get("preview") === "true";

  // Get shop details for the query
  const { shopDetails } = useShopStore();

  // Fetch landing page data
  const { data, isLoading, error } = useLandingPage(
    {
      slug,
      shopId: shopDetails?.id,
      preview: isPreview,
    },
    {
      // Enable query when we have slug and shop details
      enabled: !!slug && !!shopDetails?.id,
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
  if (isLoading || !shopDetails) {
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
