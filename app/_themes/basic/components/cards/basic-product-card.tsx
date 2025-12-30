"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore } from "@/stores/cartStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { getInventoryThumbImageUrl } from "@/lib/utils";
import type { Product } from "@/stores/productsStore";
import type { VariantState } from "@/types/cart.types";

interface BasicProductCardProps {
  product: Product;
  onNavigate?: () => void;
  onSelectProduct?: () => void;
}

export function BasicProductCard({
  product,
  onNavigate,
  onSelectProduct,
}: BasicProductCardProps) {
  const router = useRouter();

  const {
    id,
    name,
    price,
    old_price,
    image_url,
    images,
    variant_types,
    quantity,
    has_variant,
  } = product;

  const { shopDetails } = useShopStore();
  const {
    addProduct,
    updateQuantity,
    removeProduct,
    getProductsByInventoryId,
  } = useCartStore();

  const countryCurrency = shopDetails?.country_currency || "BDT";
  const baseUrl = shopDetails?.baseUrl || "";

  // Get cart products for this item
  const cartProducts = getProductsByInventoryId(Number(id));
  const totalInCart = cartProducts.reduce((sum, p) => sum + p.qty, 0);

  // Check if stock is out
  const isStockOut = (quantity ?? 0) <= 0;

  // Calculate discount
  const hasDiscount = (old_price ?? 0) > (price ?? 0);
  const discountAmount = hasDiscount ? (old_price ?? 0) - (price ?? 0) : 0;

  // Calculate max stock for cart item
  const getMaxStock = () => {
    const currentCartItem = cartProducts[0];
    if (!currentCartItem) return quantity;

    if (
      currentCartItem.is_stock_manage_by_variant &&
      currentCartItem.stocks?.length > 0
    ) {
      const selectedVariantIds = Object.values(
        currentCartItem.selectedVariants || {}
      )
        .filter((v): v is VariantState => Boolean(v))
        .map((v) => v.variant_id);

      if (selectedVariantIds.length > 0) {
        const matchingStock = currentCartItem.stocks.find((stock) =>
          selectedVariantIds.every((variantId: number) =>
            stock.combination.includes(`${variantId}`)
          )
        );
        return matchingStock?.quantity ?? currentCartItem.quantity;
      }
    }
    return currentCartItem.quantity ?? quantity;
  };

  const maxStock = getMaxStock();
  const isCartIncrementDisabled =
    isStockOut || (typeof maxStock === "number" && totalInCart >= maxStock);

  // Navigate to product detail
  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate();
    } else {
      router.push(`${baseUrl}/products/${id}`);
    }
  };

  // Add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (has_variant || variant_types?.length) {
      onSelectProduct?.();
      return;
    }

    const productRecord = product as unknown as Record<string, unknown>;
    addProduct({
      id: Number(id),
      shop_id: 0,
      name,
      price: price ?? 0,
      old_price: old_price || price,
      quantity: quantity || 0,
      is_active: true,
      has_variant: has_variant || false,
      images: images || (image_url ? [image_url] : []),
      image_url: images?.[0] || image_url || "",
      categories: [],
      variant_types: variant_types || [],
      stocks: [],
      is_stock_manage_by_variant: false,
      reviews: [],
      total_inventory_sold: (productRecord.total_inventory_sold as number) ?? 0,
      qty: 1,
      selectedVariants: {},
    } as Parameters<typeof addProduct>[0]);
  };

  // Increment quantity
  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (variant_types?.length) {
      onSelectProduct?.();
      return;
    }
    const cartProduct = cartProducts[0];
    if (cartProduct?.cartId) {
      updateQuantity(cartProduct.cartId, totalInCart + 1);
    }
  };

  // Decrement quantity
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (variant_types?.length) {
      onSelectProduct?.();
      return;
    }
    const cartProduct = cartProducts[0];
    if (cartProduct?.cartId) {
      if (totalInCart <= 1) {
        removeProduct(cartProduct.cartId);
      } else {
        updateQuantity(cartProduct.cartId, totalInCart - 1);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
      {/* Clickable Product Area */}
      <div role="button" onClick={handleNavigate} className="cursor-pointer">
        {/* Product Image */}
        <div className="relative w-full aspect-square bg-gray-100">
          <FallbackImage
            src={getInventoryThumbImageUrl(images?.[0] || image_url || "")}
            fill
            alt={name || "Product"}
            priority={false}
            className="w-full aspect-square object-cover"
          />

          {/* Out of Stock Overlay */}
          {isStockOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="px-4 py-2 bg-white text-gray-800 rounded font-medium">
                Out of Stock
              </span>
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">
                Save {discountAmount.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-gray-900 font-medium line-clamp-2 mb-2 min-h-[2.5rem]">
            {name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">
              {countryCurrency} {price?.toLocaleString()}
            </span>
            {old_price && old_price > price && (
              <span className="text-sm text-gray-500 line-through">
                {countryCurrency} {old_price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart / Qty Control */}
      <div className="px-4 pb-4">
        {totalInCart > 0 ? (
          <div className="flex items-center justify-center border border-gray-300 rounded-lg">
            <button
              onClick={handleDecrement}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
            >
              -
            </button>
            <span className="px-4 py-2 font-medium">{totalInCart}</span>
            <button
              onClick={handleIncrement}
              disabled={isCartIncrementDisabled}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg disabled:opacity-50"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={isStockOut}
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isStockOut ? "Out of Stock" : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}

export default BasicProductCard;
