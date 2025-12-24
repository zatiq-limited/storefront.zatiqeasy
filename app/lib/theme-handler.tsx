"use client";

import React, { useEffect } from "react";
import { useShopStore } from "@/stores";
import { BasicHeader } from "@/app/_themes/basic/components/header";
import { BasicFooter } from "@/app/_themes/basic/components/footer";
import { AuroraHeader } from "@/app/_themes/aurora/components/header";
import { AuroraFooter } from "@/app/_themes/aurora/components/footer";
import { getThemeColors, getThemeColor } from "@/lib/utils";

// Theme handler similar to old project
export function ThemeHandler({ children }: { children: React.ReactNode }) {
  const { shopDetails } = useShopStore();
  const shopTheme = shopDetails?.shop_theme?.theme_name || "Basic";

  // Apply theme colors to CSS variables (same approach as old project)
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Get the primary color from theme_color (same as old project: shopDetails?.theme_color?.primary_color)
    let primaryColor = "#541DFF"; // Default purple color

    if (
      shopDetails?.theme_color?.primary_color &&
      shopDetails.theme_color.primary_color.length === 9
    ) {
      // Handle 9-character hex codes (same logic as old project)
      primaryColor = shopDetails.theme_color.primary_color.replace(
        /^.{1}.{2}/,
        (match) => match.charAt(0) + match.charAt(3)
      );
    } else if (shopDetails?.theme_color?.primary_color) {
      primaryColor = shopDetails.theme_color.primary_color;
    } else if (shopDetails?.shop_theme?.primary_color) {
      // Fallback to shop_theme.primary_color if theme_color doesn't exist
      primaryColor = getThemeColor(shopDetails.shop_theme.primary_color);
    }

    // Generate theme colors and apply to document
    const themeColors = getThemeColors(primaryColor);
    for (const color in themeColors) {
      document.documentElement.style.setProperty(color, themeColors[color]);
    }
  }, [shopDetails]);

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

    // Add other themes here when migrated
    case "Premium":
      // TODO: Implement PremiumHeader and PremiumFooter
      return <>{children}</>;

    case "Luxura":
      // TODO: Implement LuxuraHeader and LuxuraFooter
      return <>{children}</>;

    case "Sellora":
      // TODO: Implement SelloraHeader and SelloraFooter
      return <>{children}</>;

    default:
      return <>{children}</>;
  }
}
