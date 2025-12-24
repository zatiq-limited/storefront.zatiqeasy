"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore } from "@/stores/cartStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { getInventoryThumbImageUrl, cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { Product } from "@/stores/productsStore";
import type { VariantState } from "@/types/cart.types";

interface AuroraProductCardProps {
  product: Product;
  onNavigate?: () => void;
  onSelectProduct?: () => void;
  isSale?: boolean;
  showBuyNow?: boolean;
}

const productCartAnimateVariants = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "-100%" },
};

export function AuroraProductCard({
  product,
  onNavigate,
  onSelectProduct,
  isSale = false,
  showBuyNow,
}: AuroraProductCardProps) {
  const router = useRouter();
  const { t } = useTranslation();

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

  // Zustand stores
  const { shopDetails } = useShopStore();
  const {
    addProduct,
    updateQuantity,
    removeProduct,
    getProductsByInventoryId,
  } = useCartStore();

  const countryCurrency = shopDetails?.country_currency || "BDT";
  const baseUrl = shopDetails?.baseUrl || "";
  const buyNowEnabled =
    showBuyNow ??
    shopDetails?.shop_theme?.enable_buy_now_on_product_card ??
    false;

  // Get cart products for this item (no useMemo - needs to recompute when cart updates)
  const cartProducts = getProductsByInventoryId(Number(id));
  const totalInCart = cartProducts.reduce((sum, p) => sum + p.qty, 0);

  // Check if stock is out (quantity is 0 or less)
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

    // Type assertion needed due to type differences
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

  // Buy now
  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (has_variant || variant_types?.length) {
      onSelectProduct?.();
      return;
    }

    // Type assertion needed due to type differences
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

    router.push(ROUTES.CHECKOUT);
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
    <div className="aurora-product-card">
      {/* Clickable Product Area */}
      <div role="button" onClick={handleNavigate} className="cursor-pointer">
        {/* Product Image */}
        <div className="relative w-full aspect-244/304">
          <FallbackImage
            src={getInventoryThumbImageUrl(images?.[0] || image_url || "")}
            fill
            alt={name || "Product"}
            priority={false}
            className="w-full aspect-244/304 object-cover rounded-lg md:rounded-none"
          />

          {/* Out of Stock Overlay */}
          {isStockOut && (
            <div className="absolute w-full py-2 top-1/2 -translate-y-1/2 text-sm text-center bg-black/60 text-white backdrop-blur-sm">
              Out of Stock
            </div>
          )}

          {/* Sale/Discount Badge */}
          {isSale ? (
            <div className="absolute top-2 md:top-3.5 left-2 md:left-3.5">
              <span className="px-3 py-1.5 bg-blue-zatiq rounded-full text-white text-xs">
                Sale
              </span>
            </div>
          ) : (
            hasDiscount && (
              <div className="absolute top-2 md:top-3.5 left-2 md:left-3.5">
                <span className="px-2.5 py-1.5 bg-blue-zatiq rounded-full text-white text-xs">
                  Save {discountAmount.toLocaleString()} {countryCurrency}
                </span>
              </div>
            )
          )}
        </div>

        {/* Product Info */}
        <div className="text-gray-700 dark:text-gray-200 text-base font-normal leading-4.5 max-w-[95%] h-12 mb-3 mt-6">
          <p className="line-clamp-2 text-base font-medium capitalize">
            {name}
          </p>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center mb-6">
          <p className="dark:text-blue-zatiq text-base font-medium leading-4.5">
            {countryCurrency} {price?.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Add to Cart / Qty Control */}
        <div className="w-full max-h-9.5 h-9.5 overflow-hidden">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={cartProducts.length}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              variants={productCartAnimateVariants}
              className={cn(
                "flex items-center justify-center h-full rounded-lg md:rounded-none border border-blue-zatiq text-blue-zatiq group",
                isStockOut && "bg-gray-200 border-none text-gray-500"
              )}
            >
              {totalInCart > 0 ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleDecrement}
                    className="w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-blue-zatiq/10 rounded"
                  >
                    -
                  </button>
                  <span className="text-base font-medium min-w-6 text-center">
                    {totalInCart}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={isCartIncrementDisabled}
                    className="w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-blue-zatiq/10 rounded disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  disabled={isStockOut}
                  className="w-full text-sm sm:text-base capitalize font-medium disabled:cursor-not-allowed cursor-pointer"
                  onClick={handleAddToCart}
                >
                  {isStockOut ? t("out_of_stock") : t("add_to_cart")}
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Buy Now Button */}
        {buyNowEnabled && (
          <div className="w-full max-h-9.5 h-9.5 overflow-hidden">
            <div
              className={cn(
                "flex items-center justify-center h-full rounded-lg md:rounded-none border border-blue-zatiq text-white dark:text-black-18 bg-blue-zatiq group font-semibold",
                isStockOut && "bg-gray-200 border-none text-gray-500"
              )}
            >
              <button
                disabled={isStockOut}
                className="w-full text-sm sm:text-base capitalize font-medium disabled:cursor-not-allowed disabled:text-gray-500 cursor-pointer"
                onClick={handleBuyNow}
              >
                {isStockOut ? t("out_of_stock") : t("buy_now")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuroraProductCard;
