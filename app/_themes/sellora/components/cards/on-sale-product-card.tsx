"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore } from "@/stores/cartStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { getInventoryThumbImageUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product } from "@/stores/productsStore";

const productCartAnimateVariants = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "-100%" },
};

interface OnSaleProductCardProps {
  product: Product;
  onNavigate?: () => void;
  onSelectProduct?: () => void;
}

export function OnSaleProductCard({
  product,
  onNavigate,
  onSelectProduct,
}: OnSaleProductCardProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const { addProduct, removeProduct, getProductsByInventoryId, updateQuantity } = useCartStore();

  const baseUrl = shopDetails?.baseUrl || "";
  const currency = shopDetails?.country_currency || "BDT";
  const enableBuyNow = (shopDetails?.shop_theme as { enable_buy_now_on_product_card?: boolean } | undefined)?.enable_buy_now_on_product_card ?? false;

  const {
    id,
    name,
    price = 0,
    old_price,
    image_url,
    images = [],
    variant_types = [],
  } = product;

  // Check if stock maintenance is enabled (default to true if undefined)
  const isStockMaintain = shopDetails?.isStockMaintain !== false;
  // Check if out of stock - only if stock maintenance is enabled
  const isStockOut = isStockMaintain && (product.quantity ?? 0) <= 0;
  const hasVariants = variant_types && variant_types.length > 0;

  // Check cart
  const cartProducts = getProductsByInventoryId(Number(id));
  const totalInCart = cartProducts.reduce((acc, p) => acc + (p.qty || 0), 0);

  // Get display image
  const displayImage = images && images.length > 0 ? images[0] : image_url;

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isStockOut) return;

    if (hasVariants && onSelectProduct) {
      onSelectProduct();
      return;
    }

    const productRecord = product as unknown as Record<string, unknown>;
    addProduct({
      ...product,
      id: Number(id),
      image_url: displayImage,
      qty: 1,
      selectedVariants: {},
      total_inventory_sold: (productRecord.total_inventory_sold as number) ?? 0,
      categories: product.categories ?? [],
      variant_types: product.variant_types ?? [],
      stocks: product.stocks ?? [],
      reviews: (productRecord.reviews as Array<unknown>) ?? [],
    } as Parameters<typeof addProduct>[0]);
  };

  // Handle increment
  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isStockOut) return;

    if (hasVariants && onSelectProduct) {
      onSelectProduct();
      return;
    }

    if (cartProducts.length > 0) {
      const cartItem = cartProducts[0];
      updateQuantity(cartItem.cartId, cartItem.qty + 1);
    }
  };

  // Handle decrement
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (hasVariants && onSelectProduct) {
      onSelectProduct();
      return;
    }

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
    if (isStockOut) return;

    if (hasVariants && onSelectProduct) {
      onSelectProduct();
      return;
    }

    if (totalInCart < 1) {
      handleAddToCart(e);
    }
    router.push(`${baseUrl}/checkout`);
  };

  // Handle navigate
  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate();
    } else {
      router.push(`${baseUrl}/products/${id}`);
    }
  };

  return (
    <div className="group">
      <div role="button" onClick={handleNavigate} className="cursor-pointer">
        {/* Image Container - Square-ish aspect ratio with rounded corners */}
        <div className="relative w-full aspect-[1/1.1] overflow-hidden rounded-xl">
          <FallbackImage
            src={getInventoryThumbImageUrl(displayImage || "")}
            fill
            alt={name}
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />

          {/* Out of Stock Overlay */}
          {isStockOut && (
            <div className="absolute w-full py-2 top-1/2 -translate-y-1/2 text-sm text-center bg-black/60 text-white backdrop-blur-sm z-20">
              {t("out_of_stock")}
            </div>
          )}

          {/* Sale Badge */}
          <div className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 z-10">
            <div className="w-9 h-9 sm:w-11 sm:h-11 flex flex-col items-center justify-center bg-[#E97171] rounded-full text-white">
              <span className="text-xs font-normal">Sale</span>
            </div>
          </div>

          {/* Hover Buttons Overlay */}
          <div className="absolute inset-x-0 bottom-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 p-2 sm:p-4 flex flex-col gap-2">
            {/* Add to Cart Button */}
            <div className="w-full h-8 sm:h-11">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={totalInCart}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  variants={productCartAnimateVariants}
                  className={cn(
                    "flex items-center justify-center rounded-md h-full bg-white shadow-lg",
                    isStockOut && "bg-gray-200 text-gray-500"
                  )}
                >
                  {totalInCart > 0 ? (
                    // Quantity Controls
                    <div className="flex items-center justify-center gap-4 w-full px-1">
                      <button
                        onClick={handleDecrement}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} className="text-black" />
                      </button>

                      <span className="text-sm font-medium min-w-5 text-center text-black">
                        {totalInCart}
                      </span>

                      <button
                        onClick={handleIncrement}
                        className={cn(
                          "p-1 hover:bg-gray-100 rounded transition-colors",
                          isStockOut && "opacity-50 cursor-not-allowed"
                        )}
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} className="text-black" />
                      </button>
                    </div>
                  ) : (
                    // Add to Cart Button
                    <button
                      disabled={isStockOut}
                      onClick={handleAddToCart}
                      className="w-full h-full text-sm font-medium disabled:cursor-not-allowed cursor-pointer flex items-center justify-center text-black gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {isStockOut ? t("out_of_stock") : t("add_to_cart")}
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Buy Now Button */}
            {enableBuyNow && (
              <div className="w-full h-8 sm:h-11">
                <div
                  className={cn(
                    "flex items-center justify-center h-full rounded-md bg-blue-zatiq text-white shadow-lg",
                    isStockOut && "bg-gray-900 text-gray-500"
                  )}
                >
                  <button
                    disabled={isStockOut}
                    onClick={handleBuyNow}
                    className="w-full h-full text-sm font-medium disabled:cursor-not-allowed cursor-pointer flex items-center justify-center text-white gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {isStockOut ? t("out_of_stock") : t("buy_now")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Info - Centered */}
        <div className="text-center mt-3 sm:mt-6 mb-2 text-foreground text-sm font-normal leading-tight px-2">
          <p className="text-xl font-normal line-clamp-1">{name}</p>
        </div>

        {/* Price - Centered */}
        <div className="flex items-center justify-center mb-6 gap-2 px-2">
          <p className="text-foreground text-sm font-semibold">
            {currency} {price}
          </p>
          {old_price && old_price > price && (
            <p className="text-muted-foreground text-xs line-through">
              {currency} {old_price}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default OnSaleProductCard;
