"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useProductsStore } from "@/stores/productsStore";
import { useShopStore } from "@/stores/shopStore";
import { useShopInventories } from "@/hooks";
import { GridContainer } from "../../components/core";
import { PremiumProductCard } from "../../components/cards";
import type { Product } from "@/stores/productsStore";

interface PremiumRelatedProductsProps {
  ignoreProductId: number | string;
  currentProduct?: Product;
  onSelectProduct?: (product: Product) => void;
  onNavigate?: (productId: number | string) => void;
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

const PremiumRelatedProducts = ({
  ignoreProductId,
  currentProduct,
  onSelectProduct,
  onNavigate,
}: PremiumRelatedProductsProps) => {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const storeProducts = useProductsStore((state) => state.products);

  // Fetch products if store is empty (handles page reload scenario)
  // sortByStock: false to preserve original API order
  const { data: fetchedProducts, isLoading } = useShopInventories(
    { shopUuid: shopDetails?.shop_uuid || "" },
    { enabled: storeProducts.length === 0 && !!shopDetails?.shop_uuid, sortByStock: false }
  );

  // Use store products if available, otherwise use fetched products
  const products = useMemo(
    () =>
      storeProducts.length > 0
        ? storeProducts
        : (fetchedProducts as Product[]) || [],
    [storeProducts, fetchedProducts]
  );

  const relatedProducts = useMemo(() => {
    if (
      !currentProduct ||
      !currentProduct.categories?.length ||
      !products.length
    ) {
      // If no current product or categories, return other products
      return products
        ?.filter((p) => p.id?.toString() !== ignoreProductId?.toString())
        .slice(0, 10);
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
    if (uniqueRelated.length < 10) {
      const remainingProducts = products.filter(
        (product) =>
          product.id?.toString() !== ignoreProductId?.toString() &&
          !uniqueRelated.some(
            (related) => related.id?.toString() === product.id?.toString()
          )
      );

      return [...uniqueRelated, ...remainingProducts].slice(0, 10);
    }

    return uniqueRelated.slice(0, 10);
  }, [products, currentProduct, ignoreProductId]);

  // Show skeleton while loading
  if (isLoading && storeProducts.length === 0) {
    return (
      <div className="mt-12 md:mt-16">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t("related_products")}
        </h2>
        <GridContainer columns={{ mobile: 2, tablet: 3, desktop: 5 }}>
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg aspect-3/4"
            />
          ))}
        </GridContainer>
      </div>
    );
  }

  // Don't render if no related products
  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 md:mt-16">
      <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {t("related_products")}
      </h2>
      <GridContainer columns={{ mobile: 2, tablet: 3, desktop: 5 }}>
        {relatedProducts.map((relatedProduct) => (
          <PremiumProductCard
            key={relatedProduct.id}
            product={relatedProduct}
            onSelectProduct={() => onSelectProduct?.(relatedProduct)}
            onNavigate={() => onNavigate?.(relatedProduct.id)}
          />
        ))}
      </GridContainer>
    </div>
  );
};

export default PremiumRelatedProducts;
