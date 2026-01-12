/**
 * App Wrapper Component
 *
 * Client component that conditionally wraps children with ThemeRouter and ThemeLayout
 * based on the current route. For merchant routes, the merchant layout handles wrapping.
 */

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeRouter } from "@/components/theme-router";
import ThemeLayout from "@/app/_layouts/theme/layout";
import { ThemeModeHandler } from "@/app/providers/theme-mode-handler";
import { useShopStore } from "@/stores";
import { getShopFaviconUrl } from "@/lib/utils/shop-helpers";
import { ThemeFontProvider } from "@/components/providers/theme-font-provider";

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const pathname = usePathname();
  const { shopDetails } = useShopStore();

  // Dynamic favicon - update when shop details change
  useEffect(() => {
    if (!shopDetails) return;

    const faviconUrl = getShopFaviconUrl(
      shopDetails.favicon_url,
      shopDetails.image_url
    );

    // Update favicon
    let iconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (iconLink) {
      iconLink.href = faviconUrl;
    } else {
      iconLink = document.createElement("link");
      iconLink.rel = "icon";
      iconLink.href = faviconUrl;
      document.head.appendChild(iconLink);
    }
  }, [shopDetails]);

  // Don't wrap with ThemeRouter and ThemeLayout for merchant routes
  // The merchant layout handles its own wrapping
  const isMerchantRoute = pathname?.startsWith("/merchant/");

  if (isMerchantRoute) {
    return (
      <>
        <ThemeModeHandler />
        {children}
      </>
    );
  }

  // For root route and other routes, use ThemeRouter and ThemeLayout
  return (
    <>
      <ThemeModeHandler />
      <ThemeRouter>
        <ThemeFontProvider />
        <ThemeLayout>{children}</ThemeLayout>
      </ThemeRouter>
    </>
  );
}
