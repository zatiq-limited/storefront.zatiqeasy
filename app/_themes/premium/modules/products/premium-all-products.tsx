"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Filter, X } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore, type Product } from "@/stores/productsStore";
import { useCartStore, selectTotalItems, selectSubtotal } from "@/stores/cartStore";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import { GridContainer } from "../../components/core";
import { PremiumProductCard } from "../../components/cards";
import { cn } from "@/lib/utils";

const PRODUCTS_PER_PAGE = 20;

export function PremiumAllProducts() {
  const router = useRouter();
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const products = useProductsStore((state) => state.products);
  const categories = useProductsStore((state) => state.categories);
  const filters = useProductsStore((state) => state.filters);
  const setFilters = useProductsStore((state) => state.setFilters);
  const totalCartItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100000 });

  const baseUrl = shopDetails?.baseUrl || "";
  const currency = shopDetails?.country_currency || "BDT";
  const hasItems = totalCartItems > 0;

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((p) =>
        p.categories?.some((c) => String(c.id) === filters.category)
      );
    }

    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(query)
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max
    );

    return filtered;
  }, [products, filters, priceRange]);

  // Pagination
  const currentPage = filters.page || 1;
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
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

  // Handle category selection
  const handleCategorySelect = useCallback(
    (categoryId: string | null) => {
      setFilters({ category: categoryId, page: 1 });
    },
    [setFilters]
  );

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setFilters({ page });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setFilters]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-[95%] md:w-[90%] lg:w-[85%] max-w-[1400px] mx-auto py-6 md:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {t("all_products")}
          </h1>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-black-27 border dark:border-gray-700 rounded-lg"
          >
            <Filter size={18} />
            {t("filter")}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white dark:bg-black-27 rounded-xl p-4 sticky top-24">
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {t("categories")}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className={cn(
                      "block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                      !filters.category
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-zatiq font-medium"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    {t("all")}
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(String(category.id))}
                      className={cn(
                        "block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                        filters.category === String(category.id)
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-zatiq font-medium"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {t("price_range")}
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder={t("min")}
                      value={priceRange.min || ""}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          min: Number(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-black-18"
                    />
                    <input
                      type="number"
                      placeholder={t("max")}
                      value={priceRange.max || ""}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          max: Number(e.target.value) || 100000,
                        }))
                      }
                      className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-black-18"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Category Horizontal List - Mobile */}
            <div className="lg:hidden overflow-x-auto mb-4 -mx-4 px-4">
              <div className="flex gap-2">
                <button
                  onClick={() => handleCategorySelect(null)}
                  className={cn(
                    "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    !filters.category
                      ? "bg-blue-zatiq text-white"
                      : "bg-white dark:bg-black-27 text-gray-700 dark:text-gray-300"
                  )}
                >
                  {t("all")}
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(String(category.id))}
                    className={cn(
                      "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                      filters.category === String(category.id)
                        ? "bg-blue-zatiq text-white"
                        : "bg-white dark:bg-black-27 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t("showing")} {paginatedProducts.length} {t("of")} {filteredProducts.length} {t("products")}
            </p>

            {/* Products */}
            {paginatedProducts.length > 0 ? (
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
                  {t("no_products_found")}
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
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-black-18 rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-black-18 p-4 border-b dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-lg">{t("filter")}</h3>
              <button onClick={() => setIsFilterOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">{t("categories")}</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        handleCategorySelect(String(category.id));
                        setIsFilterOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
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

export default PremiumAllProducts;
