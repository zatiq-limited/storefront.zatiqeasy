import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { CartProduct, VariantsState, OrderStatus } from '@/types';

interface CartState {
  products: Record<string, CartProduct>;
  cartExpiry: string | null;
  orderStatus: OrderStatus | undefined;
  isLoading: boolean;
  trackLink: string | null;
}

interface CartActions {
  addProduct: (product: Omit<CartProduct, 'cartId'> & { cartId?: string }) => string;
  removeProduct: (cartId: string) => void;
  updateQuantity: (cartId: string, qty: number) => void;
  incrementQty: (cartId: string) => void;
  decrementQty: (cartId: string) => void;
  updateVariants: (cartId: string, variants: VariantsState, newPrice?: number) => void;
  resetCart: () => void;
  clearCart: () => void;
  setOrderStatus: (status: OrderStatus | undefined) => void;
  setIsLoading: (loading: boolean) => void;
  setTrackLink: (link: string | null) => void;
  getCartProduct: (cartId: string) => CartProduct | undefined;
  getProductsByInventoryId: (inventoryId: number) => CartProduct[];
}

// Cart expiry duration (24 hours)
const CART_EXPIRY_HOURS = 24;

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      // Initial state
      products: {},
      cartExpiry: null,
      orderStatus: undefined,
      isLoading: false,
      trackLink: null,

      // Add product to cart
      addProduct: (product) => {
        const cartId = product.cartId || nanoid();
        const now = new Date();

        set((state) => {
          // Check if cart has expired
          if (state.cartExpiry) {
            const expiryDate = new Date(state.cartExpiry);
            expiryDate.setHours(expiryDate.getHours() + CART_EXPIRY_HOURS);
            if (now > expiryDate) {
              // Cart expired, reset it
              return {
                products: {
                  [cartId]: { ...product, cartId, qty: product.qty || 1 },
                },
                cartExpiry: now.toISOString(),
              };
            }
          }

          return {
            products: {
              ...state.products,
              [cartId]: { ...product, cartId, qty: product.qty || 1 },
            },
            cartExpiry:
              Object.keys(state.products).length === 0
                ? now.toISOString()
                : state.cartExpiry,
          };
        });

        return cartId;
      },

      // Remove product from cart
      removeProduct: (cartId) => {
        set((state) => {
          const newProducts = { ...state.products };
          delete newProducts[cartId];
          return {
            products: newProducts,
            cartExpiry:
              Object.keys(newProducts).length === 0 ? null : state.cartExpiry,
          };
        });
      },

      // Update product quantity
      updateQuantity: (cartId, qty) => {
        if (qty <= 0) {
          get().removeProduct(cartId);
          return;
        }
        set((state) => ({
          products: {
            ...state.products,
            [cartId]: { ...state.products[cartId], qty },
          },
        }));
      },

      // Increment quantity
      incrementQty: (cartId) => {
        const product = get().products[cartId];
        if (product) {
          get().updateQuantity(cartId, product.qty + 1);
        }
      },

      // Decrement quantity
      decrementQty: (cartId) => {
        const product = get().products[cartId];
        if (product) {
          get().updateQuantity(cartId, product.qty - 1);
        }
      },

      // Update selected variants
      updateVariants: (cartId, variants, newPrice) => {
        set((state) => {
          const product = state.products[cartId];
          if (!product) return state;

          return {
            products: {
              ...state.products,
              [cartId]: {
                ...product,
                selectedVariants: variants,
                ...(newPrice !== undefined && { price: newPrice }),
              },
            },
          };
        });
      },

      // Reset cart (keeps products but resets order status)
      resetCart: () =>
        set({
          orderStatus: undefined,
          trackLink: null,
          isLoading: false,
        }),

      // Clear entire cart
      clearCart: () =>
        set({
          products: {},
          cartExpiry: null,
          orderStatus: undefined,
          trackLink: null,
          isLoading: false,
        }),

      // Set order status
      setOrderStatus: (status) => set({ orderStatus: status }),

      // Set loading state
      setIsLoading: (loading) => set({ isLoading: loading }),

      // Set track link
      setTrackLink: (link) => set({ trackLink: link }),

      // Get cart product by ID
      getCartProduct: (cartId) => get().products[cartId],

      // Get products by inventory ID
      getProductsByInventoryId: (inventoryId) =>
        Object.values(get().products).filter((p) => p.id === inventoryId),
    }),
    {
      name: 'zatiq-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        cartExpiry: state.cartExpiry,
      }),
    }
  )
);

// Selectors
export const selectCartProducts = (state: CartState & CartActions) =>
  Object.values(state.products);

export const selectTotalItems = (state: CartState & CartActions) =>
  Object.values(state.products).reduce((sum, p) => sum + p.qty, 0);

export const selectSubtotal = (state: CartState & CartActions) =>
  Object.values(state.products).reduce((sum, p) => sum + p.price * p.qty, 0);

export const selectCartIsEmpty = (state: CartState & CartActions) =>
  Object.keys(state.products).length === 0;

export const selectCartProductCount = (state: CartState & CartActions) =>
  Object.keys(state.products).length;
