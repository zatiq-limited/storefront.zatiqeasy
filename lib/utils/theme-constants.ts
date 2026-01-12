/**
 * Theme configuration data
 * Matches old project's constants.util.ts
 */

import { getFontFamily } from "./font-mapping";

export type ShopThemeProps = {
  name: string;
  value: string;
  bgColor: string;
  darkBgColor?: string;
  fontFamily: string;
  secondaryFont?: string;
  layoutStyle: string;
  // Computed font family strings for direct use
  primaryFontCss?: string;
  secondaryFontCss?: string;
};

export const shopThemes: ShopThemeProps[] = [
  {
    name: "Basic",
    value: "Basic",
    bgColor: "#F4F4F5",
    darkBgColor: "#18181b",
    fontFamily: "DM Sans",
    layoutStyle: "layout",
  },
  {
    name: "Premium",
    value: "Premium",
    bgColor: "#FFFFFF",
    darkBgColor: "#272727",
    fontFamily: "Fivo Sans Modern",
    layoutStyle: "layoutPremium",
  },
  {
    name: "Aurora",
    value: "Aurora",
    bgColor: "#F9FAFB",
    darkBgColor: "#272727",
    fontFamily: "Helvetica Now Text",
    secondaryFont: "Prata",
    layoutStyle: "layoutAurora",
  },
  {
    name: "Luxura",
    value: "Luxura",
    bgColor: "#F9FAFB",
    darkBgColor: "#272727",
    fontFamily: "Helvetica Now Text",
    secondaryFont: "Prata",
    layoutStyle: "layoutAurora",
  },
  {
    name: "Sellora",
    value: "Sellora",
    bgColor: "#FFFFFF",
    darkBgColor: "#272727",
    fontFamily: "Segoe UI",
    secondaryFont: "Segoe UI",
    layoutStyle: "layoutSellora",
  },
];

/**
 * Get theme data by theme name
 * @param themeName - The theme name (e.g., "Luxura", "Basic")
 * @returns Theme configuration object (defaults to Basic theme if not found)
 */
export function getThemeData(themeName?: string): ShopThemeProps {
  if (!themeName) {
    const theme = shopThemes[0];
    return {
      ...theme,
      primaryFontCss: getFontFamily(theme.fontFamily),
      secondaryFontCss: theme.secondaryFont
        ? getFontFamily(theme.secondaryFont)
        : getFontFamily(theme.fontFamily),
    };
  }

  const found = shopThemes.find((theme) => theme.value === themeName);
  const theme = found || shopThemes[0];

  // Return theme with computed CSS font family strings
  return {
    ...theme,
    primaryFontCss: getFontFamily(theme.fontFamily),
    secondaryFontCss: theme.secondaryFont
      ? getFontFamily(theme.secondaryFont)
      : getFontFamily(theme.fontFamily),
  };
}

export const singleProductThemes = ["Arcadia", "Nirvana", "Grip"];
