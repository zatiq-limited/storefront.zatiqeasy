/**
 * Format price with currency
 * @param price - The price to format
 * @param currency - The currency code (default: "BDT")
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = "BDT"): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Convert string to title case
 * @param str - String to convert
 * @returns Title cased string
 */
export function titleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Applies opacity to a hexadecimal color code.
 *
 * @param {string} hex - The hexadecimal color code.
 * @param {number} opacity - The opacity value (between 0 and 1).
 * @returns {string} - The RGBA color code with the applied opacity.
 */
export function applyOpacityToHexColor(hex: string, opacity: number): string {
  // Remove the '#' character if it exists
  hex = hex.replace(/^#/, "");

  // Parse the hex value to RGB
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Ensure opacity is within the range [0, 1]
  opacity = Math.min(1, Math.max(0, opacity));

  // Create the RGBA string with the opacity
  const rgbaColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;

  return rgbaColor;
}

/**
 * Generates theme colors based on the primary color.
 *
 * @param {string} color - The primary color (hex format).
 * @param {string} colorName - The name prefix for the CSS variables (default: "primary").
 * @returns {Record<string, string>} - An object containing the theme colors.
 */
export const getThemeColors = (
  color: string,
  colorName: string = "primary"
): Record<string, string> => {
  return {
    [`--${colorName}-color`]: color,
    [`--${colorName}-color-10`]: applyOpacityToHexColor(color, 0.1),
    [`--${colorName}-color-15`]: applyOpacityToHexColor(color, 0.15),
    [`--${colorName}-color-25`]: applyOpacityToHexColor(color, 0.25),
    [`--${colorName}-color-50`]: applyOpacityToHexColor(color, 0.5),
    [`--${colorName}-color-75`]: applyOpacityToHexColor(color, 0.75),
  };
};

/**
 * Normalizes a theme color, handling 9-character hex codes.
 *
 * @param {string | undefined} color - The color to normalize.
 * @returns {string} - The normalized color.
 */
export const getThemeColor = (color?: string): string => {
  let changedColor = "#541DFF"; // Default purple color

  if (color && color.length === 9) {
    changedColor = color.replace(
      /^.{1}.{2}/,
      (match) => match.charAt(0) + match.charAt(3)
    );
  } else if (color) {
    changedColor = color;
  }

  return changedColor;
};

// Placeholder image data URL
const placeholderImageDataUrl =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

/**
 * Transform inventory image URL to use CDN thumbnail optimization
 * Matches old project implementation
 */
export const getInventoryThumbImageUrl = (input?: string): string => {
  if (!input) return placeholderImageDataUrl;

  const startsWithProtocol =
    input.startsWith("http:") ||
    input.startsWith("https:") ||
    input.startsWith("/");

  if (!startsWithProtocol) return placeholderImageDataUrl;

  return input
    .replace("/inventories/", "/inventories/fit-in/400x400/")
    .replace("d10rvdv6rxomuk.cloudfront.net", "www.easykoro.com");
};

/**
 * Transform slider image URL to use CDN optimization for carousel banners
 * Optimizes for 1720x1080 resolution
 * Returns original URL if transformations don't apply
 */
export const getSliderImage = (input?: string): string => {
  if (!input) return placeholderImageDataUrl;

  // Return original URL if it doesn't match expected patterns
  const startsWithProtocol =
    input.startsWith("http:") ||
    input.startsWith("https:") ||
    input.startsWith("/");

  if (!startsWithProtocol) return input;

  // Try to apply CDN transformations - if URL contains /shops/, add fit-in parameter
  // Otherwise return original URL unchanged
  let result = input;
  if (result.includes("/shops/")) {
    result = result.replace("/shops/", "/shops/fit-in/1720x1080/");
  }

  return result;
};

/**
 * Transform shop image URL to use CDN thumbnail optimization
 * Optimizes for 400x400 resolution
 */
export const getShopImageUrl = (input?: string): string => {
  if (!input) return placeholderImageDataUrl;

  const startsWithProtocol =
    input.startsWith("http:") ||
    input.startsWith("https:") ||
    input.startsWith("/");

  if (!startsWithProtocol) return placeholderImageDataUrl;

  return input
    .replace("/shops/", "/shops/fit-in/400x400/")
    .replace("d10rvdv6rxomuk.cloudfront.net", "www.easykoro.com");
};

/**
 * Transform detail page image URL to use CDN optimization
 * Optimizes for 600x800 resolution
 */
export const getDetailPageImageUrl = (input?: string): string => {
  if (!input) return placeholderImageDataUrl;

  const startsWithProtocol =
    input.startsWith("http:") ||
    input.startsWith("https:") ||
    input.startsWith("/");

  if (!startsWithProtocol) return placeholderImageDataUrl;

  return input
    .replace("/inventories/", "/inventories/fit-in/600x800/")
    .replace("d10rvdv6rxomuk.cloudfront.net", "www.easykoro.com");
};

/**
 * Get validated image URL or placeholder
 */
export const getImageUrl = (input?: string): string => {
  if (!input) return placeholderImageDataUrl;

  const startsWithProtocol =
    input.startsWith("http:") ||
    input.startsWith("https:") ||
    input.startsWith("/");

  if (!startsWithProtocol) return placeholderImageDataUrl;

  return input.replace("d10rvdv6rxomuk.cloudfront.net", "www.easykoro.com");
};
