/**
 * Cart Store - Zustand store for cart state management
 */
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from '@/api/types';

interface CartState {
  // State
  items: CartItem[];
  cartToken: string | null;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;

  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  setCartToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHydrated: () => void;

  // Computed (accessed as methods)
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      cartToken: null,
      isLoading: false,
      isHydrated: false,
      error: null,

      // Actions
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.variantId === item.variantId
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? {
                      ...i,
                      quantity: Math.min(
                        i.quantity + item.quantity,
                        i.maxQuantity
                      ),
                    }
                  : i
              ),
              error: null,
            };
          }

          const newItem: CartItem = {
            ...item,
            id: `${Date.now()}-${item.variantId}`,
          };

          return {
            items: [...state.items, newItem],
            error: null,
          };
        });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
              : item
          ),
          error: null,
        }));
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
          error: null,
        }));
      },

      clearCart: () => {
        set({ items: [], error: null });
      },

      setItems: (items) => {
        set({ items, error: null });
      },

      setCartToken: (token) => {
        set({ cartToken: token });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      setHydrated: () => {
        set({ isHydrated: true });
      },

      // Computed values as methods
      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'zatiq-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        cartToken: state.cartToken,
      }),
      // Skip hydration on server to prevent SSR mismatch
      skipHydration: true,
    }
  )
);

/**
 * Selector hooks for optimized re-renders
 */
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartToken = () => useCartStore((state) => state.cartToken);
export const useCartLoading = () => useCartStore((state) => state.isLoading);
export const useCartError = () => useCartStore((state) => state.error);
export const useCartHydrated = () => useCartStore((state) => state.isHydrated);
