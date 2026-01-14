"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
import { useProductsStore, Product } from "@/stores/productsStore";
import { useShopStore } from "@/stores/shopStore";
import { convertStyleToCSS } from "@/lib/block-utils";
import type { BlockStyle } from "@/lib/block-utils";
import toast from "react-hot-toast";

const cartAnimateVariants = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "-100%" },
};

interface AddToCartButtonRendererProps {
  block: {
    class?: string;
    style?: BlockStyle;
    content?: string;
    bind_style?: Record<string, unknown>;
    [key: string]: unknown;
  };
  productId: string;
  productData?: Record<string, unknown>;
  data: Record<string, unknown>;
  context: Record<string, unknown>;
  onOpenVariantModal?: (product: Product) => void;
}

export function AddToCartButtonRenderer({
  block,
  productId,
  productData,
  data,
  context,
  onOpenVariantModal,
}: AddToCartButtonRendererProps) {
  const { getProductById } = useProductsStore();
  const {
    addProduct,
    removeProduct,
    getProductsByInventoryId,
    updateQuantity,
  } = useCartStore();
  const { shopDetails } = useShopStore();

  // Get full product from store or construct from productData
  const getFullProduct = (): Product | null => {
    let product = getProductById(productId);

    if (!product && productData) {
      product = {
        id: Number(productId),
        shop_id: shopDetails?.id || 0,
        name: (productData.name as string) || "",
        slug: productId,
        image_url: (productData.image as string) || "",
        images: productData.image ? [productData.image as string] : [],
        price: (productData.price as number) || 0,
        old_price: (productData.original_price as number) || null,
        quantity: 999,
        is_active: true,
        has_variant: false,
        categories: [],
        variant_types: [],
        stocks: [],
        is_stock_manage_by_variant: false,
        reviews: [],
      } as Product;
    }

    return product || null;
  };

  const product = getFullProduct();

  // Check cart
  const cartProducts = getProductsByInventoryId(Number(productId));
  const totalInCart = cartProducts.reduce((acc, p) => acc + (p.qty || 0), 0);

  // Check if product has variants
  const hasVariants =
    product?.has_variant &&
    product?.variant_types &&
    product.variant_types.length > 0;

  // Check stock
  const isStockMaintain = shopDetails?.isStockMaintain !== false;
  const isStockOut = isStockMaintain && (product?.quantity ?? 0) <= 0;

  // Build style from block
  const style = convertStyleToCSS(block.style, data, context, block.bind_style);

  // Get button text
  const buttonText = block.content || "Add to cart";

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product) {
      toast.error("Product not found");
      return;
    }

    if (isStockOut) return;

    // If has variants, open modal
    if (hasVariants && onOpenVariantModal) {
      onOpenVariantModal(product);
      return;
    }

    // Add to cart directly
    const cartProduct = {
      id: Number(product.id),
      shop_id: product.shop_id || 0,
      name: product.name,
      handle: product.slug,
      image_url: product.image_url || product.images?.[0] || "",
      images: product.images || [],
      price: product.price,
      quantity: product.quantity || 999,
      old_price: product.old_price || 0,
      is_active: product.is_active ?? true,
      has_variant: false,
      categories: product.categories || [],
      variant_types: [],
      stocks: [],
      is_stock_manage_by_variant: false,
      reviews: [],
      total_inventory_sold: 0,
      description: product.description,
      short_description: product.short_description,
      video_link: product.video_link,
      qty: 1,
      selectedVariants: {},
    };

    addProduct(cartProduct as Parameters<typeof addProduct>[0]);
    toast.success("Added to cart!");
  };

  // Handle increment
  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product) return;
    if (isStockOut) return;

    // If has variants, open modal
    if (hasVariants && onOpenVariantModal) {
      onOpenVariantModal(product);
      return;
    }

    if (cartProducts.length > 0) {
      const cartItem = cartProducts[0];
      updateQuantity(cartItem.cartId, cartItem.qty + 1);
    }
  };

  // Handle decrement
  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product) return;

    // If has variants, open modal
    if (hasVariants && onOpenVariantModal) {
      onOpenVariantModal(product);
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

  // Get text color from style
  const textColor = style.color || "#FFFFFF";

  return (
    <div
      className={block.class || "w-full h-11"}
      style={{ overflow: "hidden" }}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={totalInCart > 0 ? "quantity" : "add"}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
          variants={cartAnimateVariants}
          className="flex items-center justify-center h-full w-full"
          style={{
            ...style,
            borderRadius: style.borderRadius || "24px",
          }}
        >
          {totalInCart > 0 ? (
            // Quantity Controls
            <div className="flex items-center justify-center gap-4 w-full px-3">
              <button
                onClick={handleDecrement}
                className="p-1.5 rounded-full transition-colors hover:opacity-80"
                style={{ color: textColor }}
                aria-label="Decrease quantity"
              >
                <Minus size={18} />
              </button>

              <span
                className="text-sm font-semibold min-w-6 text-center"
                style={{ color: textColor }}
              >
                {totalInCart}
              </span>

              <button
                onClick={handleIncrement}
                className={`p-1.5 rounded-full transition-colors hover:opacity-80 ${
                  isStockOut ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={{ color: textColor }}
                aria-label="Increase quantity"
                disabled={isStockOut}
              >
                <Plus size={18} />
              </button>
            </div>
          ) : (
            // Add to Cart Button
            <button
              onClick={handleAddToCart}
              disabled={isStockOut}
              className="w-full h-full text-sm font-medium cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: textColor }}
            >
              {isStockOut ? "Out of Stock" : buttonText}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default AddToCartButtonRenderer;
