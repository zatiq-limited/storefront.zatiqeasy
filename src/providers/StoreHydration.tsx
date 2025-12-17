/**
 * Store Hydration Provider
 *
 * Handles hydration of persisted Zustand stores to prevent SSR mismatches
 */
'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useCartStore } from '@/stores/cart.store';
import { useUserPreferencesStore } from '@/stores/user-preferences.store';

interface StoreHydrationProps {
  children: ReactNode;
}

export function StoreHydration({ children }: StoreHydrationProps) {
  const hydrated = useRef(false);

  useEffect(() => {
    // Only hydrate once
    if (hydrated.current) return;
    hydrated.current = true;

    // Rehydrate persisted stores
    // This triggers the persist middleware to load from localStorage
    useCartStore.persist.rehydrate();
    useUserPreferencesStore.persist.rehydrate();

    // Mark stores as hydrated
    useCartStore.getState().setHydrated();
    useUserPreferencesStore.getState().setHydrated();
  }, []);

  return <>{children}</>;
}
