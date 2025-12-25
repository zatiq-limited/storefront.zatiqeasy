"use client";

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useProductsStore } from "@/stores/productsStore";
import { AuroraProductCard } from "@/app/_themes/aurora/components/cards/aurora-product-card";
import type { Product } from "@/stores/productsStore";

interface AuroraRelatedProductsProps {
  ignoreProductId: number | string;
  currentProduct?: Product;
}

// Helper function to get all category combinations
const getAllCombinations = (
  categories: Array<{ id: number; name: string }>
) => {
  const result: Array<Array<{ id: number; name: string }>> = [];
  const combine = (
    start: number,
    combo: Array<{ id: number; name: string }>
  ) => {
    if (combo.length > 0) {
      result.push([...combo]);
    }
    for (let i = start; i < categories.length; i++) {
      combo.push(categories[i]);
      combine(i + 1, combo);
      combo.pop();
    }
  };
  combine(0, []);
  // Sort by length descending (prefer more matching categories)
  return result.sort((a, b) => b.length - a.length);
};

const AuroraRelatedProducts = ({
  ignoreProductId,
  currentProduct,
}: AuroraRelatedProductsProps) => {
  const { t } = useTranslation();
  const { products } = useProductsStore();

  const relatedProducts = useMemo(() => {
    if (!currentProduct || !currentProduct.categories?.length || !products) {
      // If no current product or categories, return other products
      return products
        ?.filter((p) => p.id?.toString() !== ignoreProductId?.toString())
        .slice(0, 8);
    }

    const combinations = getAllCombinations(currentProduct.categories);

    let related: Product[] = [];

    // Try to find products matching category combinations (most categories first)
    for (const combination of combinations) {
      related = products.filter(
        (product) =>
          product.id?.toString() !== ignoreProductId?.toString() &&
          combination.every((category) =>
            product.categories?.some(
              (prodCategory) => prodCategory?.id === category?.id
            )
          )
      );

      if (related.length > 0) {
        break;
      }
    }

    // Sort by number of matching categories
    related.sort((a, b) => {
      const aCategories = a.categories?.length || 0;
      const bCategories = b.categories?.length || 0;
      return bCategories - aCategories;
    });

    // Remove duplicates
    const uniqueRelated = related.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => t.id?.toString() === value.id?.toString())
    );

    // If we need more products, add other products
    if (uniqueRelated.length < 8) {
      const remainingProducts = products.filter(
        (product) =>
          product.id?.toString() !== ignoreProductId?.toString() &&
          !uniqueRelated.some(
            (related) => related.id?.toString() === product.id?.toString()
          )
      );

      return [...uniqueRelated, ...remainingProducts].slice(0, 8);
    }

    return uniqueRelated.slice(0, 8);
  }, [products, currentProduct, ignoreProductId]);

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-20 xl:mb-32">
      <h4 className="font-semibold mb-10 mt-12 text-xl md:text-2xl dark:text-gray-200">
        {t("related_products")}:
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {relatedProducts.map((product) => (
          <AuroraProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default AuroraRelatedProducts;
