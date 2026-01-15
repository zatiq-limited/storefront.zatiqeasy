"use client";

import { I18nextProvider } from "react-i18next";
import { useEffect } from "react";
import i18n from "@/lib/i18n/config";
import { useShopStore } from "@/stores/shopStore";
import {
  getEffectiveLanguage,
  hasUserLanguagePreference,
  LANGUAGE_KEYS,
} from "@/lib/utils/language-utils";

interface I18nProviderProps {
  children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const { shopDetails } = useShopStore();
  const shopDefaultLanguage = shopDetails?.default_language_code;
  const isLegacyTheme = shopDetails?.legacy_theme;

  // Sync language when shop profile loads or changes
  useEffect(() => {
    // Theme Builder (legacy_theme === false): Always use English
    // Static Themes (legacy_theme === true): Use priority-based language selection
    let effectiveLanguage: string;

    if (isLegacyTheme === false) {
      // Theme Builder mode - always English
      effectiveLanguage = "en";
    } else {
      // Static theme mode - use priority:
      // 1. User's manual preference (if set)
      // 2. Shop's default_language_code
      // 3. Fallback to "en"
      effectiveLanguage = getEffectiveLanguage(shopDefaultLanguage);
    }

    if (i18n.language !== effectiveLanguage) {
      i18n.changeLanguage(effectiveLanguage);
    }

    // Update legacy keys for compatibility (only if not a user preference and legacy theme)
    if (isLegacyTheme !== false && !hasUserLanguagePreference() && shopDefaultLanguage) {
      localStorage.setItem(LANGUAGE_KEYS.I18NEXT, effectiveLanguage);
      localStorage.setItem(LANGUAGE_KEYS.LOCALE, effectiveLanguage);
    }
  }, [shopDefaultLanguage, isLegacyTheme]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
