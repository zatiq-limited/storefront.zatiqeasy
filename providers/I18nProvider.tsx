"use client";

import { I18nextProvider } from "react-i18next";
import { useEffect } from "react";
import i18n from "@/lib/i18n/config";

interface I18nProviderProps {
  children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  // Initialize language from localStorage on mount
  useEffect(() => {
    const storedLang = localStorage.getItem("i18nextLng") || "en";
    if (storedLang !== i18n.language) {
      i18n.changeLanguage(storedLang);
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}