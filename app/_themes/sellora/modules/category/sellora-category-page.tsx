"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { type Product } from "@/stores/productsStore";
import {
  useCartStore,
  selectTotalItems,
  selectSubtotal,
} from "@/stores/cartStore";
import { useCategoryProducts } from "@/hooks/useCategoryProducts";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import { CategoryHorizontalList } from "@/components/features/category/category-horizontal-list";
import { SelloraProductCard } from "../../components/cards";
import { GridContainer, Pagination } from "../../components/core";

const PRODUCTS_PER_PAGE = 12;

export function SelloraCategoryPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const totalCartItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const baseUrl = shopDetails?.baseUrl || "";
  const hasItems = totalCartItems > 0;

  // Get products for this category (hook gets category from URL params and handles pagination)
  const {
    products: paginatedProducts,
    category: currentCategory,
    pagination,
    currentPage,
    setCurrentPage,
    isLoading,
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

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setCurrentPage]
  );

  return (
    <>
      <div className="container pt-16 pb-10">
        {/* Variant Selector Modal */}
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

        {/* Horizontal Category List */}
        <CategoryHorizontalList fromCategory />

        {/* Products Grid */}
        <GridContainer columns={{ mobile: 2, tablet: 2, desktop: 4 }}>
          {isLoading ? (
            [...Array(9)].map((_, index) => (
              <div
                key={index}
                className="border shadow-sm rounded-md p-4 max-w-sm w-full mx-auto"
              >
                <div className="animate-pulse flex flex-col">
                  <div className="rounded-lg bg-slate-300 dark:bg-slate-600 h-37.5 sm:h-42 w-full" />
                  <div className="flex flex-col space-y-6 pt-5">
                    <div className="h-5 bg-slate-300 dark:bg-slate-600 rounded-sm" />
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-2 bg-slate-300 dark:bg-slate-600 rounded-sm col-span-2" />
                        <div className="h-2 bg-slate-300 dark:bg-slate-600 rounded-sm col-span-1" />
                      </div>
                      <div className="h-2 bg-slate-300 dark:bg-slate-600 rounded-sm" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <SelloraProductCard
                key={product.id}
                product={product}
                onNavigate={() => navigateProductDetails(product.id)}
                onSelectProduct={() => setSelectedProduct(product)}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center">
              <h3 className="text-center text-lg mt-5">
                {t("no_products_found") || "No products found"}
              </h3>
            </div>
          )}
        </GridContainer>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Floating Cart Button */}
        <CartFloatingBtn
          showCartFloatingBtn={hasItems}
          totalProducts={totalCartItems}
          totalPrice={totalPrice}
          onClick={() => router.push(`${baseUrl}/checkout`)}
          theme="Sellora"
        />
      </div>
    </>
  );
}

export default SelloraCategoryPage;
