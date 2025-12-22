import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Re-export utilities from the utils directory for backwards compatibility
export * from "./utils/validation";
export * from "./utils/delivery";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

/**
 * Placeholder image data URL
 */
const placeholderImgaeDataUrl =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2UwZTBlMCIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==";

/**
 * Validates whether a given URL is a valid image URL (HTTP/HTTPS) or starts with a slash ("/").
 * Applies image optimization transformations for inventory images.
 *
 * @param {string} input - The URL string to validate.
 * @returns {string} The validated URL if it's valid; otherwise, placeholder image.
 */
export const getInventoryThumbImageUrl = (input?: string): string => {
  return input &&
    (input.startsWith("http:") ||
      input.startsWith("https:") ||
      input.startsWith("/"))
    ? input
        .replace("/inventories/", "/inventories/fit-in/400x400/")
        .replace("d10rvdv6rxomuk.cloudfront.net", "www.easykoro.com")
    : placeholderImgaeDataUrl;
};
