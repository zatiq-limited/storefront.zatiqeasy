"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { SlidersHorizontal, X, Square, SquareCheckBig } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore, type Product } from "@/stores/productsStore";
import {
  useCartStore,
  selectTotalItems,
  selectSubtotal,
} from "@/stores/cartStore";
import { useShopInventories, useShopCategories } from "@/hooks";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import { PremiumProductCard } from "../../components/cards";
import { CategoryHorizontalList } from "@/components/features/category/category-horizontal-list";
import { cn } from "@/lib/utils";

const PRODUCTS_PER_PAGE = 20;

interface PriceRange {
  id: number;
  min: number;
  max: number;
}

// Default price filters
const DEFAULT_PRICE_FILTERS: PriceRange[] = [
  { id: 1, min: 0, max: 500 },
  { id: 2, min: 500, max: 1000 },
  { id: 3, min: 1000, max: 2000 },
  { id: 4, min: 2000, max: 5000 },
  { id: 5, min: 5000, max: 10000 },
  { id: 6, min: 10000, max: 50000 },
];

export function PremiumAllProducts() {
  const router = useRouter();
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const products = useProductsStore((state) => state.products);
  const filters = useProductsStore((state) => state.filters);
  const setFilters = useProductsStore((state) => state.setFilters);
  const totalCartItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);
  const productsStoreIsLoading = useProductsStore((state) => state.isLoading);

  // Fetch shop inventories to populate products store (if not already fetched by parent)
  const { isLoading: isInventoriesLoading } = useShopInventories(
    { shopUuid: shopDetails?.shop_uuid ?? "" },
    { enabled: !!shopDetails?.shop_uuid }
  );

  // Fetch categories
  useShopCategories(
    { shopUuid: shopDetails?.shop_uuid ?? "" },
    { enabled: !!shopDetails?.shop_uuid }
  );

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [selectedRange, setSelectedRange] = useState<PriceRange | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("");

  const baseUrl = shopDetails?.baseUrl || "";
  const countryCurrency = shopDetails?.country_currency || "৳";
  const hasItems = totalCartItems > 0;
  const isLoading = isInventoriesLoading || productsStoreIsLoading;

  // Handle price range selection
  const handleRangeSelect = (range: PriceRange | null) => () => {
    if (selectedRange && selectedRange.id === range?.id) {
      setSelectedRange(null);
    } else {
      setSelectedRange(range);
    }
    setShowMobileFilter(false);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedRange(null);
    setSortOrder("");
  };

  // Handle sort change
  const handleInventorySort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  // Filter and sort products
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
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(query));
    }

    // Price range filter
    if (selectedRange) {
      filtered = filtered.filter(
        (p) => p.price >= selectedRange.min && p.price <= selectedRange.max
      );
    }

    // Sort
    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, filters, selectedRange, sortOrder]);

  // Pagination
  const currentPage = filters.page || 1;
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const totalProducts = filteredProducts.length;

  // Navigate to product detail
  const navigateProductDetails = useCallback(
    (id: number | string) => {
      router.push(`${baseUrl}/products/${id}`);
    },
    [router, baseUrl]
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
    <div className="container pb-20">
      <VariantSelectorModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Mobile Price Filter Modal */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilter(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-black-18 rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-black-18 p-4 border-b dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200">
                {t("filter")}
              </h3>
              <button onClick={() => setShowMobileFilter(false)}>
                <X size={24} className="text-gray-700 dark:text-gray-200" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-700 dark:text-gray-200 text-xl mb-4">
                {t("price")}
              </p>
              <div className="flex flex-col gap-3">
                {DEFAULT_PRICE_FILTERS.map((range) => (
                  <div key={range.id} className="flex gap-3 items-center">
                    <button
                      onClick={handleRangeSelect(range)}
                      className="cursor-pointer"
                    >
                      {selectedRange && selectedRange.id === range.id ? (
                        <SquareCheckBig
                          size={16}
                          className="text-black-2 dark:text-gray-200"
                        />
                      ) : (
                        <Square
                          size={16}
                          className="text-black-2 dark:text-gray-200"
                        />
                      )}
                    </button>
                    <p className="text-gray-700 dark:text-gray-200 text-base">
                      {countryCurrency} {range.min} - {countryCurrency}{" "}
                      {range.max}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="md:pt-6 pb-21">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-gray-700 dark:text-gray-200 text-xl lg:text-3xl font-normal leading-9.5">
            {t("all_products")} ({totalProducts})
          </h1>
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="lg:hidden"
          >
            <SlidersHorizontal
              size={24}
              className="text-gray-700 dark:text-gray-200"
            />
          </button>
          {totalProducts > 0 && (
            <div className="hidden lg:flex pl-2 h-13.75 rounded-xl items-center justify-between">
              <div className="text-black-1.2 text-sm flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-200 text-base whitespace-nowrap">
                  {t("sort_by")}
                </span>
                <select
                  onChange={handleInventorySort}
                  value={sortOrder}
                  className="w-45 text-sm rounded-none text-black-2 dark:text-gray-200 bg-white dark:bg-black-2 border border-gray-300 dark:border-gray-600"
                  style={{ borderRadius: "0", padding: "8px 14px" }}
                >
                  <option value="">{t("default")}</option>
                  <option value="asc">{t("price_low_to_high")}</option>
                  <option value="desc">{t("price_high_to_low")}</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Category Horizontal List */}
        <CategoryHorizontalList className="my-3 md:my-4 xl:my-5" />

        {/* Main Content */}
        <div className="pt-6 flex gap-10">
          {/* Left Sidebar - Price Filter */}
          <div className="hidden lg:block lg:w-1/5">
            <div className="pb-4 border-b border-b-gray-300 dark:border-b-gray-600 flex items-center justify-between">
              <h1 className="text-gray-700 dark:text-gray-200 text-2xl leading-tight">
                {t("filter")}
              </h1>
              <button onClick={handleClearFilters}>
                <X size={24} className="text-red-500 cursor-pointer" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-gray-700 dark:text-gray-200 text-xl mt-6">
                {t("price")}
              </p>
              <div className="flex flex-col gap-2">
                {DEFAULT_PRICE_FILTERS.map((range) => (
                  <div key={range.id} className="flex gap-3 items-center">
                    <button
                      onClick={handleRangeSelect(range)}
                      className="cursor-pointer"
                    >
                      {selectedRange && selectedRange.id === range.id ? (
                        <SquareCheckBig
                          size={16}
                          className="text-black-2 dark:text-gray-200"
                        />
                      ) : (
                        <Square
                          size={16}
                          className="text-black-2 dark:text-gray-200"
                        />
                      )}
                    </button>
                    <p className="text-gray-700 dark:text-gray-200 text-base">
                      {countryCurrency} {range.min} - {countryCurrency}{" "}
                      {range.max}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="w-full lg:w-4/5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product, index) => (
                <PremiumProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={() => setSelectedProduct(product)}
                  onNavigate={() => navigateProductDetails(product.id)}
                  // Priority loading for first 8 images (above the fold)
                  imagePriority={index < 8}
                />
              ))
            ) : (
              <div className="text-gray-700 dark:text-gray-200 w-full col-span-2 md:col-span-3 lg:col-span-4 text-xl text-center flex items-center h-full justify-center min-h-50">
                {t("no_products_found")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4 mb-8">
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

export default PremiumAllProducts;
