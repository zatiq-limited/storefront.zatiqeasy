const supportedLngs = ["en", "bn"];
export const ni18nConfig = {
  fallbackLng: supportedLngs,
  supportedLngs,
  ns: ["translation"],
  react: {
    useSuspense: false,
  },
  interpolation: {
    escapeValue: false, // Disable escaping special characters
  },
};