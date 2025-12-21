import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function titleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
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
