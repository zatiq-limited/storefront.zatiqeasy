"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { X, SlidersHorizontal, Square, SquareCheckBig } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore, selectTotalItems, selectSubtotal } from "@/stores/cartStore";
import { useProductsStore, type Product } from "@/stores/productsStore";
import { GridContainer } from "../../components/core";
import { LuxuraProductCard } from "../../components/cards";
import { SectionHeader } from "../home/sections/section-header";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import CategoryHorizontalList from "@/components/features/category/category-horizontal-list";
import Pagination from "@/components/pagination";
import ProductSkeleton from "@/components/shared/skeletons/product-skeleton";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";

interface PriceRange {
  id: string;
  min: number;
  max: number;
}

const MAX_PRODUCTS_PER_PAGE = 12;

export function LuxuraAllProducts() {
  const router = useRouter();
  const { t } = useTranslation();

  const { shopDetails } = useShopStore();
  const totalCartProducts = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);

  // Get products from Zustand store
  const products = useProductsStore((state) => state.products);
  const filters = useProductsStore((state) => state.filters);
  const isLoading = useProductsStore((state) => state.isLoading);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedRange, setSelectedRange] = useState<PriceRange | null>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("");

  const baseUrl = shopDetails?.baseUrl || "";
  const currency = shopDetails?.country_currency || "BDT";
  const hasItems = totalCartProducts > 0;

  // Default price filters
  const priceFilters: PriceRange[] = useMemo(() => [
    { id: "1", min: 0, max: 500 },
    { id: "2", min: 500, max: 1000 },
    { id: "3", min: 1000, max: 2000 },
    { id: "4", min: 2000, max: 5000 },
  ], []);

  // Compute filtered products
  const { filteredProducts, totalPages, totalProducts } = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(
        (product) =>
          String(product.category_id) === String(filters.category) ||
          product.categories?.some(
            (cat) => String(cat.id) === String(filters.category)
          )
      );
    }

    // Apply price range filter
    if (selectedRange) {
      filtered = filtered.filter(
        (product) =>
          product.price >= selectedRange.min && product.price <= selectedRange.max
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "asc":
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case "desc":
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
    }

    return {
      filteredProducts: filtered,
      totalPages: Math.ceil(filtered.length / MAX_PRODUCTS_PER_PAGE),
      totalProducts: filtered.length,
    };
  }, [products, filters, selectedRange, sortOption]);

  // Get current page products
  const currentProducts = useMemo(() => {
    if (!filteredProducts || !Array.isArray(filteredProducts)) {
      return [];
    }
    const start = (currentPage - 1) * MAX_PRODUCTS_PER_PAGE;
    const end = start + MAX_PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  // Navigate to product detail
  const navigateProductDetails = useCallback(
    (id: number | string) => {
      router.push(`${baseUrl}/products/${id}`);
    },
    [router, baseUrl]
  );

  // Handle price range filter
  const handleRangeSelect = useCallback(
    (range: PriceRange | null) => () => {
      if ((selectedRange && selectedRange.id === range?.id) || !range) {
        setSelectedRange(null);
      } else {
        setSelectedRange(range);
      }
      setCurrentPage(1);
      setShowMobileFilter(false);
    },
    [selectedRange]
  );

  // Handle sort change
  const handleInventorySort = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const order = e.target.value;
      setSortOption(order);
      setCurrentPage(1);
    },
    []
  );

  return (
    <div className="pb-20">
      {/* Variant Selector Modal */}
      <VariantSelectorModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Mobile Filter Modal */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilter(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 max-w-full bg-white dark:bg-black-27 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{t("filter")}</h2>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-200 font-medium">
                {t("price")}
              </p>
              {priceFilters.map((range) => (
                <button
                  key={range.id}
                  onClick={handleRangeSelect(range)}
                  className="flex items-center gap-3 w-full text-left"
                >
                  {selectedRange?.id === range.id ? (
                    <SquareCheckBig size={16} className="text-blue-zatiq" />
                  ) : (
                    <Square size={16} className="text-gray-500" />
                  )}
                  <span className="text-gray-700 dark:text-gray-200">
                    {currency} {range.min} - {currency} {range.max}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Page Content - Premium 78% width */}
      <div className="pt-6 md:pt-9 w-[95%] md:w-[90%] lg:w-[78%] mx-auto">
        {/* Header Row */}
        <div className="flex justify-between items-center mb-6">
          <SectionHeader
            text={t("all_products")}
            showViewAll={false}
            className="mb-0"
          />
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowMobileFilter(true)}
              className="lg:hidden p-2 rounded-lg border"
            >
              <SlidersHorizontal size={20} />
            </button>

            {/* Sort Dropdown */}
            <select
              onChange={handleInventorySort}
              value={sortOption}
              className="hidden lg:block px-4 py-2 rounded-lg border text-sm bg-white dark:bg-black-27"
            >
              <option value="">{t("default")}</option>
              <option value="asc">{t("price_low_to_high")}</option>
              <option value="desc">{t("price_high_to_low")}</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal List */}
        <CategoryHorizontalList className="mb-6" />

        {/* Main Content */}
        <div className="flex gap-10">
          {/* Sidebar (Desktop) */}
          <div className="hidden lg:block lg:w-1/5">
            <div className="pb-4 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">{t("filter")}</h3>
              <button onClick={handleRangeSelect(null)}>
                <X size={20} className="text-red-500" />
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <p className="text-gray-700 dark:text-gray-200 font-medium">
                {t("price")}
              </p>
              {priceFilters.map((range) => (
                <button
                  key={range.id}
                  onClick={handleRangeSelect(range)}
                  className="flex items-center gap-3 w-full text-left"
                >
                  {selectedRange?.id === range.id ? (
                    <SquareCheckBig size={16} className="text-blue-zatiq" />
                  ) : (
                    <Square size={16} className="text-gray-500" />
                  )}
                  <span className="text-gray-700 dark:text-gray-200 text-sm">
                    {currency} {range.min} - {currency} {range.max}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="w-full lg:w-4/5">
            {isLoading ? (
              <GridContainer>
                {[...Array(12)].map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </GridContainer>
            ) : currentProducts.length > 0 ? (
              <GridContainer>
                {currentProducts.map((product) => (
                  <LuxuraProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={() => setSelectedProduct(product)}
                    onNavigate={() => navigateProductDetails(product.id)}
                  />
                ))}
              </GridContainer>
            ) : (
              <div className="flex items-center justify-center py-20">
                <p className="text-gray-500 text-lg">{t("no_products_found")}</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>

      {/* Floating Cart Button */}
      <CartFloatingBtn
        onClick={() => router.push(`${baseUrl}/checkout`)}
        showCartFloatingBtn={hasItems}
        totalPrice={totalPrice}
        totalProducts={totalCartProducts}
        theme="Luxura"
      />
    </div>
  );
}

export default LuxuraAllProducts;
