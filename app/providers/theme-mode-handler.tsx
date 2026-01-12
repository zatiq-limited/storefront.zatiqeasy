"use client";

import { useEffect } from "react";
import { useShopStore } from "@/stores/shopStore";

/**
 * Theme background colors configuration in oklch format
 * Matches the old project's constants.util.ts but uses oklch for Tailwind v4 compatibility
 *
 * Hex to oklch mapping:
 * - #18181b → oklch(0.145 0 0)
 * - #272727 → oklch(0.2 0 0)
 * - #F4F4F5 → oklch(0.96 0 0)
 * - #FFFFFF → oklch(1 0 0)
 * - #F9FAFB → oklch(0.98 0 0)
 */
const THEME_BACKGROUNDS: Record<string, { light: string; dark: string }> = {
  Basic: { light: "oklch(0.96 0 0)", dark: "oklch(0.145 0 0)" },
  Premium: { light: "oklch(1 0 0)", dark: "oklch(0.2 0 0)" },
  Aurora: { light: "oklch(0.98 0 0)", dark: "oklch(0.2 0 0)" },
  Luxura: { light: "oklch(0.98 0 0)", dark: "oklch(0.2 0 0)" },
  Sellora: { light: "oklch(1 0 0)", dark: "oklch(0.2 0 0)" },
};

/**
 * Theme Mode Handler
 *
 * Applies the theme mode (dark/light) class to the HTML element
 * based on shop_theme.theme_mode from shopDetails.
 *
 * Also sets:
 * - CSS color-scheme property for native browser styling
 * - Background color based on theme name and mode (using oklch for Tailwind compatibility)
 */
export function ThemeModeHandler() {
  const { shopDetails } = useShopStore();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Get theme mode and name from shop_theme
    const shopTheme = shopDetails?.shop_theme as
      | { theme_mode?: string; theme_name?: string }
      | undefined;
    const themeMode = shopTheme?.theme_mode || "light";
    const themeName = shopTheme?.theme_name || "Basic";

    const htmlElement = document.documentElement;

    // Remove existing theme classes
    htmlElement.classList.remove("light", "dark");

    // Add new theme class
    htmlElement.classList.add(themeMode);

    // Set color-scheme for native browser styling (scrollbars, form controls, etc.)
    htmlElement.style.colorScheme = themeMode === "dark" ? "dark" : "light";

    // Set background color based on theme name and mode using oklch
    const themeConfig = THEME_BACKGROUNDS[themeName] || THEME_BACKGROUNDS.Basic;
    const backgroundColor =
      themeMode === "dark" ? themeConfig.dark : themeConfig.light;

    // Set as CSS variable on root element - this overrides Tailwind's --background
    // Using oklch format to match Tailwind v4's color system
    htmlElement.style.setProperty("--background", backgroundColor);

    // Also set directly on body as fallback with !important
    document.body.style.setProperty(
      "background-color",
      backgroundColor,
      "important"
    );
  }, [shopDetails]);

  // This component doesn't render anything
  return null;
}

export default ThemeModeHandler;
