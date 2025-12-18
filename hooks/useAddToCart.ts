"use client";

import { useCartStore } from "@/stores";
import type { InventoryProduct, VariantsState } from "@/types";

interface UseAddToCartOptions {
  onSuccess?: (cartId: string) => void;
  onError?: (error: Error) => void;
  openCart?: boolean;
}

export const useAddToCart = (options?: UseAddToCartOptions) => {
  const { addProduct } = useCartStore();

  const addToCart = (
    product: InventoryProduct,
    quantity: number = 1,
    variants?: VariantsState
  ) => {
    try {
      // Calculate the final price based on variants
      let finalPrice = product.price;
      if (variants) {
        const variantPrices = Object.values(variants);
        finalPrice = variantPrices.reduce((total, variant) => total + variant.price, product.price);
      }

      const cartId = addProduct({
        ...product,
        qty: quantity,
        selectedVariants: variants || {},
        price: finalPrice,
      });

      options?.onSuccess?.(cartId);

      if (options?.openCart) {
        // Open cart sidebar or modal based on implementation
        document.dispatchEvent(new CustomEvent('open-cart'));
      }

      return cartId;
    } catch (error) {
      options?.onError?.(error as Error);
      throw error;
    }
  };

  return {
    addToCart,
  };
};