"use client";

import { useMemo, useState } from "react";
import { useProductsStore } from "@/stores";
import { BasicProductCard } from "@/components/products/basic-product-card";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import { getAllCombinations } from "@/lib/category-utils";
import type { Product } from "@/stores/productsStore";

interface RelatedProductsProps {
  currentProduct: Product;
  baseUrl: string;
}

export function RelatedProducts({
  currentProduct,
  baseUrl,
}: RelatedProductsProps) {
  const allProducts = useProductsStore((state) => state.products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const relatedProducts = useMemo(() => {
    if (
      !currentProduct ||
      !currentProduct.categories?.length ||
      !allProducts.length
    ) {
      return [];
    }

    // Get all combinations of current product's categories
    const combinations = getAllCombinations(currentProduct.categories);

    let related: Product[] = [];

    // Try to find products matching category combinations (most specific first)
    for (const combination of combinations) {
      related = allProducts.filter(
        (product) =>
          product.id.toString() !== currentProduct.id.toString() &&
          combination.every((category) =>
            product.categories?.some(
              (prodCategory) =>
                prodCategory.id.toString() === category.id.toString()
            )
          )
      );

      if (related.length > 0) {
        break;
      }
    }

    // Sort the related products by the number of matching categories in descending order
    related.sort((a, b) => {
      const aCategories = a.categories?.length || 0;
      const bCategories = b.categories?.length || 0;
      return bCategories - aCategories;
    });

    // Remove duplicates
    const uniqueRelated = related.filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.id.toString() === value.id.toString() &&
            t.id.toString() !== currentProduct.id.toString()
        )
    );

    // If the related products are less than 20, add the rest of the products
    if (uniqueRelated.length < 20) {
      const remainingProducts = allProducts.filter(
        (product) =>
          product.id.toString() !== currentProduct.id.toString() &&
          !uniqueRelated.some(
            (related) => related.id.toString() === product.id.toString()
          )
      );

      return [...uniqueRelated, ...remainingProducts].slice(0, 20);
    }

    return uniqueRelated.slice(0, 20);
  }, [allProducts, currentProduct]);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h4 className="font-semibold mb-10 mt-12 text-xl md:text-2xl text-black-full dark:text-gray-200">
        Related Products:
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
        {relatedProducts.map((product) => (
          <BasicProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            old_price={product.old_price}
            image_url={product.image_url}
            images={product.images}
            variant_types={product.variant_types}
            quantity={product.quantity}
            has_variant={product.has_variant}
            onNavigate={() => {
              window.location.href = `${baseUrl}/products/${
                product.slug || product.id
              }`;
            }}
            onSelectProduct={() => {
              setSelectedProduct(product);
            }}
          />
        ))}
      </div>

      {/* Variant Selector Modal */}
      <VariantSelectorModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </div>
  );
}
