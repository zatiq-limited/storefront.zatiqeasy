/**
 * ========================================
 * PRODUCTS PAGE RENDERER
 * ========================================
 *
 * Renders products page sections dynamically based on JSON configuration
 * Optimized for Next.js with React Query caching
 */

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Section, Pagination as PaginationType } from "@/lib/types";
import type { Product, ProductFilters } from "@/stores/productsStore";
import ProductCard1 from "@/components/renderers/page-renderer/page-components/products/product-cards/product-card-1";
import ProductCard2 from "@/components/renderers/page-renderer/page-components/products/product-cards/product-card-2";
import ProductCard3 from "@/components/renderers/page-renderer/page-components/products/product-cards/product-card-3";
import ProductCard4 from "@/components/renderers/page-renderer/page-components/products/product-cards/product-card-4";
import ProductCard6 from "@/components/renderers/page-renderer/page-components/products/product-cards/product-card-6";
import ProductCard7 from "@/components/renderers/page-renderer/page-components/products/product-cards/product-card-7";
import ProductCard5 from "@/components/renderers/page-renderer/page-components/products/product-cards/product-card-5";
import ProductCard8 from "@/components/renderers/page-renderer/page-components/products/product-cards/product-card-8";
import ProductCard9 from "@/components/renderers/page-renderer/page-components/products/product-cards/product-card-9";
import ProductCard11 from "@/components/renderers/page-renderer/page-components/products/product-cards/product-card-11";
import ProductCard10 from "@/components/renderers/page-renderer/page-components/products/product-cards/product-card-10";
import ProductCard12 from "@/components/renderers/page-renderer/page-components/products/product-cards/product-card-12";
import ProductCard13 from "@/components/renderers/page-renderer/page-components/products/product-cards/product-card-13";
import ProductCard14 from "@/components/renderers/page-renderer/page-components/products/product-cards/product-card-14";
import ProductCard15 from "@/components/renderers/page-renderer/page-components/products/product-cards/product-card-15";
import ProductCard16 from "@/components/renderers/page-renderer/page-components/products/product-cards/product-card-16";
import ProductsSidebar1 from "@/components/renderers/page-renderer/page-components/products/products-sidebar-1";
import ProductsSidebar2 from "@/components/renderers/page-renderer/page-components/products/products-sidebar-2";
import ProductsPagination1 from "@/components/renderers/page-renderer/page-components/products/products-pagination-1";
import ProductsPagination2 from "@/components/renderers/page-renderer/page-components/products/products-pagination-2";
import ProductsHero1 from "@/components/renderers/page-renderer/page-components/products/products-hero-1";
import ProductsHero2 from "@/components/renderers/page-renderer/page-components/products/products-hero-2";

interface ProductsPageRendererProps {
  sections: Section[];
  products: Product[];
  pagination: PaginationType | null;
  filters: ProductFilters;
  onFiltersChange: (filters: Partial<ProductFilters>) => void;
  isLoading?: boolean;
  className?: string;
}

