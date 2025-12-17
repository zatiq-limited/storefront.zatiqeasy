/**
 * Cart Hooks - React Query hooks for cart operations
 */
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCartStore } from '@/stores/cart.store';
import { useUIStore } from '@/stores/ui.store';
import * as cartApi from '@/api/client/cart';
import type { AddToCartRequest, Cart } from '@/api/types';

/**
 * Query keys for cart
 */
export const cartKeys = {
  all: ['cart'] as const,
  detail: (token: string) => [...cartKeys.all, token] as const,
};

/**
 * Hook to fetch cart data
 */
export function useCart() {
  const cartToken = useCartStore((state) => state.cartToken);
  const isHydrated = useCartStore((state) => state.isHydrated);

  return useQuery({
    queryKey: cartKeys.detail(cartToken || ''),
    queryFn: () => cartApi.getCart(cartToken || undefined),
    enabled: isHydrated && !!cartToken,
    staleTime: 30 * 1000, // 30 seconds for cart data
  });
}

/**
 * Hook to add item to cart
 */
export function useAddToCart() {
  const queryClient = useQueryClient();
  const { cartToken, addItem, setLoading, setError } = useCartStore.getState();
  const showToast = useUIStore((state) => state.showToast);
  const toggleCartDrawer = useUIStore((state) => state.toggleCartDrawer);

  return useMutation({
    mutationFn: async (request: AddToCartRequest) => {
      return cartApi.addToCart(request, cartToken || undefined);
    },

    onMutate: async (request) => {
      setLoading(true);

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: cartKeys.all });

      // Snapshot previous cart
      const previousCart = queryClient.getQueryData<Cart>(
        cartKeys.detail(cartToken || '')
      );

      // Optimistically update the store
      addItem({
        variantId: request.variantId,
        productId: request.productId,
        title: request.title,
        variantTitle: request.variantTitle,
        price: request.price,
        quantity: request.quantity,
        image: request.image,
        maxQuantity: request.maxQuantity,
      });

      return { previousCart };
    },

    onSuccess: () => {
      setLoading(false);
      showToast({
        type: 'success',
        message: 'Added to cart',
        duration: 2000,
      });
      // Optionally open cart drawer
      toggleCartDrawer();
    },

    onError: (error, _variables, context) => {
      setLoading(false);
      setError(error instanceof Error ? error.message : 'Failed to add to cart');

      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(
          cartKeys.detail(cartToken || ''),
          context.previousCart
        );
      }

      showToast({
        type: 'error',
        message: 'Failed to add to cart',
        duration: 3000,
      });
    },

    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

/**
 * Hook to update cart item quantity
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const { cartToken, updateQuantity, setLoading, setError } =
    useCartStore.getState();

  return useMutation({
    mutationFn: async ({
      lineItemId,
      quantity,
    }: {
      lineItemId: string;
      quantity: number;
    }) => {
      return cartApi.updateCartItem(lineItemId, quantity, cartToken || undefined);
    },

    onMutate: async ({ lineItemId, quantity }) => {
      setLoading(true);

      await queryClient.cancelQueries({ queryKey: cartKeys.all });

      const previousCart = queryClient.getQueryData<Cart>(
        cartKeys.detail(cartToken || '')
      );

      // Optimistically update
      updateQuantity(lineItemId, quantity);

      return { previousCart };
    },

    onSuccess: () => {
      setLoading(false);
    },

    onError: (error, _variables, context) => {
      setLoading(false);
      setError(
        error instanceof Error ? error.message : 'Failed to update cart item'
      );

      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(
          cartKeys.detail(cartToken || ''),
          context.previousCart
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

/**
 * Hook to remove item from cart
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const { cartToken, removeItem, setLoading, setError } = useCartStore.getState();
  const showToast = useUIStore((state) => state.showToast);

  return useMutation({
    mutationFn: async (lineItemId: string) => {
      return cartApi.removeFromCart(lineItemId, cartToken || undefined);
    },

    onMutate: async (lineItemId) => {
      setLoading(true);

      await queryClient.cancelQueries({ queryKey: cartKeys.all });

      const previousCart = queryClient.getQueryData<Cart>(
        cartKeys.detail(cartToken || '')
      );

      // Optimistically remove
      removeItem(lineItemId);

      return { previousCart };
    },

    onSuccess: () => {
      setLoading(false);
      showToast({
        type: 'success',
        message: 'Item removed from cart',
        duration: 2000,
      });
    },

    onError: (error, _variables, context) => {
      setLoading(false);
      setError(
        error instanceof Error ? error.message : 'Failed to remove cart item'
      );

      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(
          cartKeys.detail(cartToken || ''),
          context.previousCart
        );
      }

      showToast({
        type: 'error',
        message: 'Failed to remove item',
        duration: 3000,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

/**
 * Hook to clear cart
 */
export function useClearCart() {
  const queryClient = useQueryClient();
  const { cartToken, clearCart, setLoading, setError } = useCartStore.getState();
  const showToast = useUIStore((state) => state.showToast);

  return useMutation({
    mutationFn: async () => {
      return cartApi.clearCart(cartToken || undefined);
    },

    onMutate: async () => {
      setLoading(true);

      await queryClient.cancelQueries({ queryKey: cartKeys.all });

      const previousCart = queryClient.getQueryData<Cart>(
        cartKeys.detail(cartToken || '')
      );

      // Optimistically clear
      clearCart();

      return { previousCart };
    },

    onSuccess: () => {
      setLoading(false);
      showToast({
        type: 'success',
        message: 'Cart cleared',
        duration: 2000,
      });
    },

    onError: (error, _variables, context) => {
      setLoading(false);
      setError(error instanceof Error ? error.message : 'Failed to clear cart');

      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(
          cartKeys.detail(cartToken || ''),
          context.previousCart
        );
      }

      showToast({
        type: 'error',
        message: 'Failed to clear cart',
        duration: 3000,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}
