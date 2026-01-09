"use client";

import { useMemo } from "react";
import { getInventoryThumbImageUrl } from "@/lib/utils/formatting";
import { getProductCardComponent } from "../product-cards";
import type { ProductsGridProps } from "./types";

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
  const gridClass = useMemo(() => {
    const lgCols = GRID_COLUMNS_MAP[columns] || "grid-cols-4";
    return `grid grid-cols-1 sm:grid-cols-2 lg:${lgCols}`;
  }, [columns]);

  const ProductCard = getProductCardComponent(cardType);

  return (
    <div className={gridClass} style={{ gap: `${gap * 4}px` }}>
      {products.map((product) => {
        const handle =
          product.product_code?.toLowerCase() || product.id.toString();
        const productImage = getInventoryThumbImageUrl(
          product.image_url || product.images?.[0] || ""
        );

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
          />
        );
      })}
    </div>
  );
}
