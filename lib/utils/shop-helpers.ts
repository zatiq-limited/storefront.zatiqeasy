/**
 * Shop Helper Utilities
 * Helper functions for shop-related operations
 */

/**
 * Get the favicon URL for a shop
 * Falls back to shop image_url if favicon_url is not set
 * @param faviconUrl - The shop's favicon URL
 * @param imageUrl - The shop's image URL (fallback)
 * @returns The favicon URL or default favicon
 */
export function getShopFaviconUrl(
  faviconUrl?: string | null,
  imageUrl?: string | null
): string {
  const url = faviconUrl || imageUrl;

  if (!url) {
    return "/favicon.ico";
  }

  // Check if it's a valid URL (http, https, or relative path)
  if (url.startsWith("http:") || url.startsWith("https:") || url.startsWith("/")) {
    // Replace old CDN domain with new one if needed
    return url.replace("d10rvdv6rxomuk.cloudfront.net", "www.easykoro.com");
  }

  return "/favicon.ico";
}

/**
 * Get the Open Graph image URL for a shop
 * @param imageUrl - The shop's image URL
 * @param defaultImage - Default image path
 * @returns The OG image URL
 */
export function getShopOgImageUrl(
  imageUrl?: string | null,
  defaultImage: string = "/og-image.jpg"
): string {
  if (!imageUrl) {
    return defaultImage;
  }

  if (imageUrl.startsWith("http:") || imageUrl.startsWith("https:") || imageUrl.startsWith("/")) {
    return imageUrl.replace("d10rvdv6rxomuk.cloudfront.net", "www.easykoro.com");
  }

  return defaultImage;
}

/**
 * Generate shop metadata title
 * @param shopName - The shop name
 * @param pageTitle - Optional page title
 * @returns Formatted title
 */
export function getShopTitle(
  shopName?: string | null,
  pageTitle?: string
): string {
  if (pageTitle && shopName) {
    return `${pageTitle} | ${shopName}`;
  }
  if (shopName) {
    return `${shopName}`;
  }
  return "Zatiq Store";
}

/**
 * Generate shop metadata description
 * @param shopName - The shop name
 * @param customDescription - Optional custom description
 * @returns Formatted description
 */
export function getShopDescription(
  shopName?: string | null,
  customDescription?: string
): string {
  if (customDescription) {
    return customDescription;
  }
  if (shopName) {
    return `Visit ${shopName} online store for amazing products and great deals.`;
  }
  return "Shop the latest products at great prices.";
}
