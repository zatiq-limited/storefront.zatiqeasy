"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useProductsStore,
  selectSearchQuery,
  selectProducts,
  selectFilters,
  getFilteredProducts,
} from "@/stores/productsStore";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface InventorySearchProps {
  className?: string;
}

/**
 * Inventory Search Component
 * Migrated from old project with new Zustand store integration
 */
export function InventorySearch({ className }: InventorySearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get inventory state from Zustand store using selectors
  const searchQuery = useProductsStore(selectSearchQuery);
  const products = useProductsStore(selectProducts);
  const filters = useProductsStore(selectFilters);
  const setSearchQuery = useProductsStore((state) => state.setSearchQuery);
  const setCurrentPage = useProductsStore((state) => state.setCurrentPage);

  // Compute filtered products with useMemo to avoid infinite re-renders
  const filteredProducts = useMemo(
    () => getFilteredProducts(products, filters),
    [products, filters]
  );

  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);

  // Handle search text change
  const setSearch = (search: string) => {
    setSearchQuery(search);
    setCurrentPage(1);

    // Update URL without page reload
    const params = new URLSearchParams(searchParams);

    // Remove specific query params
    params.delete("category");
    params.delete("product");
    params.delete("shopId");

    // Add search param if not empty
    if (search.trim()) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    // Update URL
    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(newUrl, { scroll: false });
  };

  // Clear search
  const onClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);

    // Update URL without search param
    const params = new URLSearchParams(searchParams);
    params.delete("search");

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(newUrl, { scroll: false });
  };

  return (
    <div className={cn("md:block px-2 md:px-6 lg:px-8", className)}>
      <div className="max-w-4xl mx-auto relative">
        {/* Search Input Container */}
        <div
          className={cn(
            "relative group bg-white/80 backdrop-blur-lg rounded-xl transition-all duration-300",
            "ring-1 ring-gray-200 hover:ring-blue-500 dark:hover:ring-blue-400",
            "dark:bg-gray-800/80 dark:ring-gray-700",
            {
              "ring-2 ring-blue-500 dark:ring-blue-400": isSearchInputFocused,
            }
          )}
        >
          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            placeholder="Search items..."
            onFocus={() => setIsSearchInputFocused(true)}
            onBlur={() => setIsSearchInputFocused(false)}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "w-full h-14 pl-6 pr-14 bg-transparent outline-none",
              "text-gray-900 placeholder-gray-400",
              "dark:text-gray-100 dark:placeholder-gray-400",
              "transition-all duration-300"
            )}
            aria-label="Search items"
          />

          {/* Search Controls */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className={cn(
                  "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700",
                  "transition-colors duration-200"
                )}
                aria-label="Clear search"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            )}

            {/* Search Icon */}
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-lg",
                "bg-linear-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700",
                "transition-transform duration-200 hover:scale-105"
              )}
            >
              <Search className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Search Results Count */}
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "item" : "items"} found
          </div>
        )}
      </div>
    </div>
  );
}

// Export as default
export default InventorySearch;
