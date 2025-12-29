"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore, type Product } from "@/stores/productsStore";
import {
  useCartStore,
  selectTotalItems,
  selectSubtotal,
} from "@/stores/cartStore";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import { PremiumProductCard } from "../../components/cards";
import { CategoryHorizontalList } from "@/components/features/category/category-horizontal-list";
import { cn } from "@/lib/utils";

const PRODUCTS_PER_PAGE = 20;

export function PremiumCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();

  const { shopDetails } = useShopStore();
  const products = useProductsStore((state) => state.products);
  const categories = useProductsStore((state) => state.categories);
  const totalCartItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const baseUrl = shopDetails?.baseUrl || "";
  const hasItems = totalCartItems > 0;

  // Get category ID from params
  const categoryId = params?.category as string;

  // Find the current category
  const currentCategory = useMemo(() => {
    if (!categoryId || !categories) return null;
    return categories.find((cat) => String(cat.id) === categoryId) || null;
  }, [categoryId, categories]);

  // Filter products by category
  const categoryProducts = useMemo(() => {
    if (!categoryId || !products) return [];

    return products.filter((product: Product) => {
      if (!product.categories) return false;
      return product.categories.some(
        (cat: { id: number | string; name: string }) =>
          String(cat.id) === categoryId
      );
    });
  }, [categoryId, products]);

  // Check loading state
  const isLoading = !products || products.length === 0;

  // Pagination
  const totalPages = Math.ceil(categoryProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = categoryProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Navigate to product detail
  const navigateProductDetails = useCallback(
    (id: number | string) => {
      router.push(`${baseUrl}/products/${id}`);
    },
    [router, baseUrl]
  );

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="container pb-20">
      <VariantSelectorModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Category Title */}
      <div>
        <h2 className="text-[20px] md:text-[36px] xl:text-[46px] leading-snug lg:leading-[57.50px] text-black-full dark:text-blue-zatiq font-bold py-5">
          {currentCategory?.name || t("category")}
        </h2>
      </div>

      {/* Category Horizontal List */}
      <CategoryHorizontalList fromCategory />

      {/* Spacer */}
      <div className="w-full h-8 md:h-10"></div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {isLoading ? (
          [...Array(12)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-700 rounded-xl aspect-244/304 animate-pulse"
            />
          ))
        ) : paginatedProducts.length > 0 ? (
          paginatedProducts.map((product, index) => (
            <PremiumProductCard
              key={product.id}
              product={product}
              onSelectProduct={() => setSelectedProduct(product)}
              onNavigate={() => navigateProductDetails(product.id)}
              imagePriority={index < 8}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center">
            <h3 className="text-center text-lg mt-5 text-gray-700 dark:text-gray-200">
              {t("no_products_found")}
            </h3>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              currentPage === 1
                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-white dark:bg-black-27 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            {t("previous")}
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={cn(
                  "w-10 h-10 rounded-lg font-medium transition-colors",
                  currentPage === pageNum
                    ? "bg-blue-zatiq text-white"
                    : "bg-white dark:bg-black-27 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              currentPage === totalPages
                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-white dark:bg-black-27 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            {t("next")}
          </button>
        </div>
      )}

      {/* Floating Cart Button */}
      <CartFloatingBtn
        showCartFloatingBtn={hasItems}
        totalProducts={totalCartItems}
        totalPrice={totalPrice}
        onClick={() => router.push(`${baseUrl}/checkout`)}
        theme="Premium"
      />
    </div>
  );
}

export default PremiumCategoryPage;
