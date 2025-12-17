/**
 * Zustand Stores - Central export
 */

// Cart Store
export {
  useCartStore,
  useCartItems,
  useCartToken,
  useCartLoading,
  useCartError,
  useCartHydrated,
} from './cart.store';

// UI Store
export {
  useUIStore,
  useMobileMenuOpen,
  useCartDrawerOpen,
  useSearchDrawerOpen,
  useFilterDrawerOpen,
  useQuickViewProduct,
  useToast,
} from './ui.store';

// User Preferences Store
export {
  useUserPreferencesStore,
  useDarkMode,
  useCurrency,
  useLocale,
  useRecentlyViewed,
  usePreferencesHydrated,
} from './user-preferences.store';
