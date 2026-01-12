"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore } from "@/stores/cartStore";
import type { Product } from "@/stores/productsStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { cn } from "@/lib/utils";

interface LuxuraProductCardProps {
  product: Product;
  onSelectProduct?: () => void;
  onNavigate?: () => void;
}

const productCartAnimateVariants = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "-100%" },
};

export function LuxuraProductCard({
  product,
  onSelectProduct,
  onNavigate,
}: LuxuraProductCardProps) {
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
  const totalInCart = cartProducts.reduce((acc, p) => acc + (p.qty || 0), 0);

  // Check if stock maintenance is enabled (default to true if undefined)
  const isStockMaintain = shopDetails?.isStockMaintain !== false;
  // Check stock status - only if stock maintenance is enabled
  const isOutOfStock = isStockMaintain && (product.quantity ?? 0) <= 0;

  // Calculate max stock for cart
  const getMaxStock = () => {
    if (cartProducts.length > 0) {
      const cartItem = cartProducts[0];
      if (cartItem.is_stock_manage_by_variant && cartItem.stocks?.length > 0) {
        const selectedVariantIds = Object.values(
          cartItem.selectedVariants || {}
        )
          .filter((v) => v)
          .map((v: unknown) => (v as { variant_id: string }).variant_id);

        if (selectedVariantIds.length > 0) {
          const matchingStock = cartItem.stocks.find((stock) =>
            selectedVariantIds.every((variantId) =>
              stock.combination.includes(`${variantId}`)
            )
          );
          return matchingStock?.quantity ?? cartItem.quantity;
        }
      }
      return cartItem.quantity;
    }
    return product.quantity;
  };

  const maxStock = getMaxStock();
  // Only check stock limits if stock maintenance is enabled
  const isCartIncrementDisabled =
    isStockMaintain && typeof maxStock === "number" && totalInCart >= maxStock;

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
    if (product.has_variant && product.variant_types?.length) {
      onSelectProduct?.();
      return;
    }
    if (cartProducts.length > 0) {
      const cartItem = cartProducts[0];
      updateQuantity(cartItem.cartId, cartItem.qty + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.has_variant && product.variant_types?.length) {
      onSelectProduct?.();
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
    e.preventDefault();
    e.stopPropagation();

    if (product.has_variant && product.variant_types?.length) {
      onSelectProduct?.();
      return;
    }

    if (totalInCart < 1) {
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
    <div key={product.id}>
      <div>
        {/* Image Container */}
        <div
          role="button"
          onClick={handleClick}
          className="relative w-full aspect-420/360 rounded-xl cursor-pointer"
        >
          <FallbackImage
            src={imageUrl}
            fill
            alt={product.name}
            className="w-full aspect-420/360 object-cover rounded-lg md:rounded-xl"
          />

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute w-full py-2 top-1/2 -translate-y-1/2 text-sm text-center bg-black/60 text-white backdrop-blur-sm">
              {t("out_of_stock")}
            </div>
          )}
        </div>

        {/* Blue Bottom Section - Overlaps image */}
        <div className="rounded-xl bg-blue-zatiq text-white px-3 py-3 md:px-3 md:py-4 -translate-y-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between">
            {/* Product Info */}
            <div
              role="button"
              onClick={handleClick}
              className="flex-1 flex flex-col justify-center gap-2 cursor-pointer"
            >
              <p className="line-clamp-2 h-9.5 lg:h-11.25 text-sm lg:text-base font-medium capitalize">
                {product.name}
              </p>
              <div>
                <p className="text-sm lg:text-base font-medium leading-4.5">
                  {currency} {product.price}
                </p>
                <div className="flex gap-2 text-3 items-center mt-1 h-6">
                  {(product.old_price ?? 0) > (product.price ?? 0) && (
                    <>
                      <p className="line-through text-gray-400 dark:text-gray-300">
                        {currency} {product.old_price}
                      </p>
                      <span className="text-gray-200 font-bold">
                        -
                        {Math.round(
                          ((product.old_price! - product.price) /
                            product.old_price!) *
                            100
                        )}
                        %
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 xl:gap-2.5 mt-2 lg:mt-0">
              {/* Add to Cart / Quantity Controls */}
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
                      "flex items-center justify-center h-full rounded-lg md:rounded-xl px-4 bg-white text-gray-800 font-bold group",
                      isOutOfStock && "border-none text-gray-500"
                    )}
                  >
                    {totalInCart > 0 ? (
                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleDecrement}
                          className="text-lg font-bold cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="min-w-6 text-center font-medium">
                          {totalInCart}
                        </span>
                        <button
                          onClick={handleIncrement}
                          disabled={isOutOfStock || isCartIncrementDisabled}
                          className="text-lg font-bold cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        disabled={isOutOfStock}
                        className="w-full text-sm sm:text-base capitalize font-medium cursor-pointer disabled:cursor-not-allowed disabled:text-gray-500"
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
                <div className="w-full max-h-9.5 h-9.5">
                  <div
                    className={cn(
                      "flex items-center justify-center h-full rounded-lg md:rounded-xl border border-white text-white font-semibold",
                      isOutOfStock && "bg-gray-200 border-none text-gray-500"
                    )}
                  >
                    <button
                      disabled={isOutOfStock}
                      className="w-full text-sm sm:text-base capitalize font-medium disabled:cursor-not-allowed disabled:text-gray-500 dark:text-white dark:disabled:text-gray-500 cursor-pointer"
                      onClick={handleBuyNow}
                    >
                      {isOutOfStock ? t("out_of_stock") : t("buy_now")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LuxuraProductCard;
