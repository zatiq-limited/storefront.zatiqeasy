"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore } from "@/stores/cartStore";
import type { Product } from "@/stores/productsStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { cn } from "@/lib/utils";

// Animation variants for cart button - matches old project
const productCartAnimateVariants = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "-100%" },
};

interface PremiumProductCardProps {
  product: Product;
  onSelectProduct?: () => void;
  onNavigate?: () => void;
}

export function PremiumProductCard({
  product,
  onSelectProduct,
  onNavigate,
}: PremiumProductCardProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const {
    addProduct,
    removeProduct,
    getProductsByInventoryId,
    updateQuantity,
  } = useCartStore();

  const baseUrl = shopDetails?.baseUrl || "";
  const currency = shopDetails?.country_currency || "BDT";
  const showBuyNow =
    shopDetails?.shop_theme?.enable_buy_now_on_product_card ?? false;

  // Check if product is in cart
  const cartProducts = getProductsByInventoryId(Number(product.id));
  const isInCart = cartProducts.length > 0;
  const cartQuantity = cartProducts.reduce((acc, p) => acc + (p.qty || 0), 0);

  // Check stock status
  const isOutOfStock = product.quantity === 0;
  const hasVariant =
    product.has_variant && (product.variant_types?.length ?? 0) > 0;

  // Calculate discount percentage
  const discountPercent = useMemo(() => {
    if (product.old_price && product.old_price > product.price) {
      return Math.round(
        ((product.old_price - product.price) / product.old_price) * 100
      );
    }
    return 0;
  }, [product.price, product.old_price]);

  // Get product image
  const imageUrl = product.images?.[0] || product.image_url || "";

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isOutOfStock) return;

    // If has variants, open variant selector
    if (hasVariant) {
      onSelectProduct?.();
      return;
    }

    // Add to cart directly
    addProduct({
      ...product,
      id: Number(product.id),
      image_url: imageUrl,
      qty: 1,
      selectedVariants: {},
      total_inventory_sold: 0,
      categories: product.categories ?? [],
      variant_types: product.variant_types ?? [],
      stocks: product.stocks ?? [],
      reviews: [],
    } as unknown as Parameters<typeof addProduct>[0]);
  };

  // Handle increment
  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();

    // For variant products, open variant selector modal
    if (hasVariant) {
      onSelectProduct?.();
      return;
    }

    // For non-variant products, add one more
    addProduct({
      ...product,
      id: Number(product.id),
      image_url: imageUrl,
      qty: 1,
      selectedVariants: {},
      total_inventory_sold: 0,
      categories: product.categories ?? [],
      variant_types: product.variant_types ?? [],
      stocks: product.stocks ?? [],
      reviews: [],
    } as unknown as Parameters<typeof addProduct>[0]);
  };

  // Handle decrement
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();

    // For variant products, open variant selector modal
    if (hasVariant) {
      onSelectProduct?.();
      return;
    }

    // For non-variant products, remove one
    if (cartProducts.length > 0) {
      const cartItem = cartProducts[0];
      if (cartItem.qty > 1) {
        updateQuantity(cartItem.cartId, cartItem.qty - 1);
      } else {
        removeProduct(cartItem.cartId);
      }
    }
  };

  // Handle buy now
  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInCart) {
      handleAddToCart(e);
    }
    router.push(`${baseUrl}/checkout`);
  };

  // Handle card click
  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    } else {
      router.push(`${baseUrl}/products/${product.id}`);
    }
  };

  // Check if increment should be disabled (stock limit)
  const isIncrementDisabled =
    isOutOfStock || (!hasVariant && cartQuantity >= (product.quantity ?? 999));

  return (
    <div className="flex flex-col gap-4 mb-4">
      {/* Product Image - Clickable */}
      <div role="button" onClick={handleClick} className="cursor-pointer">
        <div className="relative w-full aspect-244/304">
          <FallbackImage
            src={imageUrl}
            alt={product.name}
            fill
            className="w-full aspect-244/304 object-cover rounded-lg md:rounded-none"
          />

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute w-full py-2 top-[50%] translate-y-[-50%] text-sm text-center bg-black-1.1/60 text-white backdrop-blur-xs">
              Out of Stock
            </div>
          )}

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-2 md:top-3.5 left-2 md:left-3.5">
              <span className="px-2.5 py-1.5 bg-[#E97171] rounded-full text-white text-xs">
                Save {discountPercent}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div>
        <div className="text-gray-700 dark:text-gray-200 text-base font-normal max-w-[95%] leading-[155%] mb-0 pb-0 h-12.5">
          <p className="line-clamp-2">{product.name}</p>
        </div>
        <div className="flex items-center gap-2 mt-3 lg:mt-2">
          <p className="text-gray-700 dark:text-gray-200 text-base font-bold leading-4.5">
            {currency} {product.price}
          </p>
          {product.old_price && product.old_price > product.price && (
            <p className="text-gray-400 dark:text-gray-500 text-sm font-normal leading-4.5 line-through">
              {currency} {product.old_price}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        {/* Add to Cart / Quantity Control - Animated */}
        <div className="w-full max-h-9.5 h-9.5 overflow-hidden bg-white dark:bg-transparent">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={cartQuantity}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              variants={productCartAnimateVariants}
              className={cn(
                "flex items-center justify-center h-full rounded-lg md:rounded-none",
                isOutOfStock
                  ? "bg-gray-200 border-none text-gray-500 dark:bg-gray-200 dark:border dark:border-gray-200"
                  : "border border-blue-zatiq text-blue-zatiq dark:bg-transparent dark:text-blue-zatiq dark:border-blue-zatiq"
              )}
            >
              {cartQuantity > 0 ? (
                // Quantity Controls
                <div className="flex items-center justify-center gap-4 w-full px-2">
                  {/* Decrement Button */}
                  <button
                    onClick={handleDecrement}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={18} />
                  </button>

                  {/* Quantity Display */}
                  <span className="text-base font-medium min-w-6 text-center">
                    {cartQuantity}
                  </span>

                  {/* Increment Button */}
                  <button
                    onClick={handleIncrement}
                    disabled={isIncrementDisabled}
                    className={cn(
                      "p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors",
                      isIncrementDisabled && "opacity-50 cursor-not-allowed"
                    )}
                    aria-label="Increase quantity"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              ) : (
                // Add to Cart Button
                <button
                  disabled={isOutOfStock}
                  className="w-full text-sm sm:text-base uppercase font-medium pt-1.25 disabled:cursor-not-allowed cursor-pointer"
                  onClick={handleAddToCart}
                >
                  {isOutOfStock ? t("out_of_stock") : t("add_to_cart")}
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Buy Now Button */}
        {showBuyNow && (
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={cn(
              "w-full py-2 text-sm uppercase font-medium rounded-lg md:rounded-none transition-colors",
              isOutOfStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-zatiq text-white hover:bg-blue-600"
            )}
          >
            {t("buy_now")}
          </button>
        )}
      </div>
    </div>
  );
}

export default PremiumProductCard;
