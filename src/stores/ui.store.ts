/**
 * UI Store - Zustand store for UI state management
 */
'use client';

import { create } from 'zustand';
import type { Product } from '@/api/types';

interface UIState {
  // Drawer states
  mobileMenuOpen: boolean;
  cartDrawerOpen: boolean;
  searchDrawerOpen: boolean;
  filterDrawerOpen: boolean;

  // Modal states
  quickViewProduct: Product | null;

  // Toast/notification state
  toast: ToastState | null;

  // Actions
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleCartDrawer: () => void;
  setCartDrawerOpen: (open: boolean) => void;
  toggleSearchDrawer: () => void;
  setSearchDrawerOpen: (open: boolean) => void;
  toggleFilterDrawer: () => void;
  setFilterDrawerOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  closeAllDrawers: () => void;
  showToast: (toast: ToastState) => void;
  hideToast: () => void;
}

interface ToastState {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  mobileMenuOpen: false,
  cartDrawerOpen: false,
  searchDrawerOpen: false,
  filterDrawerOpen: false,
  quickViewProduct: null,
  toast: null,

  // Actions
  toggleMobileMenu: () => {
    set((state) => ({
      mobileMenuOpen: !state.mobileMenuOpen,
      // Close other drawers when opening mobile menu
      cartDrawerOpen: state.mobileMenuOpen ? state.cartDrawerOpen : false,
      searchDrawerOpen: state.mobileMenuOpen ? state.searchDrawerOpen : false,
    }));
  },

  setMobileMenuOpen: (open) => {
    set({ mobileMenuOpen: open });
  },

  toggleCartDrawer: () => {
    set((state) => ({
      cartDrawerOpen: !state.cartDrawerOpen,
      // Close other drawers when opening cart
      mobileMenuOpen: state.cartDrawerOpen ? state.mobileMenuOpen : false,
      searchDrawerOpen: state.cartDrawerOpen ? state.searchDrawerOpen : false,
    }));
  },

  setCartDrawerOpen: (open) => {
    set({ cartDrawerOpen: open });
  },

  toggleSearchDrawer: () => {
    set((state) => ({
      searchDrawerOpen: !state.searchDrawerOpen,
      // Close other drawers when opening search
      mobileMenuOpen: state.searchDrawerOpen ? state.mobileMenuOpen : false,
      cartDrawerOpen: state.searchDrawerOpen ? state.cartDrawerOpen : false,
    }));
  },

  setSearchDrawerOpen: (open) => {
    set({ searchDrawerOpen: open });
  },

  toggleFilterDrawer: () => {
    set((state) => ({ filterDrawerOpen: !state.filterDrawerOpen }));
  },

  setFilterDrawerOpen: (open) => {
    set({ filterDrawerOpen: open });
  },

  setQuickViewProduct: (product) => {
    set({ quickViewProduct: product });
  },

  closeAllDrawers: () => {
    set({
      mobileMenuOpen: false,
      cartDrawerOpen: false,
      searchDrawerOpen: false,
      filterDrawerOpen: false,
      quickViewProduct: null,
    });
  },

  showToast: (toast) => {
    set({ toast });
    // Auto-hide toast after duration (default 3 seconds)
    if (toast.duration !== 0) {
      setTimeout(() => {
        set({ toast: null });
      }, toast.duration || 3000);
    }
  },

  hideToast: () => {
    set({ toast: null });
  },
}));

/**
 * Selector hooks for optimized re-renders
 */
export const useMobileMenuOpen = () =>
  useUIStore((state) => state.mobileMenuOpen);
export const useCartDrawerOpen = () =>
  useUIStore((state) => state.cartDrawerOpen);
export const useSearchDrawerOpen = () =>
  useUIStore((state) => state.searchDrawerOpen);
export const useFilterDrawerOpen = () =>
  useUIStore((state) => state.filterDrawerOpen);
export const useQuickViewProduct = () =>
  useUIStore((state) => state.quickViewProduct);
export const useToast = () => useUIStore((state) => state.toast);
