"use client";

import React, { useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore, type Product } from "@/stores/productsStore";
import { useCartStore, selectTotalItems, selectSubtotal } from "@/stores/cartStore";
import { useCategoryProducts } from "@/hooks/useCategoryProducts";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import { SelloraProductCard } from "../../components/cards";
import { GridContainer, Pagination } from "../../components/core";

const PRODUCTS_PER_PAGE = 12;

export function SelloraCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const categories = useProductsStore((state) => state.categories);
  const totalCartItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categoryId = params?.category as string;
  const baseUrl = shopDetails?.baseUrl || "";
  const hasItems = totalCartItems > 0;

  // Get products for this category (hook gets category from URL params and handles pagination)
  const {
    products: paginatedProducts,
    allProducts: categoryProducts,
    category: currentCategory,
    pagination,
    currentPage,
    setCurrentPage,
    isLoading
  } = useCategoryProducts(PRODUCTS_PER_PAGE);

  // Pagination values from hook
  const totalPages = pagination.total_pages;

  // Navigate to product details
  const navigateProductDetails = useCallback(
    (id: number | string) => {
      router.push(`${baseUrl}/products/${id}`);
    },
    [router, baseUrl]
  );

  // Handle category change
  const handleCategoryChange = useCallback(
    (catId: string) => {
      router.push(`${baseUrl}/categories/${catId}?selected_category=${catId}`);
    },
    [router, baseUrl]
  );

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [setCurrentPage]);

  return (
    <div className="px-3 md:px-0 pb-10">
      {/* Variant Selector Modal */}
      <VariantSelectorModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <div className="max-w-7xl mx-auto">
        {/* Category Title */}
        <div>
          <h2 className="text-[20px] md:text-[36px] xl:text-[46px] leading-snug lg:leading-[57.50px] text-black-full dark:text-blue-zatiq font-bold py-5">
            {currentCategory?.name || t("category")}
          </h2>
        </div>

        {/* Horizontal Category List */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(String(category.id))}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  String(category.id) === categoryId
                    ? "bg-blue-zatiq text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[10/16] bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="mt-3 h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : paginatedProducts.length > 0 ? (
          <GridContainer columns={{ mobile: 2, tablet: 3, desktop: 3 }}>
            {paginatedProducts.map((product) => (
              <SelloraProductCard
                key={product.id}
                product={product}
                onNavigate={() => navigateProductDetails(product.id)}
                onSelectProduct={() => setSelectedProduct(product)}
              />
            ))}
          </GridContainer>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <h3 className="text-center text-lg mt-5">
              {t("no_products_found") || "No products found"}
            </h3>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Floating Cart Button */}
      <CartFloatingBtn
        showCartFloatingBtn={hasItems}
        totalProducts={totalCartItems}
        totalPrice={totalPrice}
        onClick={() => router.push(`${baseUrl}/checkout`)}
        theme="Sellora"
      />
    </div>
  );
}

export default SelloraCategoryPage;
