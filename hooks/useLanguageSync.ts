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
 * Priority:
 * 1. User's manual preference (if they clicked the toggle)
 * 2. Shop's default_language_code from profile
 * 3. Fallback to "en"
 *
 * Note: Initial i18n sync is handled by I18nProvider.
 * This hook provides reactive language state and toggle functionality.
 *
 * Usage:
 * ```
 * const { language, toggleLanguage, isReady } = useLanguageSync();
 * ```
 */
export function useLanguageSync() {
  const { i18n } = useTranslation();
  const { shopDetails } = useShopStore();

  const shopDefaultLanguage = shopDetails?.default_language_code;

  // Track manual language changes (when user clicks toggle in this session)
  const [manualLanguage, setManualLanguage] = useState<string | null>(null);

  // Derive the effective language based on priority
  const language = useMemo(() => {
    // If user manually changed language in this session, use that
    if (manualLanguage !== null) {
      return manualLanguage;
    }
    // Otherwise, compute from stored preference or shop default
    return getEffectiveLanguage(shopDefaultLanguage);
  }, [manualLanguage, shopDefaultLanguage]);

  // Ready when shop details are loaded
  const isReady = !!shopDetails;

  // Toggle language function
  const toggleLanguage = useCallback(() => {
    const newLang = toggleLang(language, i18n);
    setManualLanguage(newLang);
  }, [language, i18n]);

  // Set specific language
  const setLang = useCallback(
    (lang: string) => {
      setUserLanguagePreference(lang);
      i18n.changeLanguage(lang);
      setManualLanguage(lang);
    },
    [i18n]
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
  };
}

export default useLanguageSync;
