"use client";

import React, { useEffect } from "react";
import { useShopStore } from "@/stores";
import { getThemeColors, getThemeColor } from "@/lib/utils";

/**
 * Single Product Landing Page Layout
 * This layout does NOT include the main theme's header/footer.
 * Landing pages (Arcadia, Nirvana, Grip) have their own specific navbar and footer.
 */
export default function SingleProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { shopDetails } = useShopStore();

  // Apply theme colors to CSS variables (same approach as ThemeHandler)
  useEffect(() => {
    if (typeof window === "undefined") return;

    let primaryColor = "#541DFF"; // Default purple color

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
  }, [shopDetails]);

  // Render children without main theme header/footer
  // The landing page components (Arcadia, Nirvana, Grip) have their own navbar/footer
  return <>{children}</>;
}
