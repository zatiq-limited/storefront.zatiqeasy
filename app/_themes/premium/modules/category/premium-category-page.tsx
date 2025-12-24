"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore, type Product } from "@/stores/productsStore";
import { useCartStore, selectTotalItems, selectSubtotal } from "@/stores/cartStore";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import { useCategoryProducts } from "@/hooks/useCategoryProducts";
import { GridContainer } from "../../components/core";
import { PremiumProductCard } from "../../components/cards";
import { cn } from "@/lib/utils";

const PRODUCTS_PER_PAGE = 20;

export function PremiumCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const { shopDetails } = useShopStore();
  const categories = useProductsStore((state) => state.categories);
  const totalCartItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const baseUrl = shopDetails?.baseUrl || "";
  const hasItems = totalCartItems > 0;

  // Get category products using the hook
  const { products: categoryProducts, isLoading } = useCategoryProducts();

  // Get current category
  const categoryId = params?.category as string;
  const currentCategory = categories.find((c) => String(c.id) === categoryId);

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

  // Handle category change
  const handleCategoryChange = useCallback(
    (newCategoryId: string) => {
      router.push(`${baseUrl}/categories/${newCategoryId}?selected_category=${newCategoryId}`);
    },
    [router, baseUrl]
  );

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-[95%] md:w-[90%] lg:w-[85%] max-w-[1400px] mx-auto py-6 md:py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => router.push(baseUrl || "/")}
            className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-zatiq transition-colors"
          >
            <ChevronLeft size={20} />
            {t("back")}
          </button>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {currentCategory?.name || t("category")}
          </span>
        </div>

        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {currentCategory?.name || t("category")}
        </h1>

        {/* Category Horizontal List */}
        <div className="overflow-x-auto mb-6 -mx-4 px-4">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(String(category.id))}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                  categoryId === String(category.id)
                    ? "bg-blue-zatiq text-white"
                    : "bg-white dark:bg-black-27 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {t("showing")} {paginatedProducts.length} {t("of")} {categoryProducts.length} {t("products")}
        </p>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-gray-700 rounded-xl aspect-[244/304] animate-pulse"
              />
            ))}
          </div>
        ) : paginatedProducts.length > 0 ? (
          <GridContainer columns={{ mobile: 2, tablet: 3, desktop: 5 }}>
            {paginatedProducts.map((product) => (
              <PremiumProductCard
                key={product.id}
                product={product}
                onSelectProduct={() => setSelectedProduct(product)}
                onNavigate={() => navigateProductDetails(product.id)}
              />
            ))}
          </GridContainer>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {t("no_products_in_category")}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={cn(
                  "w-10 h-10 rounded-lg font-medium transition-colors",
                  currentPage === page
                    ? "bg-blue-zatiq text-white"
                    : "bg-white dark:bg-black-27 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      <CartFloatingBtn
        showCartFloatingBtn={hasItems}
        totalProducts={totalCartItems}
        totalPrice={totalPrice}
        onClick={() => router.push(`${baseUrl}/checkout`)}
        theme="Premium"
      />

      {/* Variant Selector Modal */}
      {selectedProduct && (
        <VariantSelectorModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default PremiumCategoryPage;
