"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore } from "@/stores/cartStore";
import type { Product } from "@/stores/productsStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { formatPrice } from "@/lib/utils/formatting";
import { cn } from "@/lib/utils";

interface LuxuraProductCardProps {
  product: Product;
  onSelectProduct?: () => void;
  onNavigate?: () => void;
}

export function LuxuraProductCard({
  product,
  onSelectProduct,
  onNavigate,
}: LuxuraProductCardProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const { addProduct, removeProduct, getProductsByInventoryId } = useCartStore();

  const [isHovered, setIsHovered] = useState(false);

  const baseUrl = shopDetails?.baseUrl || "";
  const currency = shopDetails?.country_currency || "BDT";
  const showBuyNow = shopDetails?.shop_theme?.enable_buy_now_on_product_card ?? false;

  // Check if product is in cart
  const cartProducts = getProductsByInventoryId(Number(product.id));
  const isInCart = cartProducts.length > 0;
  const cartQuantity = cartProducts.reduce((acc, p) => acc + (p.quantity || 0), 0);

  // Check stock status
  const isOutOfStock = product.quantity === 0;

  // Calculate discount percentage
  const discountPercent = useMemo(() => {
    if (product.old_price && product.old_price > product.price) {
      return Math.round(((product.old_price - product.price) / product.old_price) * 100);
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
    if (product.has_variant && product.variant_types?.length) {
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

  // Handle quantity change
  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartProducts.length > 0) {
      removeProduct(cartProducts[0].cartId);
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

  return (
    <motion.div
      className="group relative bg-white dark:bg-black-27 rounded-lg lg:rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Image Container - Luxura uses 420:360 aspect ratio */}
      <div className="relative aspect-[420/360] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <FallbackImage
          src={imageUrl}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-transform duration-500",
            isHovered && "scale-105"
          )}
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {t("save")} {discountPercent}%
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white text-sm font-medium px-3 py-1 rounded">
              {t("out_of_stock")}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        {/* Product Name */}
        <h3 className="text-sm md:text-base font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400">
            {formatPrice(product.price, currency)}
          </span>
          {product.old_price && product.old_price > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.old_price, currency)}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <AnimatePresence mode="wait">
          {isInCart && !product.has_variant ? (
            <motion.div
              key="quantity"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              className="flex items-center justify-between gap-2"
            >
              {/* Quantity Controls */}
              <div className="flex items-center gap-2 flex-1">
                <button
                  onClick={handleDecrement}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="min-w-[24px] text-center font-medium">
                  {cartQuantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Buy Now */}
              {showBuyNow && (
                <button
                  onClick={handleBuyNow}
                  className="px-3 py-2 bg-blue-zatiq text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {t("buy_now")}
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="add"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              className="flex items-center gap-2"
            >
              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-sm transition-colors",
                  isOutOfStock
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-zatiq text-white hover:bg-blue-600"
                )}
              >
                <ShoppingCart size={16} />
                {t("add_to_cart")}
              </button>

              {/* Buy Now */}
              {showBuyNow && !isOutOfStock && (
                <button
                  onClick={handleBuyNow}
                  className="px-3 py-2 border border-blue-zatiq text-blue-zatiq text-sm font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  {t("buy_now")}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default LuxuraProductCard;
