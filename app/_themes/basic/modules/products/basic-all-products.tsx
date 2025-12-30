"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useProductsStore, type Product } from "@/stores/productsStore";
import { useShopStore } from "@/stores/shopStore";
import { useShopInventories, useShopCategories } from "@/hooks";
import CategoryHorizontalList from "@/components/features/category/category-horizontal-list";
import Pagination from "@/components/pagination";
import ProductSkeleton from "@/components/shared/skeletons/product-skeleton";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import BasicProductCard from "@/app/_themes/basic/components/cards/basic-product-card";

interface PriceRange {
  id: string;
  min: number;
  max: number;
}

const MAX_PRODUCTS_PER_PAGE = 12;

export function BasicAllProducts() {
  const router = useRouter();
  const { shopDetails } = useShopStore();

  // Get products from Zustand store
  const products = useProductsStore((state) => state.products);
  const filters = useProductsStore((state) => state.filters);
  const productsStoreIsLoading = useProductsStore((state) => state.isLoading);

  // Fetch shop inventories to populate products store
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

  const baseUrl = shopDetails?.baseUrl || "";
  const countryCurrency = shopDetails?.country_currency || "BDT";
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
      } else {
        setSelectedRange(range);
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
      setCurrentPage(1);
    },
    []
  );

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Variant Selector Modal */}
      <VariantSelectorModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          All Products
          {totalProducts > 0 && (
            <span className="text-lg text-gray-500 ml-2">({totalProducts})</span>
          )}
        </h1>
      </div>

      {/* Category Horizontal List */}
      <CategoryHorizontalList className="mb-6" />

      {/* Filters and Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </button>

        <select
          onChange={handleInventorySort}
          value={sortOption}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Default Sorting</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {/* Price Filter (Mobile) */}
      {showMobileFilter && (
        <div className="lg:hidden mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="space-y-2">
            {priceFilters.map((range) => (
              <button
                key={range.id}
                onClick={handleRangeSelect(range)}
                className="flex items-center gap-2 w-full text-left"
              >
                <span className={selectedRange?.id === range.id ? "text-blue-600" : "text-gray-400"}>
                  {selectedRange?.id === range.id ? "✓" : "○"}
                </span>
                <span>
                  {countryCurrency} {range.min} - {countryCurrency} {range.max}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-4">
            <h3 className="font-semibold text-lg mb-4">Filters</h3>
            <div>
              <h4 className="font-medium mb-2">Price Range</h4>
              <div className="space-y-2">
                {priceFilters.map((range) => (
                  <button
                    key={range.id}
                    onClick={handleRangeSelect(range)}
                    className="flex items-center gap-2 w-full text-left text-sm"
                  >
                    <span className={selectedRange?.id === range.id ? "text-blue-600" : "text-gray-400"}>
                      {selectedRange?.id === range.id ? "✓" : "○"}
                    </span>
                    <span>
                      {countryCurrency} {range.min} - {countryCurrency} {range.max}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, index) => <ProductSkeleton key={index} />)}
            </div>
          ) : currentProducts && currentProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentProducts.map((product) => (
                  <BasicProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={() => setSelectedProduct(product)}
                    onNavigate={() => navigateProductDetails(product.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BasicAllProducts;
