"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useShopStore } from "@/stores";
import { BasicHeader } from "@/app/_themes/basic/components/header";
import { BasicFooter } from "@/app/_themes/basic/components/footer";
import { AuroraHeader } from "@/app/_themes/aurora/components/header";
import { AuroraFooter } from "@/app/_themes/aurora/components/footer";
import { LuxuraHeader } from "@/app/_themes/luxura/components/header";
import { LuxuraFooter } from "@/app/_themes/luxura/components/footer";
import { PremiumHeader } from "@/app/_themes/premium/components/header";
import { PremiumFooter } from "@/app/_themes/premium/components/footer";
import { SelloraHeader } from "@/app/_themes/sellora/components/header";
import { SelloraFooter } from "@/app/_themes/sellora/components/footer";
import { getThemeColors, getThemeColor } from "@/lib/utils";
import { getThemeConfig } from "@/lib/constants";

/**
 * Conditional Theme Handler
 * Renders the main theme's header/footer for regular pages,
 * but skips them for landing pages (single-product) which have their own navbar/footer.
 */
export function ConditionalThemeHandler({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { shopDetails } = useShopStore();
  const shopTheme = shopDetails?.shop_theme?.theme_name || "Basic";

  // Check if we're on a landing page (single-product)
  const isLandingPage = pathname?.includes("/single-product");

  // Get theme configuration for bg color and fonts
  const themeConfig = getThemeConfig(shopTheme);

  // Apply theme colors and background to CSS variables
  useEffect(() => {
    if (typeof window === "undefined") return;

    let primaryColor = "#541DFF";

    if (
      shopDetails?.theme_color?.primary_color &&
      shopDetails.theme_color.primary_color.length === 9
    ) {
      primaryColor = shopDetails.theme_color.primary_color.replace(
        /^.{1}.{2}/,
        (match) => match.charAt(0) + match.charAt(3)
      );
    } else if (shopDetails?.theme_color?.primary_color) {
      primaryColor = shopDetails.theme_color.primary_color;
    } else if (shopDetails?.shop_theme?.primary_color) {
      primaryColor = getThemeColor(shopDetails.shop_theme.primary_color);
    }

    const themeColors = getThemeColors(primaryColor);
    for (const color in themeColors) {
      document.documentElement.style.setProperty(color, themeColors[color]);
    }

    // Apply theme background color
    document.documentElement.style.setProperty("--theme-bg-color", themeConfig.bgColor);
    document.documentElement.style.setProperty("--theme-dark-bg-color", themeConfig.darkBgColor);
    document.body.style.backgroundColor = themeConfig.bgColor;

    // Apply theme font family
    document.documentElement.style.setProperty("--theme-font-family", themeConfig.fontFamily);
    if (themeConfig.secondaryFont) {
      document.documentElement.style.setProperty("--theme-secondary-font", themeConfig.secondaryFont);
    }
  }, [shopDetails, themeConfig]);

  // For landing pages, don't render main theme header/footer
  // The landing page components have their own navbar and footer
  if (isLandingPage) {
    return <>{children}</>;
  }

  // For regular pages, render with theme header/footer
  switch (shopTheme) {
    case "Basic":
      return (
        <>
          <BasicHeader />
          {children}
          <BasicFooter />
        </>
      );

    case "Aurora":
      return (
        <>
          <AuroraHeader />
          {children}
          <AuroraFooter />
        </>
      );

    case "Premium":
      return (
        <>
          <PremiumHeader />
          {children}
          <PremiumFooter />
        </>
      );

    case "Luxura":
      return (
        <>
          <LuxuraHeader />
          {children}
          <LuxuraFooter />
        </>
      );

    case "Sellora":
      return (
        <>
          <SelloraHeader />
          {children}
          <SelloraFooter />
        </>
      );

    default:
      return <>{children}</>;
  }
}
