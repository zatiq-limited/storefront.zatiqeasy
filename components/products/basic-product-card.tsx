"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { VariantType } from "@/stores/productsStore";
import { useCartStore } from "@/stores";
import { useShopStore } from "@/stores/shopStore";
import type { VariantState } from "@/types/cart.types";
import { ShoppingCart, Zap } from "lucide-react";
import { cn, titleCase } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CartQtyControl } from "@/features/cart/shared/cart-qty-control";
import { LazyAnimation } from "@/components/shared/animations/lazy-animation";
import { ROUTES } from "@/lib/constants";

interface BasicProductCardProps {
  id: string | number;
  name: string;
  price: number;
  old_price?: number | null;
  image_url?: string;
  images?: string[];
  variant_types?: VariantType[];
  quantity?: number;
  has_variant?: boolean;
  onNavigate: () => void;
  onSelectProduct: () => void;
}

export function BasicProductCard({
  id,
  name,
  price,
  old_price,
  image_url,
  images,
  variant_types,
  quantity = 0,
  has_variant = false,
  onNavigate,
  onSelectProduct,
}: BasicProductCardProps) {
  const router = useRouter();
  const {
    addProduct,
    updateQuantity,
    removeProduct,
    getProductsByInventoryId,
  } = useCartStore();
  const { shopDetails } = useShopStore();

  // Get quantity in cart for this product
  const cartProducts = getProductsByInventoryId(Number(id));
  const quantityInCart = cartProducts.reduce((sum, p) => sum + p.qty, 0);
  const isStockOut = quantity <= 0;

  // Product image URL
  const productImage = images?.[0] || image_url || "/placeholder-product.svg";

  // Currency
  const currency =
    shopDetails?.country_currency === "BDT"
      ? "Tk"
      : shopDetails?.country_currency || "Tk";

  // Calculate discount
  const validOldPrice = old_price ?? undefined;
  const discount =
    validOldPrice && validOldPrice > price ? validOldPrice - price : 0;

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
    isStockOut || (typeof maxStock === "number" && quantityInCart >= maxStock);

  // Add to cart handler
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (has_variant || variant_types?.length) {
      onSelectProduct();
      return;
    }

    // Type assertion needed due to type differences between Product and InventoryProduct
    addProduct({
      id: Number(id),
      shop_id: 0,
      name,
      price,
      old_price: validOldPrice || price,
      quantity: quantity || 0,
      is_active: true,
      has_variant: has_variant || false,
      images: images || (image_url ? [image_url] : []),
      image_url: productImage,
      categories: [],
      variant_types: variant_types || [],
      stocks: [],
      is_stock_manage_by_variant: false,
      reviews: [],
      total_inventory_sold: 0,
      qty: 1,
      selectedVariants: {},
    } as Parameters<typeof addProduct>[0]);
  };

  // Buy now handler
  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (has_variant || variant_types?.length) {
      onSelectProduct();
      return;
    }

    // Type assertion needed due to type differences between Product and InventoryProduct
    addProduct({
      id: Number(id),
      shop_id: 0,
      name,
      price,
      old_price: validOldPrice || price,
      quantity: quantity || 0,
      is_active: true,
      has_variant: has_variant || false,
      images: images || (image_url ? [image_url] : []),
      image_url: productImage,
      categories: [],
      variant_types: variant_types || [],
      stocks: [],
      is_stock_manage_by_variant: false,
      reviews: [],
      total_inventory_sold: 0,
      qty: 1,
      selectedVariants: {},
    } as Parameters<typeof addProduct>[0]);

    router.push(ROUTES.CHECKOUT);
  };

  // Increment quantity handler
  const handleSumQty = () => {
    if (variant_types?.length) {
      onSelectProduct();
      return;
    }
    const cartProduct = cartProducts[0];
    if (cartProduct?.cartId) {
      updateQuantity(cartProduct.cartId, quantityInCart + 1);
    }
  };

  // Decrement quantity handler
  const handleSubQty = () => {
    if (variant_types?.length) {
      onSelectProduct();
      return;
    }
    const cartProduct = cartProducts[0];
    if (cartProduct?.cartId) {
      if (quantityInCart <= 1) {
        removeProduct(cartProduct.cartId);
      } else {
        updateQuantity(cartProduct.cartId, quantityInCart - 1);
      }
    }
  };

  // Direct quantity change handler
  const handleQtyChange = (value: number) => {
    const cartProduct = cartProducts[0];
    if (!cartProduct?.cartId) return;

    if (value <= 0) {
      removeProduct(cartProduct.cartId);
    } else {
      updateQuantity(cartProduct.cartId, value);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-100 hover:border-blue-zatiq dark:border-gray-700 overflow-hidden flex flex-col transition-all duration-200 hover:shadow-lg"
    >
      {/* Product Image */}
      <div
        role="button"
        tabIndex={0}
        onClick={onNavigate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onNavigate();
          }
        }}
        aria-label={`View ${name} details`}
        className="relative cursor-pointer"
      >
        <div className="relative w-full h-48 sm:h-52 overflow-hidden">
          <Image
            src={productImage}
            alt={name || "Product image"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover transition-transform duration-300 p-2 rounded-xl hover:shadow-sm dark:hover:shadow-gray-600",
              !isStockOut && "hover:scale-105"
            )}
          />

          {/* Discount Badge */}
          {!isStockOut && discount > 0 && (
            <div className="absolute bottom-3 right-2 md:top-3 md:right-3">
              <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
                Save {Number(discount.toFixed(2)).toLocaleString()} {currency}
              </span>
            </div>
          )}

          {/* Stock Out Overlay */}
          {isStockOut && (
            <div className="absolute inset-2 bg-gray-600/50 flex items-center justify-center rounded-md">
              <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div
        className={cn(
          "px-4 py-3 flex flex-col items-center justify-between",
          name && name.length <= 20 ? "gap-4" : "gap-1"
        )}
      >
        {/* Price */}
        <div className="flex items-center gap-2">
          {validOldPrice && validOldPrice > price && (
            <span className="text-red-500 text-sm line-through">
              {currency} {validOldPrice}
            </span>
          )}
          <span className="text-lg sm:text-xl font-bold text-black dark:text-gray-100">
            {currency} {price || "0.00"}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-center text-black dark:text-gray-100 font-normal text-lg line-clamp-2">
          {titleCase(name)}
        </h3>
      </div>

      {/* Cart Controls */}
      <div className="px-4 pb-4 flex flex-col gap-2 mt-auto">
        <LazyAnimation>
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={cartProducts.length}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {quantityInCart > 0 ? (
                <div className="flex flex-col gap-2">
                  <CartQtyControl
                    className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 flex items-center justify-between"
                    qty={quantityInCart}
                    maxStock={maxStock}
                    disableSumBtn={isCartIncrementDisabled}
                    sumQty={handleSumQty}
                    subQty={handleSubQty}
                    onQtyChange={handleQtyChange}
                  />
                  {shopDetails?.shop_theme?.enable_buy_now_on_product_card && (
                    <button
                      disabled={isStockOut}
                      className="w-full bg-blue-zatiq hover:bg-blue-zatiq/75 disabled:bg-gray-300 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      onClick={handleBuyNow}
                    >
                      <Zap size={16} />
                      {isStockOut ? "Out of Stock" : "Buy Now"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {/* Add to Cart Button */}
                  <button
                    disabled={isStockOut}
                    className="w-full bg-white border border-blue-zatiq hover:bg-blue-zatiq disabled:bg-gray-100 text-blue-zatiq hover:text-white disabled:text-gray-400 font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart size={16} />
                    {isStockOut ? "Out of Stock" : "Add to Cart"}
                  </button>

                  {/* Buy Now Button */}
                  {shopDetails?.shop_theme?.enable_buy_now_on_product_card && (
                    <button
                      disabled={isStockOut}
                      className="w-full bg-blue-zatiq hover:bg-green-600 disabled:bg-gray-300 text-white border hover:border-blue-zatiq font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      onClick={handleBuyNow}
                    >
                      <Zap size={16} />
                      {isStockOut ? "Out of Stock" : "Buy Now"}
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </LazyAnimation>
      </div>
    </motion.div>
  );
}
