/**
 * User Preferences Store - Zustand store for user preferences
 */
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserPreferencesState {
  // Preferences
  darkMode: boolean;
  currency: string;
  locale: string;
  recentlyViewed: string[]; // Product IDs

  // Hydration flag
  isHydrated: boolean;

  // Actions
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;
  setCurrency: (currency: string) => void;
  setLocale: (locale: string) => void;
  addRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;
  setHydrated: () => void;
}

const MAX_RECENTLY_VIEWED = 10;

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set, get) => ({
      // Initial state
      darkMode: false,
      currency: 'USD',
      locale: 'en',
      recentlyViewed: [],
      isHydrated: false,

      // Actions
      toggleDarkMode: () => {
        set((state) => {
          const newDarkMode = !state.darkMode;
          // Update DOM class
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', newDarkMode);
          }
          return { darkMode: newDarkMode };
        });
      },

      setDarkMode: (enabled) => {
        set({ darkMode: enabled });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', enabled);
        }
      },

      setCurrency: (currency) => {
        set({ currency });
      },

      setLocale: (locale) => {
        set({ locale });
      },

      addRecentlyViewed: (productId) => {
        set((state) => {
          // Remove if already exists (to move to front)
          const filtered = state.recentlyViewed.filter((id) => id !== productId);
          // Add to front and limit to max
          const updated = [productId, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
          return { recentlyViewed: updated };
        });
      },

      clearRecentlyViewed: () => {
        set({ recentlyViewed: [] });
      },

      setHydrated: () => {
        const state = get();
        // Apply dark mode from persisted state
        if (typeof document !== 'undefined' && state.darkMode) {
          document.documentElement.classList.add('dark');
        }
        set({ isHydrated: true });
      },
    }),
    {
      name: 'zatiq-preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        darkMode: state.darkMode,
        currency: state.currency,
        locale: state.locale,
        recentlyViewed: state.recentlyViewed,
      }),
      // Skip hydration on server to prevent SSR mismatch
      skipHydration: true,
    }
  )
);

/**
 * Selector hooks for optimized re-renders
 */
export const useDarkMode = () =>
  useUserPreferencesStore((state) => state.darkMode);
export const useCurrency = () =>
  useUserPreferencesStore((state) => state.currency);
export const useLocale = () =>
  useUserPreferencesStore((state) => state.locale);
export const useRecentlyViewed = () =>
  useUserPreferencesStore((state) => state.recentlyViewed);
export const usePreferencesHydrated = () =>
  useUserPreferencesStore((state) => state.isHydrated);
