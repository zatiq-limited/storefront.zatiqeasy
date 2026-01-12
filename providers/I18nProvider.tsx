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

  // Sync language when shop profile loads or changes
  useEffect(() => {
    // Get effective language based on priority:
    // 1. User's manual preference (if set)
    // 2. Shop's default_language_code
    // 3. Fallback to "en"
    const effectiveLanguage = getEffectiveLanguage(shopDefaultLanguage);

    if (i18n.language !== effectiveLanguage) {
      i18n.changeLanguage(effectiveLanguage);
    }

    // Update legacy keys for compatibility (only if not a user preference)
    if (!hasUserLanguagePreference() && shopDefaultLanguage) {
      localStorage.setItem(LANGUAGE_KEYS.I18NEXT, effectiveLanguage);
      localStorage.setItem(LANGUAGE_KEYS.LOCALE, effectiveLanguage);
    }
  }, [shopDefaultLanguage]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
