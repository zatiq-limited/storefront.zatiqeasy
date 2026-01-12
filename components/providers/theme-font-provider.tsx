"use client";

import { useEffect } from "react";
import { useShopStore } from "@/stores/shopStore";
import { getThemeData } from "@/lib/utils/theme-constants";
import { getFontFamily } from "@/lib/utils/font-mapping";

/**
 * ThemeFontProvider
 *
 * Dynamically applies theme-specific fonts to the document root
 * This ensures static themes use their configured fonts
 */
export function ThemeFontProvider() {
  const { shopDetails } = useShopStore();

  useEffect(() => {
    // Get theme configuration from shop details
    const themeName = shopDetails?.shop_theme?.theme_name;
    const themeData = getThemeData(themeName);

    // Get font family strings from theme
    const primaryFont = getFontFamily(themeData.fontFamily);
    const secondaryFont = themeData.secondaryFont
      ? getFontFamily(themeData.secondaryFont)
      : primaryFont;

    // Apply fonts to CSS custom properties on the root element
    const root = document.documentElement;

    root.style.setProperty("--theme-primary-font", primaryFont);
    root.style.setProperty("--theme-secondary-font", secondaryFont);
    root.style.setProperty("--theme-font-family", primaryFont);

    // IMPORTANT: Override the --font-sans variable that Tailwind uses
    // This ensures that the default font-family uses the theme font
    root.style.setProperty("--font-sans", primaryFont);

    // Also set default font-family on body for static themes
    document.body.style.fontFamily = primaryFont;

    console.log(`[ThemeFontProvider] Applied fonts for ${themeName}:`, {
      primary: primaryFont,
      secondary: secondaryFont,
      cssVar: root.style.getPropertyValue("--font-sans"),
    });
  }, [shopDetails?.shop_theme?.theme_name]);

  return null; // This component doesn't render anything
}
