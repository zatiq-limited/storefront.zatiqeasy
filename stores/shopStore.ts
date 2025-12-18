import { create } from 'zustand';
import type { ShopProfile } from '@/types';

interface ShopState {
  // Shop data
  shopDetails: ShopProfile | null;

  // UI state
  isSearchModalOpen: boolean;
  isCartDrawerOpen: boolean;
  isMobileMenuOpen: boolean;

  // Language
  shopLanguage: string;

  // Visitor
  visitorId: string | null;
}

interface ShopActions {
  setShopDetails: (details: ShopProfile) => void;
  setSearchModalOpen: (open: boolean) => void;
  setCartDrawerOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setShopLanguage: (lang: string) => void;
  setVisitorId: (id: string | null) => void;
  toggleSearchModal: () => void;
  toggleCartDrawer: () => void;
  toggleMobileMenu: () => void;
}

export const useShopStore = create<ShopState & ShopActions>((set) => ({
  // Initial state
  shopDetails: null,
  isSearchModalOpen: false,
  isCartDrawerOpen: false,
  isMobileMenuOpen: false,
  shopLanguage: 'en',
  visitorId: null,

  // Actions
  setShopDetails: (details) => set({ shopDetails: details }),

  setSearchModalOpen: (open) => set({ isSearchModalOpen: open }),

  setCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),

  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

  setShopLanguage: (lang) => set({ shopLanguage: lang }),

  setVisitorId: (id) => set({ visitorId: id }),

  toggleSearchModal: () =>
    set((state) => ({ isSearchModalOpen: !state.isSearchModalOpen })),

  toggleCartDrawer: () =>
    set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
}));

// Selectors
export const selectShopDetails = (state: ShopState & ShopActions) =>
  state.shopDetails;

export const selectThemeType = (state: ShopState & ShopActions) =>
  state.shopDetails?.shop_theme?.theme_type || 'builder';

export const selectThemeName = (state: ShopState & ShopActions) =>
  state.shopDetails?.shop_theme?.theme_name || 'Basic';

export const selectCurrency = (state: ShopState & ShopActions) =>
  state.shopDetails?.country_currency || 'BDT';

export const selectCountryCode = (state: ShopState & ShopActions) =>
  state.shopDetails?.country_code || 'BD';
