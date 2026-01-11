/**
 * Theme Constants
 * Contains theme-specific configuration for each shop theme
 */

export const MAX_PRODUCTS = 40;

export interface ShopThemeConfig {
  name: string;
  value: string;
  bgColor: string;
  darkBgColor: string;
  fontFamily: string;
  secondaryFont?: string;
  layoutStyle: string;
}

export const SHOP_THEMES: ShopThemeConfig[] = [
  {
    name: "Basic",
    value: "Basic",
    bgColor: "#F4F4F5",
    darkBgColor: "#18181b",
    fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
    layoutStyle: "layout",
  },
  {
    name: "Premium",
    value: "Premium",
    bgColor: "#FFFFFF",
    darkBgColor: "#272727",
    fontFamily: "var(--font-poppins), system-ui, sans-serif",
    layoutStyle: "layoutPremium",
  },
  {
    name: "Aurora",
    value: "Aurora",
    bgColor: "#F9FAFB",
    darkBgColor: "#272727",
    fontFamily: "var(--font-inter), system-ui, sans-serif",
    secondaryFont: "var(--font-playfair-display), serif",
    layoutStyle: "layoutAurora",
  },
  {
    name: "Luxura",
    value: "Luxura",
    bgColor: "#F9FAFB",
    darkBgColor: "#272727",
    fontFamily: "var(--font-inter), system-ui, sans-serif",
    secondaryFont: "var(--font-playfair-display), serif",
    layoutStyle: "layoutAurora",
  },
  {
    name: "Sellora",
    value: "Sellora",
    bgColor: "#FFFFFF",
    darkBgColor: "#272727",
    fontFamily: "var(--font-inter), system-ui, sans-serif",
    secondaryFont: "var(--font-inter), system-ui, sans-serif",
    layoutStyle: "layoutSellora",
  },
];

/**
 * Get theme configuration by theme name
 * @param themeName - The name of the theme
 * @returns The theme configuration or default (Basic) if not found
 */
export function getThemeConfig(themeName: string): ShopThemeConfig {
  const theme = SHOP_THEMES.find((t) => t.value === themeName);
  return theme || SHOP_THEMES[0]; // Default to Basic
}

/**
 * Get theme background color
 * @param themeName - The name of the theme
 * @param isDark - Whether dark mode is enabled
 * @returns The background color hex value
 */
export function getThemeBgColor(themeName: string, isDark = false): string {
  const theme = getThemeConfig(themeName);
  return isDark ? theme.darkBgColor : theme.bgColor;
}

/**
 * Get theme font family
 * @param themeName - The name of the theme
 * @param isSecondary - Whether to get the secondary font
 * @returns The font family CSS value
 */
export function getThemeFontFamily(themeName: string, isSecondary = false): string {
  const theme = getThemeConfig(themeName);
  if (isSecondary && theme.secondaryFont) {
    return theme.secondaryFont;
  }
  return theme.fontFamily;
}

/**
 * Single product landing page themes
 */
export const SINGLE_PRODUCT_THEMES = ["Arcadia", "Nirvana", "Grip"] as const;

export type SingleProductThemeName = (typeof SINGLE_PRODUCT_THEMES)[number];

/**
 * Check if a theme is a single product theme
 */
export function isSingleProductTheme(themeName: string): themeName is SingleProductThemeName {
  return SINGLE_PRODUCT_THEMES.includes(themeName as SingleProductThemeName);
}

/**
 * Legacy theme names (static themes)
 */
export const LEGACY_THEMES = ["Basic", "Premium", "Aurora", "Luxura", "Sellora"] as const;

export type LegacyThemeName = (typeof LEGACY_THEMES)[number];

/**
 * Check if a theme is a legacy theme
 */
export function isLegacyTheme(themeName: string): themeName is LegacyThemeName {
  return LEGACY_THEMES.includes(themeName as LegacyThemeName);
}