// Products Layout Component
function ProductsLayout({
  settings = {},
  products,
  filters,
  pagination,
  onFiltersChange,
  isLoading,
}: {
  settings?: Record<string, unknown>;
  products: Product[];
  filters: ProductFilters;
  pagination: PaginationType | null;
  onFiltersChange: (filters: Partial<ProductFilters>) => void;
  isLoading?: boolean;
}) {
  const [currentView, setCurrentView] = useState<"grid" | "list">(
    (settings.default_view as "grid" | "list") || "grid"
  );
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });

  const showSearch = settings.show_search !== false;
  const showSort = settings.show_sort !== false;
  const showViewToggle = settings.show_view_toggle !== false;
  const sticky = settings.sticky !== false;
  const columns = (settings.columns as number) || 4;
  const gap = (settings.gap as number) || 6;
  const cardType = (settings.card_type as string) || "card-1";
  const showSidebar = settings.show_sidebar === true;
  const sidebarPosition = (settings.sidebar_position as string) || "left";
  const sidebarType = (settings.sidebar_type as string) || "products-sidebar-1";
  const paginationType =
    (settings.pagination_type as string) || "products-pagination-1";
  const filterBarBgColor =
    (settings.filter_bar_bg_color as string) || "#FFFFFF";
  const searchBorderColor =
    (settings.search_border_color as string) || "#E5E7EB";
  const sortBorderColor = (settings.sort_border_color as string) || "#E5E7EB";
  const productCountBgColor =
    (settings.product_count_bg_color as string) || "#F3F4F6";
  const productCountTextColor =
    (settings.product_count_text_color as string) || "#111827";
  const paginationActiveColor =
    (settings.pagination_active_color as string) || "#3B82F6";
  const viewToggleActiveBgColor =
    (settings.view_toggle_active_bg_color as string) || "#111827";
  const viewToggleActiveIconColor =
    (settings.view_toggle_active_icon_color as string) || "#FFFFFF";
  const viewToggleInactiveBgColor =
    (settings.view_toggle_inactive_bg_color as string) || "#F3F4F6";
  const viewToggleInactiveIconColor =
    (settings.view_toggle_inactive_icon_color as string) || "#6B7280";
  const cardButtonBgColor =
    (settings.card_button_bg_color as string) || "#3B82F6";
  const cardButtonTextColor =
    (settings.card_button_text_color as string) || "#FFFFFF";
  const sidebarButtonBgColor =
    (settings.sidebar_button_bg_color as string) || "#111827";
  const sidebarButtonTextColor =
    (settings.sidebar_button_text_color as string) || "#FFFFFF";

  // Category change handler
  const handleCategoryChange = (categoryId: string, isSelected: boolean) => {
    setSelectedCategories((prev) => {
      if (isSelected) {
        return [...prev, categoryId];
      } else {
        return prev.filter((id) => id !== categoryId);
      }
    });
    onFiltersChange({ page: 1 });
  };

  // Clear filters handler
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSearchValue("");
    setPriceRange({ min: 0, max: 0 });
    onFiltersChange({ search: null, category: null, page: 1 });
  };

  // Price range change handler
  const handlePriceRangeChange = (newPriceRange: {
    min: number;
    max: number;
  }) => {
    setPriceRange(newPriceRange);
    onFiltersChange({ page: 1 });
  };

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

  const getGridClass = () => {
    const colsMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    };
    return `grid grid-cols-1 sm:grid-cols-2 lg:${
      colsMap[columns] || "grid-cols-4"
    }`;
  };

  // Get the appropriate product card component based on cardType
  const renderProductCard = (product: Product) => {
    const handle = product.product_code?.toLowerCase() || product.id.toString();
    const commonProps = {
      id: product.id,
      handle,
      title: product.name,
      vendor: product.brand,
      price: product.price,
      comparePrice: product.old_price,
      image: product.image_url || "",
      buttonBgColor: cardButtonBgColor,
      buttonTextColor: cardButtonTextColor,
    };

    switch (cardType) {
      case "card-2":
        return <ProductCard2 key={product.id} {...commonProps} />;
      case "card-3":
        return <ProductCard3 key={product.id} {...commonProps} />;
      case "card-4":
        return (
          <ProductCard4
            key={product.id}
            {...commonProps}
            subtitle={product.short_description}
          />
        );
      case "card-5":
        return <ProductCard5 key={product.id} {...commonProps} />;
      case "card-6":
        return (
          <ProductCard6
            key={product.id}
            {...commonProps}
            rating={product.rating || 0}
            reviewCount={product.review_count || 0}
          />
        );
      case "card-7":
        return (
          <ProductCard7
            key={product.id}
            {...commonProps}
            colors={product.colors || []}
          />
        );
      case "card-8":
        return (
          <ProductCard8
            key={product.id}
            {...commonProps}
            rating={product.rating || 0}
          />
        );
      case "card-9":
        return (
          <ProductCard9
            key={product.id}
            {...commonProps}
            badge={product.badge}
          />
        );
      case "card-10":
        return <ProductCard10 key={product.id} {...commonProps} />;
      case "card-11":
        return (
          <ProductCard11
            key={product.id}
            {...commonProps}
            badge={product.badge}
          />
        );
      case "card-12":
        return <ProductCard12 key={product.id} {...commonProps} />;
      case "card-13":
        return <ProductCard13 key={product.id} {...commonProps} />;
      case "card-14":
        return <ProductCard14 key={product.id} {...commonProps} />;
      case "card-15":
        return (
          <ProductCard15
            key={product.id}
            {...commonProps}
            badge={product.badge}
          />
        );
      case "card-16":
        return <ProductCard16 key={product.id} {...commonProps} />;
      case "card-1":
      default:
        return (
          <ProductCard1
            key={product.id}
            {...commonProps}
            subtitle={product.short_description}
          />
        );
    }
  };

  // Render sidebar component
  const renderSidebar = () => {
    const sidebarProps = {
      selectedCategories,
      onCategoryChange: handleCategoryChange,
      onClearFilters: handleClearFilters,
      priceRange,
      onPriceRangeChange: handlePriceRangeChange,
      buttonBgColor: sidebarButtonBgColor,
      buttonTextColor: sidebarButtonTextColor,
    };

    if (sidebarType === "products-sidebar-2") {
      return <ProductsSidebar2 {...sidebarProps} />;
    }
    return <ProductsSidebar1 {...sidebarProps} />;
  };

  // Render pagination component
  const renderPagination = () => {
    if (!pagination || pagination.total_pages <= 1) return null;

    const paginationProps = {
      currentPage: filters.page,
      totalPages: pagination.total_pages,
      from: (filters.page - 1) * (pagination.per_page || 20) + 1,
      to: Math.min(
        filters.page * (pagination.per_page || 20),
        pagination.total
      ),
      total: pagination.total,
      activeColor: paginationActiveColor,
      onPageChange: (page: number) => onFiltersChange({ page }),
    };

    if (paginationType === "products-pagination-2") {
      return <ProductsPagination2 {...paginationProps} />;
    }
    return <ProductsPagination1 {...paginationProps} />;
  };

  const isLeftSidebar = sidebarPosition === "left";

  return (
    <section className="pb-8">
      {/* Filter Bar */}
      {(showSearch || showSort) && (
        <div
          className={`border-b ${sticky ? "sticky top-0 z-40 shadow-sm" : ""}`}
          style={{ backgroundColor: filterBarBgColor }}
        >
          <div className="container mx-auto px-4 2xl:px-0 py-3">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Filter Button and Search */}
              <div className="flex items-center gap-2 flex-1 w-full md:w-auto min-w-0">
                {/* Mobile Filter Button */}
                {showSidebar && (
                  <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="inline-flex lg:hidden items-center justify-center gap-2 h-10 px-3 bg-white rounded-lg hover:bg-gray-50 transition-all shadow-sm border shrink-0"
                    style={{ borderColor: searchBorderColor }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                    <span className="font-medium text-sm">Filters</span>
                  </button>
                )}
                {showSearch && (
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex-1 max-w-md min-w-0"
                  >
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <input
                        type="search"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search products..."
                        className="h-10 w-full pl-9 pr-4 rounded-lg transition-all shadow-sm text-sm border"
                        style={{ borderColor: searchBorderColor }}
                      />
                    </div>
                  </form>
                )}
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end min-w-0">
                {/* Product Count */}
                {pagination && pagination.total > 0 && (
                  <div
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border"
                    style={{ backgroundColor: productCountBgColor }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                    <p
                      className="text-xs font-medium"
                      style={{ color: productCountTextColor }}
                    >
                      <span className="font-bold">{pagination.total}</span>
                      <span className="ml-1">items</span>
                    </p>
                  </div>
                )}

                {/* Sort */}
                {showSort && (
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide hidden md:block">
                      Sort
                    </label>
                    <select
                      value={filters.sort}
                      onChange={handleSortChange}
                      className="h-10 px-3 rounded-lg shadow-sm transition-all text-sm border"
                      style={{ borderColor: sortBorderColor }}
                    >
                      <option value="newest">Newest First</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="name_asc">Name: A to Z</option>
                      <option value="name_desc">Name: Z to A</option>
                    </select>
                  </div>
                )}

                {/* View Toggle */}
                {showViewToggle && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setCurrentView("grid")}
                      className="p-2 rounded-lg transition-all"
                      style={{
                        backgroundColor:
                          currentView === "grid"
                            ? viewToggleActiveBgColor
                            : viewToggleInactiveBgColor,
                        color:
                          currentView === "grid"
                            ? viewToggleActiveIconColor
                            : viewToggleInactiveIconColor,
                      }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentView("list")}
                      className="p-2 rounded-lg transition-all"
                      style={{
                        backgroundColor:
                          currentView === "list"
                            ? viewToggleActiveBgColor
                            : viewToggleInactiveBgColor,
                        color:
                          currentView === "list"
                            ? viewToggleActiveIconColor
                            : viewToggleInactiveIconColor,
                      }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 2xl:px-0 pt-4">
        {/* Main Content with Optional Sidebar */}
        <div
          className={`flex ${showSidebar ? "gap-8" : ""} ${
            !isLeftSidebar && showSidebar ? "flex-row-reverse" : ""
          }`}
        >
          {/* Sidebar - Desktop */}
          {showSidebar && (
            <>
              <div className="w-64 shrink-0 hidden lg:block">
                <div className="sticky top-24">{renderSidebar()}</div>
              </div>

              {/* Mobile Sidebar Overlay */}
              {isMobileSidebarOpen && (
                <>
                  <div
                    className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                  />
                  <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 overflow-y-auto lg:hidden">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Filters</h2>
                        <button
                          onClick={() => setIsMobileSidebarOpen(false)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      {renderSidebar()}
                      <button
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className="w-full mt-4 py-3 bg-gray-900 text-white rounded-lg font-semibold"
                      >
                        Show {products.length} Results
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Products Grid/List */}
          <div className="flex-1 min-w-0">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-4 max-w-md">
                  {filters.search
                    ? `No products match "${filters.search}"`
                    : "No products match your current filters"}
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && products.length > 0 && (
              <>
                {currentView === "grid" ? (
                  <div
                    className={getGridClass()}
                    style={{ gap: `${gap * 4}px` }}
                  >
                    {products.map((product) => renderProductCard(product))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${
                          product.product_code?.toLowerCase() || product.id
                        }`}
                        className="block group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden border"
                      >
                        <div className="flex flex-col sm:flex-row gap-4 p-4">
                          <div className="w-full sm:w-48 h-48 shrink-0 overflow-hidden bg-gray-100 rounded-lg relative">
                            <Image
                              src={product.image_url || ""}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                                {product.name}
                              </h3>
                              {product.short_description && (
                                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                                  {product.short_description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold text-gray-900">
                                ৳{product.price.toLocaleString()}
                              </span>
                              {product.old_price && (
                                <span className="text-lg text-gray-500 line-through">
                                  ৳{product.old_price.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
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

export default function ProductsPageRenderer({
  sections,
  products,
  pagination,
  filters,
  onFiltersChange,
  isLoading = false,
  className = "",
}: ProductsPageRendererProps) {
  const renderSection = (section: Section) => {
    if (section.enabled === false) return null;

    // const settings = convertSettingsKeys(section.settings || {});

    switch (true) {
      case section.type === "products-hero-1":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <ProductsHero1
              settings={section.settings}
              productCount={pagination?.total || products.length}
              searchQuery={filters.search}
              category={filters.category}
            />
          </div>
        );

      case section.type === "products-hero-2":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <ProductsHero2
              settings={section.settings}
              productCount={pagination?.total || products.length}
              searchQuery={filters.search}
              category={filters.category}
            />
          </div>
        );

      case section.type.includes("products-layout"):
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <ProductsLayout
              settings={section.settings}
              products={products}
              filters={filters}
              pagination={pagination}
              onFiltersChange={onFiltersChange}
              isLoading={isLoading}
            />
          </div>
        );

      default:
        if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "development") {
          return (
            <div
              key={section.id}
              className="bg-yellow-50 border border-yellow-200 rounded p-4 my-4"
            >
              <p className="text-yellow-800 font-semibold">
                Component not found: {section.type}
              </p>
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div className={`zatiq-products-page ${className}`}>
      {sections.map(renderSection)}
    </div>
  );
}
