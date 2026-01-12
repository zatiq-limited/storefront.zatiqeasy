/**
 * Font Mapping Utility
 * Maps theme font names to available Google Fonts and fallback font families
 *
 * IMPORTANT: Some themes use premium/custom fonts that are not on Google Fonts.
 * These fonts must be self-hosted or loaded from external sources.
 * This utility provides proper fallback chains for all fonts.
 */

export interface FontMapping {
  googleFont?: string; // Google Font import name (optional)
  fallback: string; // CSS fallback font family chain
  isPremium: boolean; // Whether this is a premium font that needs self-hosting
  className?: string; // Optional CSS class name
}

export const fontMappings: Record<string, FontMapping> = {
  // ============================================
  // PREMIUM/CUSTOM FONTS (Not on Google Fonts)
  // These fonts need to be self-hosted or loaded from CDN
  // ============================================

  "Fivo Sans Modern": {
    fallback: '"Fivo Sans Modern", "Outfit", "Segoe UI", sans-serif',
    isPremium: true,
    googleFont: "Outfit", // Load Outfit as close alternative
  },

  "Special Gothic": {
    fallback: '"Special Gothic", "Unbounded", "Oswald", sans-serif',
    isPremium: true,
    googleFont: "Oswald", // Load Oswald as close alternative
  },

  "Helvetica Now Text": {
    fallback: '"Helvetica Now Text", "Helvetica Neue", "Helvetica", "Inter", Arial, sans-serif',
    isPremium: true,
    googleFont: "Inter", // Load Inter as close alternative
  },

  // ============================================
  // GOOGLE FONTS (Freely Available)
  // ============================================

  "Prata": {
    googleFont: "Prata",
    fallback: '"Prata", "Prata-Regular", serif',
    isPremium: false,
  },

  "DM Sans": {
    googleFont: "DM_Sans",
    fallback: '"DM Sans", sans-serif',
    isPremium: false,
  },

  "Inter": {
    googleFont: "Inter",
    fallback: '"Inter", sans-serif',
    isPremium: false,
  },

  "Roboto": {
    googleFont: "Roboto",
    fallback: '"Roboto", sans-serif',
    isPremium: false,
  },

  "Open Sans": {
    googleFont: "Open_Sans",
    fallback: '"Open Sans", sans-serif',
    isPremium: false,
  },

  "Lato": {
    googleFont: "Lato",
    fallback: '"Lato", sans-serif',
    isPremium: false,
  },

  "Poppins": {
    googleFont: "Poppins",
    fallback: '"Poppins", sans-serif',
    isPremium: false,
  },

  "Montserrat": {
    googleFont: "Montserrat",
    fallback: '"Montserrat", sans-serif',
    isPremium: false,
  },

  "Source Sans 3": {
    googleFont: "Source_Sans_3",
    fallback: '"Source Sans 3", sans-serif',
    isPremium: false,
  },

  "Nunito": {
    googleFont: "Nunito",
    fallback: '"Nunito", sans-serif',
    isPremium: false,
  },

  "Raleway": {
    googleFont: "Raleway",
    fallback: '"Raleway", sans-serif',
    isPremium: false,
  },

  "Work Sans": {
    googleFont: "Work_Sans",
    fallback: '"Work Sans", sans-serif',
    isPremium: false,
  },

  "Playfair Display": {
    googleFont: "Playfair_Display",
    fallback: '"Playfair Display", serif',
    isPremium: false,
  },

  "Merriweather": {
    googleFont: "Merriweather",
    fallback: '"Merriweather", serif',
    isPremium: false,
  },

  "Oswald": {
    googleFont: "Oswald",
    fallback: '"Oswald", sans-serif',
    isPremium: false,
  },

  "PT Sans": {
    googleFont: "PT_Sans",
    fallback: '"PT Sans", sans-serif',
    isPremium: false,
  },

  "Ubuntu": {
    googleFont: "Ubuntu",
    fallback: '"Ubuntu", sans-serif',
    isPremium: false,
  },

  "Quicksand": {
    googleFont: "Quicksand",
    fallback: '"Quicksand", sans-serif',
    isPremium: false,
  },

  "Manrope": {
    googleFont: "Manrope",
    fallback: '"Manrope", sans-serif',
    isPremium: false,
  },

  "Space Grotesk": {
    googleFont: "Space_Grotesk",
    fallback: '"Space Grotesk", sans-serif',
    isPremium: false,
  },

  "Lora": {
    googleFont: "Lora",
    fallback: '"Lora", serif',
    isPremium: false,
  },

  "Outfit": {
    googleFont: "Outfit",
    fallback: '"Outfit", sans-serif',
    isPremium: false,
  },

  // ============================================
  // SYSTEM FONTS
  // ============================================

  "Segoe UI": {
    googleFont: "Inter", // Load Inter as enhancement
    fallback: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    isPremium: false,
  },

  "sans-serif": {
    googleFont: "Inter",
    fallback: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    isPremium: false,
  },
};

/**
 * Get font mapping for a theme font name
 * @param fontName - The theme font name (e.g., "Helvetica Now Text", "Prata")
 * @returns Font mapping with Google Font name and CSS fallback
 */
export function getFontMapping(fontName?: string): FontMapping {
  if (!fontName) {
    return fontMappings["Inter"];
  }

  // Direct match
  if (fontMappings[fontName]) {
    return fontMappings[fontName];
  }

  // Case-insensitive match
  const lowerFontName = fontName.toLowerCase();
  const matchedKey = Object.keys(fontMappings).find(
    (key) => key.toLowerCase() === lowerFontName
  );

  if (matchedKey) {
    return fontMappings[matchedKey];
  }

  // Fallback to Inter if not found
  return fontMappings["Inter"];
}

/**
 * Get CSS font-family string for a theme font
 * @param fontName - The theme font name
 * @returns CSS font-family value with proper fallback chain
 */
export function getFontFamily(fontName?: string): string {
  const mapping = getFontMapping(fontName);
  return mapping.fallback;
}

/**
 * Check if a font is premium (requires self-hosting)
 * @param fontName - The theme font name
 * @returns true if font is premium and needs self-hosting
 */
export function isPremiumFont(fontName?: string): boolean {
  const mapping = getFontMapping(fontName);
  return mapping.isPremium;
}

/**
 * Get list of premium fonts used by themes
 * @param fontNames - Array of theme font names
 * @returns Array of premium font names that need to be self-hosted
 */
export function getPremiumFonts(fontNames: string[]): string[] {
  const premiumFonts = new Set<string>();

  fontNames.forEach((fontName) => {
    const mapping = getFontMapping(fontName);
    if (mapping.isPremium) {
      premiumFonts.add(fontName);
    }
  });

  return Array.from(premiumFonts);
}

/**
 * Get list of unique Google Fonts to load based on theme fonts
 * @param fontNames - Array of theme font names
 * @returns Array of Google Font names that need to be loaded
 */
export function getRequiredGoogleFonts(fontNames: string[]): string[] {
  const fonts = new Set<string>();

  fontNames.forEach((fontName) => {
    const mapping = getFontMapping(fontName);
    if (mapping.googleFont) {
      fonts.add(mapping.googleFont);
    }
  });

  return Array.from(fonts);
}
