"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { X, SlidersHorizontal, Square, SquareCheckBig } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import {
  useCartStore,
  selectTotalItems,
  selectSubtotal,
} from "@/stores/cartStore";
import { useProductsStore, type Product } from "@/stores/productsStore";
import { useShopInventories, useShopCategories } from "@/hooks";
import { AuroraProductCard } from "../../components/cards";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import CategoryHorizontalList from "@/components/features/category/category-horizontal-list";
import Pagination from "@/components/pagination";
import ProductSkeleton from "@/components/shared/skeletons/product-skeleton";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import { cn } from "@/lib/utils";

interface PriceRange {
  id: string;
  min: number;
  max: number;
}

// Aurora Page Header Component
function AuroraPageHeader({
  titleElement,
  number,
  className,
}: {
  titleElement: string;
  number?: number;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "text-[38px] md:text-[64px] font-normal text-blue-zatiq",
        className
      )}
    >
      {titleElement}
      {number !== undefined && number > 0 && (
        <span className="text-[18px] md:text-[30px] text-[#9CA3AF] ml-2">
          ({number})
        </span>
      )}
    </h1>
  );
}

// Constants
const MAX_PRODUCTS_PER_PAGE = 12;

export function AuroraAllProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const { shopDetails } = useShopStore();
  const totalCartProducts = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);

  // Get products from Zustand store
  const products = useProductsStore((state) => state.products);
  const filters = useProductsStore((state) => state.filters);
  const setFilters = useProductsStore((state) => state.setFilters);
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
  const [selectedRange, setSelectedRange] = useState<PriceRange | null>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("");

  // Sync URL params with store filters
  const selectedCategory = searchParams.get("selected_category");

  useEffect(() => {
    // Update store filter when URL param changes
    if (selectedCategory && selectedCategory !== filters.category) {
      setFilters({ category: selectedCategory, page: 1 });
    } else if (!selectedCategory && filters.category) {
      // Clear category filter when URL param is removed
      setFilters({ category: undefined, page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const baseUrl = shopDetails?.baseUrl || "";
  const countryCurrency = shopDetails?.country_currency || "BDT";
  const hasItems = totalCartProducts > 0;
  const isLoading = isInventoriesLoading || productsStoreIsLoading;

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
          product.price >= selectedRange.min &&
          product.price <= selectedRange.max
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

  // Default price filters
  const priceFilters: PriceRange[] = useMemo(() => {
    return [
      { id: "1", min: 0, max: 500 },
      { id: "2", min: 500, max: 1000 },
      { id: "3", min: 1000, max: 2000 },
      { id: "4", min: 2000, max: 5000 },
    ];
  }, []);

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
        // Clear price filter
      } else {
        setSelectedRange(range);
        // Apply price filter
      }
      setShowMobileFilter(false);
    },
    [selectedRange]
  );

  // Handle sort change
  const handleInventorySort = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const order = e.target.value;
      setSortOption(order);
      setCurrentPage(1); // Reset to page 1 on sort change
    },
    []
  );

  return (
    <div className="px-4 md:px-0">
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
                    {countryCurrency}
                    {range.min} - {countryCurrency}
                    {range.max}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className="pt-6 md:pt-9 pb-20 container">
        {/* Header Row */}
        <div className="flex justify-between items-center">
          <div className="w-full flex items-center justify-between mb-6 xl:mb-9">
            <AuroraPageHeader titleElement={t("all")} number={totalProducts} />
            <button
              onClick={() => setShowMobileFilter(true)}
              className="lg:hidden"
            >
              <SlidersHorizontal
                size={24}
                className="text-gray-700 dark:text-gray-200"
              />
            </button>
          </div>

          {/* Sort (Desktop) */}
          {totalProducts >= 1 && (
            <div className="hidden lg:flex pl-2 h-14 rounded-xl items-center justify-between">
              <div className="text-black-1.2 text-sm flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-200 text-base whitespace-nowrap">
                  {t("sort_by")}
                </span>
                <select
                  onChange={handleInventorySort}
                  value={sortOption}
                  className="px-4 py-2 rounded-md border text-black-2 dark:text-gray-200 bg-white dark:bg-black-2"
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
        <div className="flex gap-10">
          {/* Sidebar (Desktop) */}
          {priceFilters.length > 0 && (
            <div className="hidden lg:block lg:w-1/5">
              <div className="pb-4 border-b border-gray-300 flex items-center justify-between">
                <h1 className="text-gray-700 dark:text-gray-200 text-2xl leading-tight">
                  {t("filter")}
                </h1>
                <button onClick={handleRangeSelect(null)}>
                  <X size={24} className="text-red-500 cursor-pointer" />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-gray-700 dark:text-gray-200 text-xl mt-6">
                  {t("price")}
                </p>
                <div className="flex flex-col gap-2">
                  {priceFilters.map((range) => (
                    <button
                      key={range.id}
                      onClick={handleRangeSelect(range)}
                      className="flex items-center gap-3"
                    >
                      {selectedRange?.id === range.id ? (
                        <SquareCheckBig size={16} className="text-blue-zatiq" />
                      ) : (
                        <Square size={16} className="text-gray-500" />
                      )}
                      <span className="text-gray-700 dark:text-gray-200 text-base">
                        {countryCurrency}
                        {range.min} - {countryCurrency}
                        {range.max}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="w-full lg:w-4/5 grid grid-cols-2 md:grid-cols-3 gap-5">
            {isLoading ? (
              [...Array(9)].map((_, index) => <ProductSkeleton key={index} />)
            ) : currentProducts && currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <AuroraProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={() => setSelectedProduct(product)}
                  onNavigate={() => navigateProductDetails(product.id)}
                />
              ))
            ) : (
              <div className="col-span-2 md:col-span-3 flex items-center justify-center py-12">
                <h1 className="text-center text-xl text-gray-600 dark:text-gray-400">
                  No available Products
                </h1>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Floating Cart Button */}
      <CartFloatingBtn
        onClick={() => router.push(`${baseUrl}/checkout`)}
        showCartFloatingBtn={hasItems}
        totalPrice={totalPrice}
        totalProducts={totalCartProducts}
        theme="Aurora"
      />
    </div>
  );
}

export default AuroraAllProducts;
