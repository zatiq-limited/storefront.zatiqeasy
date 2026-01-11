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

      // Get variant image if available (check if any selected variant has an image)
      const variantImage = variants
        ? Object.values(variants).find((v) => v.image_url)?.image_url
        : undefined;

      // Properly set image_url with fallbacks: variant image > product image_url > first image from images array
      const imageUrl = variantImage || product.image_url || product.images?.[0] || "";

      const cartId = addProduct({
        ...product,
        image_url: imageUrl,
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