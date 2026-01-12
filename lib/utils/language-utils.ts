"use client";

/**
 * Language Utility Functions
 *
 * Priority order for language selection:
 * 1. User's manual preference (if they clicked the language toggle)
 * 2. Shop's default_language_code from profile
 * 3. Fallback to "en"
 */

// Storage keys
export const LANGUAGE_KEYS = {
  // Stores the user's manually selected language
  USER_PREFERENCE: "user_language_preference",
  // Standard i18next key (kept for compatibility)
  I18NEXT: "i18nextLng",
  // Legacy key used by some components
  LOCALE: "locale",
} as const;

/**
 * Check if user has manually set a language preference
 */
export function hasUserLanguagePreference(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(LANGUAGE_KEYS.USER_PREFERENCE) !== null;
}

/**
 * Get the user's manually set language preference
 */
export function getUserLanguagePreference(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LANGUAGE_KEYS.USER_PREFERENCE);
}

/**
 * Set language as user's manual preference
 * Call this when user clicks the language toggle
 */
export function setUserLanguagePreference(lang: string): void {
  if (typeof window === "undefined") return;

  // Store as user's manual preference
  localStorage.setItem(LANGUAGE_KEYS.USER_PREFERENCE, lang);
  // Also update legacy keys for compatibility
  localStorage.setItem(LANGUAGE_KEYS.I18NEXT, lang);
  localStorage.setItem(LANGUAGE_KEYS.LOCALE, lang);
}

/**
 * Clear user's manual preference (revert to shop default)
 */
export function clearUserLanguagePreference(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LANGUAGE_KEYS.USER_PREFERENCE);
}

/**
 * Get the effective language based on priority:
 * 1. User's manual preference (if set)
 * 2. Shop's default_language_code
 * 3. Fallback to "en"
 */
export function getEffectiveLanguage(
  shopDefaultLanguage?: string | null
): string {
  // Priority 1: User's manual preference
  const userPreference = getUserLanguagePreference();
  if (userPreference) {
    return userPreference;
  }

  // Priority 2: Shop's default language
  if (shopDefaultLanguage) {
    return shopDefaultLanguage;
  }

  // Priority 3: Fallback
  return "en";
}

/**
 * Sync language with i18n instance
 * Call this when shop profile loads or language changes
 */
export function syncLanguage(
  i18n: { changeLanguage: (lang: string) => void; language: string },
  shopDefaultLanguage?: string | null
): string {
  const effectiveLanguage = getEffectiveLanguage(shopDefaultLanguage);

  if (i18n.language !== effectiveLanguage) {
    i18n.changeLanguage(effectiveLanguage);
  }

  // Update legacy keys for compatibility (but don't set as user preference)
  if (typeof window !== "undefined") {
    localStorage.setItem(LANGUAGE_KEYS.I18NEXT, effectiveLanguage);
    localStorage.setItem(LANGUAGE_KEYS.LOCALE, effectiveLanguage);
  }

  return effectiveLanguage;
}

/**
 * Toggle language between "en" and "bn"
 * Marks as user preference
 */
export function toggleLanguage(
  currentLang: string,
  i18n: { changeLanguage: (lang: string) => void }
): string {
  const newLang = currentLang === "en" ? "bn" : "en";

  // Set as user's manual preference
  setUserLanguagePreference(newLang);

  // Update i18n
  i18n.changeLanguage(newLang);

  return newLang;
}
