import type { InventoryProduct } from './inventory.types';

// Cart Product extends Inventory with cart-specific fields
export interface CartProduct extends InventoryProduct {
  qty: number;
  cartId: string;
  selectedVariants: VariantsState;
  // Calculated price including variant additions
  calculatedPrice?: number;
}

// Single variant selection state
export interface VariantState {
  variant_type_id: number;
  variant_id: number;
  price: number;
  variant_name: string;
  variant_type_name?: string;
  image_url?: string;
}

// Map of variant type ID to variant state
export type VariantsState = Record<number | string, VariantState>;

// Cart state for Zustand store
export interface CartState {
  products: Record<string, CartProduct>;
  cartExpiry: string | null;
  orderStatus: OrderStatus | undefined;
  isLoading: boolean;
  trackLink: string | null;
}

export type OrderStatus = 'success' | 'error' | 'pending';

// Cart actions
export interface CartActions {
  addProduct: (product: CartProduct) => void;
  removeProduct: (cartId: string) => void;
  updateQuantity: (cartId: string, qty: number) => void;
  incrementQty: (cartId: string) => void;
  decrementQty: (cartId: string) => void;
  updateVariants: (cartId: string, variants: VariantsState) => void;
  resetCart: () => void;
  setOrderStatus: (status: OrderStatus | undefined) => void;
  setIsLoading: (loading: boolean) => void;
  setTrackLink: (link: string | null) => void;
}

// Cart summary calculations
export interface CartSummary {
  totalItems: number;
  subtotal: number;
  products: CartProduct[];
}

// Add to cart payload
export interface AddToCartPayload {
  product: InventoryProduct;
  quantity: number;
  selectedVariants?: VariantsState;
}
