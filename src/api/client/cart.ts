/**
 * Client-side cart API functions
 */
'use client';

import { fetchClient } from '../shared';
import type { Cart, AddToCartRequest } from '../types';

/**
 * Cart Token Management (localStorage)
 */
export function getCartToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('cart_token') || '';
}

export function setCartToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cart_token', token);
}

export function clearCartToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('cart_token');
}

/**
 * Get cart
 */
export async function getCart(cartToken?: string): Promise<Cart | null> {
  try {
    const token = cartToken || getCartToken();
    if (!token) {
      return await createCart();
    }

    const cart = await fetchClient<Cart>('/api/storefront/v1/cart', {
      headers: { 'X-Cart-Token': token },
    });
    console.log('[API] Cart loaded from API');
    return cart;
  } catch {
    console.error('[API] Cart API failed');
    return null;
  }
}

/**
 * Create new cart
 */
export async function createCart(): Promise<Cart | null> {
  try {
    const cart = await fetchClient<Cart>('/api/storefront/v1/cart', {
      method: 'POST',
    });

    if (cart.token) {
      setCartToken(cart.token);
    }

    console.log('[API] Cart created');
    return cart;
  } catch {
    console.error('[API] Failed to create cart');
    return null;
  }
}

/**
 * Add item to cart
 */
export async function addToCart(
  request: AddToCartRequest,
  cartToken?: string
): Promise<Cart> {
  const token = cartToken || getCartToken();

  const result = await fetchClient<Cart>('/api/storefront/v1/cart/add', {
    method: 'POST',
    headers: { 'X-Cart-Token': token },
    body: JSON.stringify({
      variantId: request.variantId,
      quantity: request.quantity,
    }),
  });

  console.log(`[API] Added to cart: ${request.variantId}`);
  return result;
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(
  lineItemId: string,
  quantity: number,
  cartToken?: string
): Promise<Cart> {
  const token = cartToken || getCartToken();

  const result = await fetchClient<Cart>('/api/storefront/v1/cart/update', {
    method: 'PUT',
    headers: { 'X-Cart-Token': token },
    body: JSON.stringify({ lineItemId, quantity }),
  });

  console.log(`[API] Cart item updated: ${lineItemId}`);
  return result;
}

/**
 * Remove item from cart
 */
export async function removeFromCart(
  lineItemId: string,
  cartToken?: string
): Promise<Cart> {
  const token = cartToken || getCartToken();

  const result = await fetchClient<Cart>('/api/storefront/v1/cart/remove', {
    method: 'DELETE',
    headers: { 'X-Cart-Token': token },
    body: JSON.stringify({ lineItemId }),
  });

  console.log(`[API] Cart item removed: ${lineItemId}`);
  return result;
}

/**
 * Clear entire cart
 */
export async function clearCart(cartToken?: string): Promise<Cart | null> {
  const token = cartToken || getCartToken();

  try {
    const result = await fetchClient<Cart>('/api/storefront/v1/cart/clear', {
      method: 'DELETE',
      headers: { 'X-Cart-Token': token },
    });

    console.log('[API] Cart cleared');
    return result;
  } catch {
    console.error('[API] Failed to clear cart');
    return null;
  }
}
