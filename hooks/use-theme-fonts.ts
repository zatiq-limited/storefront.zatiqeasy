"use client";

import { useMemo } from "react";
import { useShopStore } from "@/stores/shopStore";
import { getThemeData } from "@/lib/utils/theme-constants";

/**
 * useThemeFonts Hook
 *
 * Provides theme font configuration for components
 * Returns properly mapped CSS font-family strings
 *
 * @example
 * const { primaryFont, secondaryFont } = useThemeFonts();
 * <div style={{ fontFamily: primaryFont }}>Text</div>
 */
export function useThemeFonts() {
  const { shopDetails } = useShopStore();

  const themeData = useMemo(() => {
    return getThemeData(shopDetails?.shop_theme?.theme_name);
  }, [shopDetails?.shop_theme?.theme_name]);

  return {
    primaryFont: themeData.primaryFontCss,
    secondaryFont: themeData.secondaryFontCss,
    themeName: themeData.value,
    originalFontFamily: themeData.fontFamily,
    originalSecondaryFont: themeData.secondaryFont,
  };
}
