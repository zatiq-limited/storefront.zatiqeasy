"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore } from "@/stores/cartStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { getInventoryThumbImageUrl, cn } from "@/lib/utils";
import type { Product } from "@/stores/productsStore";

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
  const { addProduct, getProductsByInventoryId, incrementQty, decrementQty } =
    useCartStore();

  const countryCurrency = shopDetails?.country_currency || "BDT";
  const baseUrl = shopDetails?.baseUrl || "";
  const buyNowEnabled =
    showBuyNow ?? shopDetails?.shop_theme?.enable_buy_now_on_product_card ?? false;

  // Get cart products for this item
  const cartProducts = useMemo(
    () => getProductsByInventoryId(Number(id)),
    [getProductsByInventoryId, id]
  );
  const totalInCart = cartProducts.reduce((sum, p) => sum + p.qty, 0);
  // Check if stock is out (quantity is 0)
  const isStockOut = quantity === 0;

  // Calculate discount
  const hasDiscount = (old_price ?? 0) > (price ?? 0);
  const discountAmount = hasDiscount ? (old_price ?? 0) - (price ?? 0) : 0;

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
    if (variant_types?.length) {
      onSelectProduct?.();
      return;
    }

    // Cast product to any to allow flexible property override
    const productRecord = product as unknown as Record<string, unknown>;
    addProduct({
      ...product,
      id: Number(id),
      image_url: images?.[0] || image_url,
      qty: 1,
      selectedVariants: {},
      total_inventory_sold: (productRecord.total_inventory_sold as number) ?? 0,
      categories: product.categories ?? [],
      variant_types: product.variant_types ?? [],
      stocks: product.stocks ?? [],
      reviews: (productRecord.reviews as Array<unknown>) ?? [],
    } as Parameters<typeof addProduct>[0]);
  };

  // Buy now
  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (has_variant) {
      onSelectProduct?.();
      return;
    }

    if (totalInCart < 1) {
      // Cast product to any to allow flexible property override
      const productRecord = product as unknown as Record<string, unknown>;
      addProduct({
        ...product,
        id: Number(id),
        image_url: images?.[0] || image_url,
        qty: 1,
        selectedVariants: {},
        total_inventory_sold: (productRecord.total_inventory_sold as number) ?? 0,
        categories: product.categories ?? [],
        variant_types: product.variant_types ?? [],
        stocks: product.stocks ?? [],
        reviews: (productRecord.reviews as Array<unknown>) ?? [],
      } as Parameters<typeof addProduct>[0]);
    }

    router.push(`${baseUrl}/checkout`);
  };

  // Increment quantity
  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (variant_types?.length) {
      onSelectProduct?.();
      return;
    }
    if (cartProducts[0]) {
      incrementQty(cartProducts[0].cartId);
    }
  };

  // Decrement quantity
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (variant_types?.length) {
      onSelectProduct?.();
      return;
    }
    if (cartProducts[0]) {
      decrementQty(cartProducts[0].cartId);
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
          <p className="line-clamp-2 text-base font-medium capitalize">{name}</p>
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
                  <span className="text-base font-medium min-w-[24px] text-center">
                    {totalInCart}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={isStockOut}
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
