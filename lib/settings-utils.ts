/**
 * Utility functions for handling component settings
 * Converts snake_case keys from JSON to camelCase for React components
 */

/**
 * Convert snake_case string to camelCase
 */
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert object keys from snake_case to camelCase
 */
export function convertSettingsKeys<T = Record<string, unknown>>(
  settings: Record<string, unknown>
): T {
  const converted: Record<string, unknown> = {};

  Object.keys(settings).forEach((key) => {
    const camelKey = snakeToCamel(key);
    converted[camelKey] = settings[key];
  });

  return converted as T;
}

/**
 * Get setting value with fallback
 * Tries both snake_case and camelCase versions
 */
export function getSetting<T>(
  settings: Record<string, unknown>,
  key: string,
  defaultValue: T
): T {
  // Try camelCase first
  if (settings[key] !== undefined) {
    return settings[key] as T;
  }

  // Try snake_case
  const snakeKey = key.replace(
    /[A-Z]/g,
    (letter) => `_${letter.toLowerCase()}`
  );
  if (settings[snakeKey] !== undefined) {
    return settings[snakeKey] as T;
  }

  return defaultValue;
}