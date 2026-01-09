"use client";

import { useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { getInventoryThumbImageUrl } from "@/lib/utils/formatting";
import { getProductCardComponent } from "../product-cards";
import { useCartStore } from "@/stores/cartStore";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import type { ProductsGridProps } from "./types";
import type { Product } from "@/stores/productsStore";

const GRID_COLUMNS_MAP: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

export default function ProductsGrid({
  products,
  cardType,
  columns,
  gap,
  buttonBgColor,
  buttonTextColor,
}: ProductsGridProps) {
  const addProduct = useCartStore((state) => state.addProduct);
  const getProductsByInventoryId = useCartStore((state) => state.getProductsByInventoryId);
  const incrementQty = useCartStore((state) => state.incrementQty);

  // State for variant selector modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const gridClass = useMemo(() => {
    const lgCols = GRID_COLUMNS_MAP[columns] || "grid-cols-4";
    return `grid grid-cols-1 sm:grid-cols-2 lg:${lgCols}`;
  }, [columns]);

  const ProductCard = getProductCardComponent(cardType);

  // Check if product has variants
  const hasVariants = useCallback((product: Product): boolean => {
    return !!(product.variant_types && product.variant_types.length > 0);
  }, []);

  // Check if product is out of stock
  const isProductOutOfStock = useCallback((product: Product): boolean => {
    // If stock is managed by variant, check stocks array
    if (product.is_stock_manage_by_variant || hasVariants(product)) {
      // Out of stock if stocks array is empty or all variants have 0 quantity
      if (!product.stocks || product.stocks.length === 0) {
        return true;
      }
      return product.stocks.every((stock) => (stock.quantity ?? 0) <= 0);
    }

    // For non-variant products, check the quantity field
    // Out of stock if quantity is null, undefined, or <= 0
    if (product.quantity === null || product.quantity === undefined) {
      return true;
    }
    return product.quantity <= 0;
  }, [hasVariants]);

  // Handle add to cart
  const handleAddToCart = useCallback(
    (product: Product) => {
      // If product has variants, open the variant selector modal
      if (hasVariants(product)) {
        setSelectedProduct(product);
        return;
      }

      // Convert product ID to number if it's a string
      const productId =
        typeof product.id === "string" ? parseInt(product.id, 10) : product.id;

      // Check if product already exists in cart (without variants)
      const existingProducts = getProductsByInventoryId(productId);
      const existingProductWithoutVariants = existingProducts.find(
        (p) => !p.selectedVariants || Object.keys(p.selectedVariants).length === 0
      );

      if (existingProductWithoutVariants) {
        // Product exists, increment quantity
        incrementQty(existingProductWithoutVariants.cartId);
        toast.success(`${product.name} quantity updated!`, {
          duration: 2000,
          position: "bottom-right",
        });
      } else {
        // Product doesn't exist, add new
        const productImage = getInventoryThumbImageUrl(
          product.image_url || product.images?.[0] || ""
        );

        addProduct({
          id: productId,
          shop_id: 0, // Will be set from the product's shop context
          name: product.name,
          handle: product.product_code?.toLowerCase() || product.id.toString(),
          image_url: productImage,
          price: product.price,
          quantity: product.quantity ?? 1,
          old_price: product.old_price ?? 0,
          is_active: true,
          has_variant: product.has_variant ?? false,
          categories: (product.categories ?? []) as never[],
          variant_types: (product.variant_types ?? []) as never[],
          stocks: (product.stocks ?? []) as never[],
          is_stock_manage_by_variant: product.is_stock_manage_by_variant ?? false,
          reviews: [],
          total_inventory_sold: 0,
          qty: 1,
          selectedVariants: {},
        });

        toast.success(`${product.name} added to cart!`, {
          duration: 2000,
          position: "bottom-right",
        });
      }
    },
    [addProduct, getProductsByInventoryId, incrementQty, hasVariants]
  );

  return (
    <>
      {/* Variant Selector Modal */}
      <VariantSelectorModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        primaryColor={buttonBgColor}
        primaryTextColor={buttonTextColor}
      />

      {/* Products Grid */}
      <div className={gridClass} style={{ gap: `${gap * 4}px` }}>
        {products.map((product) => {
          const handle =
            product.product_code?.toLowerCase() || product.id.toString();
          const productImage = getInventoryThumbImageUrl(
            product.image_url || product.images?.[0] || ""
          );

          const outOfStock = isProductOutOfStock(product);

          return (
            <ProductCard
              key={product.id}
              id={product.id}
              handle={handle}
              title={product.name}
              vendor={product.brand}
              price={product.price}
              comparePrice={product.old_price ?? undefined}
              image={productImage}
              subtitle={product.short_description ?? undefined}
              rating={product.rating ?? 0}
              reviewCount={product.review_count ?? 0}
              badge={product.badge ?? undefined}
              colors={product.colors ?? []}
              buttonBgColor={buttonBgColor}
              buttonTextColor={buttonTextColor}
              onAddToCart={() => handleAddToCart(product)}
              isOutOfStock={outOfStock}
            />
          );
        })}
      </div>
    </>
  );
}
