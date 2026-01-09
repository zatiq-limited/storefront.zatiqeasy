/**
 * Products Layout Component
 *
 * Main container for products page with filtering, sorting, and display options.
 * Composed of smaller, focused sub-components for maintainability.
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import FilterBar from "./filter-bar";
import MobileSidebar from "./mobile-sidebar";
import ProductsGrid from "./products-grid";
import ProductsList from "./products-list";
import EmptyState from "./empty-state";
import LoadingState from "./loading-state";
import ProductsSidebar1 from "../products-sidebar-1";
import ProductsSidebar2 from "../products-sidebar-2";
import ProductsPagination1 from "../products-pagination-1";
import ProductsPagination2 from "../products-pagination-2";
import type { ProductsLayoutProps, PriceRange } from "./types";

// Default settings values
const DEFAULT_SETTINGS = {
  default_view: "grid" as const,
  show_search: true,
  show_sort: true,
  show_view_toggle: true,
  sticky: true,
  columns: 4,
  gap: 6,
  card_type: "card-1",
  show_sidebar: false,
  sidebar_position: "left" as const,
  sidebar_type: "products-sidebar-1",
  pagination_type: "products-pagination-1",
  products_per_page: 20,
  // Colors
  filter_bar_bg_color: "#FFFFFF",
  search_border_color: "#E5E7EB",
  sort_border_color: "#E5E7EB",
  product_count_bg_color: "#F3F4F6",
  product_count_text_color: "#111827",
  pagination_active_color: "#3B82F6",
  view_toggle_active_bg_color: "#111827",
  view_toggle_active_icon_color: "#FFFFFF",
  view_toggle_inactive_bg_color: "#F3F4F6",
  view_toggle_inactive_icon_color: "#6B7280",
  card_button_bg_color: "#3B82F6",
  card_button_text_color: "#FFFFFF",
  sidebar_button_bg_color: "#111827",
  sidebar_button_text_color: "#FFFFFF",
};

export default function ProductsLayout({
  settings = {},
  products,
  categories = [],
  filters,
  onFiltersChange,
  isLoading,
}: ProductsLayoutProps) {
  // Merge settings with defaults
  const mergedSettings = { ...DEFAULT_SETTINGS, ...settings };

  // Local state
  const [currentView, setCurrentView] = useState<"grid" | "list">(
    mergedSettings.default_view
  );
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 0 });

  // Calculate max price from products
  const maxPriceLimit = useMemo(() => {
    if (products.length === 0) return 10000;
    const highestPrice = Math.max(...products.map((p) => p.price || 0));
    return Math.ceil(highestPrice / 100) * 100;
  }, [products]);

  // Filter products by selected categories and price range
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategories.length > 0) {
        if (!product.categories || product.categories.length === 0) {
          return false;
        }
        const hasMatchingCategory = product.categories.some((cat) =>
          selectedCategories.includes(String(cat.id))
        );
        if (!hasMatchingCategory) return false;
      }

      // Price filter
      if (priceRange.min > 0 || priceRange.max > 0) {
        const productPrice = product.price || 0;
        if (priceRange.min > 0 && productPrice < priceRange.min) return false;
        if (priceRange.max > 0 && productPrice > priceRange.max) return false;
      }

      return true;
    });
  }, [products, selectedCategories, priceRange]);

  // Pagination calculations
  const currentPage = filters.page || 1;
  const productsPerPage = mergedSettings.products_per_page;
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Handlers
  const handleCategoryChange = useCallback(
    (categoryId: string, isSelected: boolean) => {
      setSelectedCategories((prev) =>
        isSelected
          ? [...prev, categoryId]
          : prev.filter((id) => id !== categoryId)
      );
      onFiltersChange({ page: 1 });
    },
    [onFiltersChange]
  );

  const handleClearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSearchValue("");
    setPriceRange({ min: 0, max: 0 });
    onFiltersChange({ search: null, category: null, page: 1 });
  }, [onFiltersChange]);

  const handlePriceRangeChange = useCallback(
    (newPriceRange: PriceRange) => {
      setPriceRange(newPriceRange);
      onFiltersChange({ page: 1 });
    },
    [onFiltersChange]
  );

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onFiltersChange({ search: searchValue || null, page: 1 });
    },
    [searchValue, onFiltersChange]
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onFiltersChange({ sort: e.target.value, page: 1 });
    },
    [onFiltersChange]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      onFiltersChange({ page });
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    },
    [onFiltersChange]
  );

  // Render sidebar
  const renderSidebar = () => {
    const sidebarProps = {
      categories,
      selectedCategories,
      onCategoryChange: handleCategoryChange,
      onClearFilters: handleClearFilters,
      priceRange,
      maxPriceLimit,
      onPriceRangeChange: handlePriceRangeChange,
      buttonBgColor: mergedSettings.sidebar_button_bg_color,
      buttonTextColor: mergedSettings.sidebar_button_text_color,
    };

    if (mergedSettings.sidebar_type === "products-sidebar-2") {
      return <ProductsSidebar2 {...sidebarProps} />;
    }
    return <ProductsSidebar1 {...sidebarProps} />;
  };

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const paginationProps = {
      currentPage,
      totalPages,
      from: startIndex + 1,
      to: Math.min(endIndex, totalProducts),
      total: totalProducts,
      activeColor: mergedSettings.pagination_active_color,
      onPageChange: handlePageChange,
    };

    if (mergedSettings.pagination_type === "products-pagination-2") {
      return <ProductsPagination2 {...paginationProps} />;
    }
    return <ProductsPagination1 {...paginationProps} />;
  };

  const isLeftSidebar = mergedSettings.sidebar_position === "left";
  const showSidebar = mergedSettings.show_sidebar;

  return (
    <section className="pb-8">
      {/* Filter Bar */}
      <FilterBar
        showSearch={mergedSettings.show_search}
        showSort={mergedSettings.show_sort}
        showViewToggle={mergedSettings.show_view_toggle}
        showSidebar={showSidebar}
        sticky={mergedSettings.sticky}
        currentView={currentView}
        searchValue={searchValue}
        sortValue={filters.sort}
        totalProducts={totalProducts}
        onSearchChange={setSearchValue}
        onSearchSubmit={handleSearchSubmit}
        onSortChange={handleSortChange}
        onViewChange={setCurrentView}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        filterBarBgColor={mergedSettings.filter_bar_bg_color}
        searchBorderColor={mergedSettings.search_border_color}
        sortBorderColor={mergedSettings.sort_border_color}
        productCountBgColor={mergedSettings.product_count_bg_color}
        productCountTextColor={mergedSettings.product_count_text_color}
        viewToggleActiveBgColor={mergedSettings.view_toggle_active_bg_color}
        viewToggleActiveIconColor={mergedSettings.view_toggle_active_icon_color}
        viewToggleInactiveBgColor={mergedSettings.view_toggle_inactive_bg_color}
        viewToggleInactiveIconColor={mergedSettings.view_toggle_inactive_icon_color}
      />

      <div className="container pt-4">
        {/* Main Content with Optional Sidebar */}
        <div
          className={`flex ${showSidebar ? "gap-8" : ""} ${
            !isLeftSidebar && showSidebar ? "flex-row-reverse" : ""
          }`}
        >
          {/* Desktop Sidebar */}
          {showSidebar && (
            <div className="w-64 shrink-0 hidden lg:block">
              <div className="sticky top-24">{renderSidebar()}</div>
            </div>
          )}

          {/* Mobile Sidebar */}
          {showSidebar && (
            <MobileSidebar
              isOpen={isMobileSidebarOpen}
              onClose={() => setIsMobileSidebarOpen(false)}
              resultsCount={filteredProducts.length}
            >
              {renderSidebar()}
            </MobileSidebar>
          )}

          {/* Products Content */}
          <div className="flex-1 min-w-0">
            {/* Loading State */}
            {isLoading && <LoadingState />}

            {/* Empty State */}
            {!isLoading && filteredProducts.length === 0 && (
              <EmptyState
                searchQuery={filters.search}
                hasSelectedCategories={selectedCategories.length > 0}
                onClearFilters={handleClearFilters}
              />
            )}

            {/* Products Display */}
            {!isLoading && filteredProducts.length > 0 && (
              <>
                {currentView === "grid" ? (
                  <ProductsGrid
                    products={paginatedProducts}
                    cardType={mergedSettings.card_type}
                    columns={mergedSettings.columns}
                    gap={mergedSettings.gap}
                    buttonBgColor={mergedSettings.card_button_bg_color}
                    buttonTextColor={mergedSettings.card_button_text_color}
                  />
                ) : (
                  <ProductsList products={paginatedProducts} />
                )}

                {/* Pagination */}
                {renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Re-export types
export type { ProductsLayoutProps, Category } from "./types";
