"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/stores/productsStore";
import { useProductsStore } from "@/stores/productsStore";
import { useShopStore } from "@/stores/shopStore";
import { Pagination } from "@/components/pagination";
import { ProductSkeleton } from "@/components/shared/skeletons/product-skeleton";
import { BasicProductCard } from "@/components/products/basic-product-card";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import { AlertCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { ROUTES } from "@/lib/constants";

// Constants
const MAX_PRODUCTS_PER_PAGE = 12;

/**
 * Inventory Products Component
 * Displays product grid with sorting and pagination
 */
export function InventoryProducts() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get inventory state using direct selectors (avoiding getter issues)
  const products = useProductsStore((state) => state.products);
  const filters = useProductsStore((state) => state.filters);
  const isLoading = useProductsStore((state) => state.isLoading);
  const setFilters = useProductsStore((state) => state.setFilters);
  const categories = useProductsStore((state) => state.categories);

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
  }, [selectedCategory, filters.category, setFilters]);

  // Get current category name from filters
  const currentCategoryName = useMemo(() => {
    if (!filters.category) return null;
    const category = categories.find(
      (cat) => String(cat.id) === String(filters.category)
    );
    return category?.name || null;
  }, [filters.category, categories]);

  // Compute filtered products in the component
  const { filteredProducts, totalPages, currentPage, sortOption } =
    useMemo(() => {
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

      // Apply sorting
      switch (filters.sort) {
        case "price-asc":
          filtered = filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          filtered = filtered.sort((a, b) => b.price - a.price);
          break;
        case "name-asc":
          filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }

      return {
        filteredProducts: filtered,
        totalPages: Math.ceil(filtered.length / MAX_PRODUCTS_PER_PAGE),
        currentPage: filters.page,
        sortOption: filters.sort,
      };
    }, [products, filters]);

  // Setters
  const setCurrentPage = (page: number) => setFilters({ page });
  const setSortOption = (sort: string) => setFilters({ sort, page: 1 });

  // Get shop details for base URL
  const { shopDetails } = useShopStore();
  const baseUrl = shopDetails?.baseUrl || "";

  // Navigate to product details
  const navigateProductDetails = (id: string | number) => {
    // Use baseUrl if available (for merchant routes), otherwise use default route
    const productUrl = baseUrl
      ? `${baseUrl}/products/${id}`
      : ROUTES.PRODUCT_DETAIL(String(id));
    router.push(productUrl);
  };

  // Handle sort change
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  // Get current page products
  const currentProducts = useMemo(() => {
    if (!filteredProducts || !Array.isArray(filteredProducts)) {
      return [];
    }
    const start = (currentPage - 1) * MAX_PRODUCTS_PER_PAGE;
    const end = start + MAX_PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  return (
    <>
      <div className="space-y-6">
        {filteredProducts && filteredProducts.length > 0 ? (
          <div>
            {/* Header with category name and sort */}
            <div className="px-4 h-13.75 bg-white dark:bg-gray-800 rounded-xl mb-3 border border-gray-200 dark:border-gray-600 flex items-center justify-between">
              <h2 className="font-medium text-gray-900 dark:text-gray-300 truncate w-[45%]">
                {currentCategoryName || "All Products"}
              </h2>
              <div className="text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2">
                <span className="min-w-fit">Sort by:</span>
                <select
                  onChange={handleSort}
                  value={sortOption}
                  className="border border-gray-300 rounded-lg px-2 py-2 text-sm w-32 bg-transparent dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Default</option>
                  <option value="price-asc">Price (Low &gt; High)</option>
                  <option value="price-desc">Price (High &gt; Low)</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-4">
              <AnimatePresence mode="wait">
                {currentProducts.map((product) => (
                  <BasicProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    old_price={product.old_price}
                    image_url={product.image_url}
                    images={product.images}
                    variant_types={product.variant_types}
                    quantity={product.quantity}
                    has_variant={product.has_variant}
                    onNavigate={() => navigateProductDetails(product.id)}
                    onSelectProduct={() => setSelectedProduct(product)}
                  />
                ))}
              </AnimatePresence>
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
        ) : (
          <div>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(12)].map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 mt-30 text-sm text-gray-600 dark:text-gray-400 max-w-46 mx-auto">
                <AlertCircle className="w-12 h-12 text-gray-400" />
                <p className="text-center tracking-[-0.56px]">
                  No item is currently available in this category. Hope we can
                  add it soon.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Variant Selector Modal */}
        <VariantSelectorModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
        />
      </div>
    </>
  );
}

// Export as default
export default InventoryProducts;
