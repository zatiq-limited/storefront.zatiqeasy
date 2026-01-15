"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import {
  getEffectiveLanguage,
  toggleLanguage as toggleLang,
  hasUserLanguagePreference,
  setUserLanguagePreference,
} from "@/lib/utils/language-utils";

/**
 * Hook to manage language with shop's default_language_code as priority
 *
 * Language behavior based on theme mode:
 * - Theme Builder (legacy_theme === false): Always English, toggle disabled
 * - Static Themes (legacy_theme === true): Priority-based selection
 *
 * Priority for Static Themes:
 * 1. User's manual preference (if they clicked the toggle)
 * 2. Shop's default_language_code from profile
 * 3. Fallback to "en"
 *
 * Note: Initial i18n sync is handled by I18nProvider.
 * This hook provides reactive language state and toggle functionality.
 *
 * Usage:
 * ```
 * const { language, toggleLanguage, isReady, isLanguageToggleEnabled } = useLanguageSync();
 * ```
 */
export function useLanguageSync() {
  const { i18n } = useTranslation();
  const { shopDetails } = useShopStore();

  const shopDefaultLanguage = shopDetails?.default_language_code;
  const isLegacyTheme = shopDetails?.legacy_theme;

  // Language toggle is only enabled for static themes (legacy_theme === true)
  const isLanguageToggleEnabled = isLegacyTheme === true;

  // Track manual language changes (when user clicks toggle in this session)
  const [manualLanguage, setManualLanguage] = useState<string | null>(null);

  // Derive the effective language based on theme mode and priority
  const language = useMemo(() => {
    // Theme Builder mode - always English
    if (isLegacyTheme === false) {
      return "en";
    }

    // Static theme mode - use priority
    // If user manually changed language in this session, use that
    if (manualLanguage !== null) {
      return manualLanguage;
    }
    // Otherwise, compute from stored preference or shop default
    return getEffectiveLanguage(shopDefaultLanguage);
  }, [manualLanguage, shopDefaultLanguage, isLegacyTheme]);

  // Ready when shop details are loaded
  const isReady = !!shopDetails;

  // Toggle language function (only works for static themes)
  const toggleLanguage = useCallback(() => {
    // Don't allow toggle in Theme Builder mode
    if (!isLanguageToggleEnabled) return;

    const newLang = toggleLang(language, i18n);
    setManualLanguage(newLang);
  }, [language, i18n, isLanguageToggleEnabled]);

  // Set specific language (only works for static themes)
  const setLang = useCallback(
    (lang: string) => {
      // Don't allow language change in Theme Builder mode
      if (!isLanguageToggleEnabled) return;

      setUserLanguagePreference(lang);
      i18n.changeLanguage(lang);
      setManualLanguage(lang);
    },
    [i18n, isLanguageToggleEnabled]
  );

  // Check if user has manually set a preference
  const hasManualPreference = hasUserLanguagePreference();

  return {
    language,
    toggleLanguage,
    setLanguage: setLang,
    isReady,
    hasManualPreference,
    shopDefaultLanguage,
    isLanguageToggleEnabled,
  };
}

export default useLanguageSync;
