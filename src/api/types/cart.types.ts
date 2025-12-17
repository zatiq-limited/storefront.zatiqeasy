/**
 * Cart-related type definitions
 */

export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  title: string;
  variantTitle: string;
  price: number;
  quantity: number;
  image: string;
  maxQuantity: number;
}

export interface Cart {
  id: string;
  token: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  itemCount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  variantId: string;
  productId: string;
  title: string;
  variantTitle: string;
  price: number;
  quantity: number;
  image: string;
  maxQuantity: number;
}

export interface UpdateCartItemRequest {
  lineItemId: string;
  quantity: number;
}

export interface RemoveFromCartRequest {
  lineItemId: string;
}

export interface CartResponse {
  success: boolean;
  data: Cart;
  message?: string;
}
