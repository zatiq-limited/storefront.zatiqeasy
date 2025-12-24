"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore, selectTotalItems, selectSubtotal } from "@/stores/cartStore";
import { useCategoryProducts } from "@/hooks/useCategoryProducts";
import { GridContainer } from "../../components/core";
import { AuroraProductCard } from "../../components/cards";
import { SectionHeader } from "../home/sections";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import CategoryHorizontalList from "@/components/features/category/category-horizontal-list";
import Pagination from "@/components/pagination";
import ProductSkeleton from "@/components/shared/skeletons/product-skeleton";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import type { Product } from "@/stores/productsStore";

export function AuroraCategoryPage() {
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
      <div className="pb-20 px-4 md:px-0">
        {/* Variant Selector Modal */}
        <VariantSelectorModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />

        {/* Category Title */}
        <div>
          <SectionHeader
            text={category?.name || "Category"}
            className="py-5"
          />
        </div>

        {/* Category Horizontal List */}
        <CategoryHorizontalList fromCategory />

        <div className="w-full h-8 md:h-10" />

        {/* Products Grid */}
        <GridContainer>
          {isLoading ? (
            // Loading Skeletons
            [...Array(9)].map((_, index) => <ProductSkeleton key={index} />)
          ) : products && products.length > 0 ? (
            // Product Cards
            products.map((product) => (
              <AuroraProductCard
                key={product.id}
                product={product}
                onSelectProduct={() => setSelectedProduct(product)}
                onNavigate={() => navigateProductDetails(product.id)}
              />
            ))
          ) : (
            // Empty State
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <h3 className="text-center text-lg mt-5 text-gray-600 dark:text-gray-400">
                No products found
              </h3>
            </div>
          )}
        </GridContainer>

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.total_pages}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Floating Cart Button */}
        <CartFloatingBtn
          onClick={() => router.push(`${baseUrl}/checkout`)}
          showCartFloatingBtn={hasItems}
          totalPrice={totalPrice}
          totalProducts={totalProducts}
          theme="Aurora"
        />
      </div>
    </>
  );
}

export default AuroraCategoryPage;
