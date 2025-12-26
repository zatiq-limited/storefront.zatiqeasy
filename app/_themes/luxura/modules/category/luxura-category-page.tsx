"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore, selectTotalItems, selectSubtotal } from "@/stores/cartStore";
import { useCategoryProducts } from "@/hooks/useCategoryProducts";
import { GridContainer } from "../../components/core";
import { LuxuraProductCard } from "../../components/cards";
import { SectionHeader } from "../home/sections/section-header";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import CategoryHorizontalList from "@/components/features/category/category-horizontal-list";
import Pagination from "@/components/pagination";
import ProductSkeleton from "@/components/shared/skeletons/product-skeleton";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import type { Product } from "@/stores/productsStore";

export function LuxuraCategoryPage() {
  const router = useRouter();
  const { shopDetails } = useShopStore();
  const totalProducts = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);

  const {
    category,
    products,
    pagination,
    currentPage,
    setCurrentPage,
    isLoading,
  } = useCategoryProducts();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const baseUrl = shopDetails?.baseUrl || "";
  const hasItems = totalProducts > 0;

  // Navigate to product detail
  const navigateProductDetails = useCallback(
    (id: number | string) => {
      router.push(`${baseUrl}/products/${id}`);
    },
    [router, baseUrl]
  );

  return (
    <>
      <div className="container pb-20">
        {/* Variant Selector Modal */}
        <VariantSelectorModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />

        {/* Category Title */}
        <div className="pt-6 md:pt-9">
          <SectionHeader
            text={category?.name || "Category"}
          />
        </div>

        {/* Category Horizontal List */}
        <CategoryHorizontalList fromCategory className="mb-8" />

        {/* Products Grid */}
        {isLoading ? (
          <GridContainer>
            {[...Array(12)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </GridContainer>
        ) : products && products.length > 0 ? (
          <GridContainer>
            {products.map((product) => (
              <LuxuraProductCard
                key={product.id}
                product={product}
                onSelectProduct={() => setSelectedProduct(product)}
                onNavigate={() => navigateProductDetails(product.id)}
              />
            ))}
          </GridContainer>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 text-lg">No products found in this category</p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.total_pages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Floating Cart Button */}
      <CartFloatingBtn
        onClick={() => router.push(`${baseUrl}/checkout`)}
        showCartFloatingBtn={hasItems}
        totalPrice={totalPrice}
        totalProducts={totalProducts}
        theme="Luxura"
      />
    </>
  );
}

export default LuxuraCategoryPage;
