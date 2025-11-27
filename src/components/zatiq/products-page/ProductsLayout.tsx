import React, { useState, useMemo } from "react";
import { getComponent } from "@/lib/component-registry";

interface Product {
  id: number;
  name: string;
  product_code?: string;
  price: number;
  old_price?: number | null;
  image_url: string;
  images?: string[];
  brand?: string;
  quantity: number;
  short_description?: string;
  categories?: Array<{ id: number | string; name: string }>;
  review_summary?: {
    average_rating: number;
    total_reviews: number;
  };
}

interface Category {
  id: number | string;
  name: string;
  products_count?: number;
  sub_categories?: Category[];
}

interface ProductsLayoutProps {
  // Sidebar settings
  showSidebar?: boolean;
  sidebarPosition?: "left" | "right";
  sidebarType?: string;

  // Pagination settings
  showPagination?: boolean;
  paginationType?: string;

  // Grid settings
  columns?: number;
  columnsTablet?: number;
  columnsMobile?: number;
  gap?: number;
  cardType?: string;

  // Filter bar settings
  showSearch?: boolean;
  showSort?: boolean;
  showViewToggle?: boolean;
  defaultView?: "grid" | "list";
  sticky?: boolean;

  // Colors
  filterBarBgColor?: string;
  searchBorderColor?: string;
  sortBorderColor?: string;
  productCountBgColor?: string;
  productCountTextColor?: string;

  // Font settings
  searchFontFamily?: string;
  searchFontSize?: string;
  sortFontFamily?: string;
  sortFontSize?: string;
  productCountFontFamily?: string;
  productCountFontSize?: string;

  // Data
  products?: Product[];
  productCount?: number;
  currentSort?: string;
  currentSearch?: string;
  productsPerPage?: number;
  categories?: Category[];
  currency?: string;

  // Settings object (from JSON)
  settings?: any;
}

const ProductsLayout: React.FC<ProductsLayoutProps> = (props) => {
  // Extract settings from props or settings object
  const {
    showSidebar = props.settings?.showSidebar ?? true,
    sidebarPosition = props.settings?.sidebarPosition ?? "left",
    sidebarType = props.settings?.sidebarType ?? "products-sidebar-1",
    showPagination = props.settings?.showPagination ?? true,
    paginationType = props.settings?.paginationType ?? "products-pagination-1",
    columns = props.settings?.columns ?? 4,
    columnsTablet = props.settings?.columnsTablet ?? 2,
    columnsMobile = props.settings?.columnsMobile ?? 2,
    gap = props.settings?.gap ?? 6,
    cardType = props.settings?.cardType ?? "card-1",
    showSearch = props.settings?.showSearch ?? true,
    showSort = props.settings?.showSort ?? true,
    showViewToggle = props.settings?.showViewToggle ?? true,
    defaultView = props.settings?.defaultView ?? "grid",
    sticky = props.settings?.sticky ?? true,
    filterBarBgColor = props.settings?.filterBarBgColor ?? "#FFFFFF",
    searchBorderColor = props.settings?.searchBorderColor ?? "#E5E7EB",
    sortBorderColor = props.settings?.sortBorderColor ?? "#E5E7EB",
    productCountBgColor = props.settings?.productCountBgColor ?? "#F3F4F6",
    productCountTextColor = props.settings?.productCountTextColor ?? "#111827",
    searchFontFamily = props.settings?.searchFontFamily ?? "inherit",
    searchFontSize = props.settings?.searchFontSize ?? "text-sm",
    sortFontFamily = props.settings?.sortFontFamily ?? "inherit",
    sortFontSize = props.settings?.sortFontSize ?? "text-sm",
    productCountFontFamily = props.settings?.productCountFontFamily ?? "inherit",
    productCountFontSize = props.settings?.productCountFontSize ?? "text-xs",
    productsPerPage = props.settings?.productsPerPage ?? 20,
    currency = props.currency ?? "BDT",
  } = props;

  const products = props.products ?? [];
  const categories = props.categories ?? [];

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(props.currentSearch ?? "");
  const [currentView, setCurrentView] = useState<"grid" | "list">(defaultView);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<(string | number)[]>([]);
  const [sortValue, setSortValue] = useState(props.currentSort ?? "featured");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });

  // Get sidebar component dynamically
  const SidebarComponent = getComponent(sidebarType);

  // Get pagination component dynamically
  const PaginationComponent = getComponent(paginationType);

  // Get product card component dynamically
  const cardComponentType = `product-card-${cardType.replace("card-", "")}`;
  const CardComponent = getComponent(cardComponentType);

  // Handle category selection/deselection
  const handleCategoryChange = (categoryId: string | number, isSelected: boolean) => {
    setSelectedCategories((prev) => {
      if (isSelected) {
        return [...prev, categoryId];
      } else {
        return prev.filter((id) => id !== categoryId);
      }
    });
    setCurrentPage(1);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSearchValue("");
    setPriceRange({ min: 0, max: 0 });
    setCurrentPage(1);
  };

  // Handle price range change
  const handlePriceRangeChange = (newPriceRange: { min: number; max: number }) => {
    setPriceRange(newPriceRange);
    setCurrentPage(1);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortValue(e.target.value);
    setCurrentPage(1);
  };

  const isLeftSidebar = sidebarPosition === "left";

  // Grid class generation
  const getGridClass = () => {
    const colsMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    };
    const mobileClass = colsMap[columnsMobile] || "grid-cols-1";
    const tabletClass = colsMap[columnsTablet] || "grid-cols-2";
    const desktopClass = colsMap[columns] || "grid-cols-4";

    return `grid ${mobileClass} md:${tabletClass} lg:${desktopClass}`;
  };

  const getSearchFontStyle = (): React.CSSProperties => {
    return searchFontFamily !== "inherit" ? { fontFamily: searchFontFamily } : {};
  };

  const getSortFontStyle = (): React.CSSProperties => {
    return sortFontFamily !== "inherit" ? { fontFamily: sortFontFamily } : {};
  };

  const getProductCountFontStyle = (): React.CSSProperties => {
    return productCountFontFamily !== "inherit"
      ? { fontFamily: productCountFontFamily, color: productCountTextColor }
      : { color: productCountTextColor };
  };

  // Transform product for card component
  const transformProduct = (product: Product) => {
    let badge: string | undefined;
    if (product.old_price && product.old_price > product.price) {
      const discount = Math.round(
        ((product.old_price - product.price) / product.old_price) * 100
      );
      badge = `${discount}% OFF`;
    }

    return {
      id: product.id,
      handle: product.product_code?.toLowerCase() || String(product.id),
      title: product.name,
      subtitle: product.short_description,
      vendor: product.brand,
      price: product.price,
      comparePrice: product.old_price,
      currency: currency,
      image: product.image_url,
      hoverImage: product.images?.[1],
      badge: badge,
      badgeColor: "#F55157",
      rating: product.review_summary?.average_rating,
      reviewCount: product.review_summary?.total_reviews,
      quickAddEnabled: product.quantity > 0,
      categories: product.categories,
    };
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.map(transformProduct);

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      result = result.filter((product) => {
        if (product.categories && product.categories.length > 0) {
          return product.categories.some(
            (cat: any) =>
              selectedCategories.includes(cat.id?.toString()) ||
              selectedCategories.includes(cat.id)
          );
        }
        return false;
      });
    }

    // Filter by search query
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase().trim();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          (product.vendor && product.vendor.toLowerCase().includes(searchLower))
      );
    }

    // Filter by price range
    if (priceRange.min > 0 || priceRange.max > 0) {
      result = result.filter((product) => {
        const price = product.price;
        const minCheck = priceRange.min > 0 ? price >= priceRange.min : true;
        const maxCheck = priceRange.max > 0 ? price <= priceRange.max : true;
        return minCheck && maxCheck;
      });
    }

    // Sort products
    switch (sortValue) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Keep original order for "featured"
        break;
    }

    return result;
  }, [products, selectedCategories, searchValue, priceRange, sortValue]);

  // Pagination
  const totalProducts = filteredAndSortedProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const displayProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="pb-8">
      {/* Filter Bar */}
      {(showSearch || showSort) && (
        <div
          className={`border-b ${sticky ? "sticky top-0 z-40 shadow-sm" : ""}`}
          style={{
            backgroundColor: filterBarBgColor,
            borderColor: "#E5E7EB",
          }}
        >
          <div className="max-w-[1440px] mx-auto px-4 2xl:px-0 py-3">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Left - Search and Filter Button */}
              <div className="flex items-center gap-2 flex-1 w-full md:w-auto min-w-0">
                {showSidebar && (
                  <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="lg:hidden inline-flex items-center justify-center gap-2 h-10 px-3 bg-white rounded-lg hover:bg-gray-50 transition-all shadow-sm border shrink-0"
                    style={{ borderColor: searchBorderColor }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                    <span className={`font-medium ${searchFontSize}`} style={getSearchFontStyle()}>
                      Filters
                    </span>
                  </button>
                )}

                {showSearch && (
                  <form onSubmit={(e) => e.preventDefault()} className="flex-1 max-w-md min-w-0">
                    <div className="relative group">
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
                        onChange={handleSearchChange}
                        placeholder="Search products..."
                        className={`h-10 w-full pl-9 pr-4 rounded-lg transition-all shadow-sm ${searchFontSize}`}
                        style={{
                          borderWidth: "1px",
                          borderColor: searchBorderColor,
                          backgroundColor: "#FFFFFF",
                          ...getSearchFontStyle(),
                        }}
                      />
                    </div>
                  </form>
                )}
              </div>

              {/* Right - Product Count and Sort */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end min-w-0">
                {/* Product Count Badge */}
                {totalProducts > 0 && (
                  <div
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border"
                    style={{
                      backgroundColor: productCountBgColor,
                      borderColor: "#E5E7EB",
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                    <p className={`${productCountFontSize} font-medium`} style={getProductCountFontStyle()}>
                      <span className="font-bold">{totalProducts}</span>
                      <span className="text-gray-500 ml-1">items</span>
                    </p>
                  </div>
                )}

                {/* Sort Dropdown */}
                {showSort && (
                  <div className="flex items-center gap-2 shrink-0">
                    <label
                      className={`${sortFontSize} font-semibold text-gray-500 uppercase tracking-wide hidden md:block`}
                      style={getSortFontStyle()}
                    >
                      Sort
                    </label>
                    <select
                      value={sortValue}
                      onChange={handleSortChange}
                      className={`h-10 px-3 rounded-lg shadow-sm transition-all ${sortFontSize}`}
                      style={{
                        borderWidth: "1px",
                        borderColor: sortBorderColor,
                        backgroundColor: "#FFFFFF",
                        ...getSortFontStyle(),
                      }}
                    >
                      <option value="featured">Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                      <option value="rating">Top Rated</option>
                    </select>
                  </div>
                )}

                {/* View Toggle */}
                {showViewToggle && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setCurrentView("grid")}
                      className={`p-2 rounded-lg transition-all ${
                        currentView === "grid"
                          ? "bg-gray-900 text-white"
                          : "hover:bg-gray-100 text-gray-500"
                      }`}
                      aria-label="Grid view"
                      title="Grid view"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className={`p-2 rounded-lg transition-all ${
                        currentView === "list"
                          ? "bg-gray-900 text-white"
                          : "hover:bg-gray-100 text-gray-500"
                      }`}
                      aria-label="List view"
                      title="List view"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0 pt-4">
        {/* Main Content */}
        <div className={`flex gap-8 ${!isLeftSidebar ? "flex-row-reverse" : ""}`}>
          {/* Sidebar */}
          {showSidebar && (
            <>
              <div className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-24">
                  {SidebarComponent ? (
                    <SidebarComponent
                      categories={categories}
                      selectedCategories={selectedCategories}
                      onCategoryChange={handleCategoryChange}
                      onClearFilters={handleClearFilters}
                      priceRange={priceRange}
                      onPriceRangeChange={handlePriceRangeChange}
                    />
                  ) : (
                    <div className="bg-white rounded-xl p-4 shadow-sm border">
                      <h3 className="font-semibold mb-4">Filters</h3>
                      <p className="text-sm text-gray-500">Sidebar component not found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Sidebar */}
              {isMobileSidebarOpen && (
                <>
                  <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-50"
                    onClick={() => setIsMobileSidebarOpen(false)}
                  />
                  <div className="lg:hidden fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 overflow-y-auto">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Filters</h2>
                        <button
                          onClick={() => setIsMobileSidebarOpen(false)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      {SidebarComponent && (
                        <SidebarComponent
                          categories={categories}
                          selectedCategories={selectedCategories}
                          onCategoryChange={handleCategoryChange}
                          onClearFilters={handleClearFilters}
                          priceRange={priceRange}
                          onPriceRangeChange={handlePriceRangeChange}
                        />
                      )}
                      <button
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className="w-full mt-4 py-3 bg-gray-900 text-white rounded-lg font-semibold"
                      >
                        Show {totalProducts} Results
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Products Grid/List */}
          <div className="flex-1 min-w-0">
            {/* No Results Message */}
            {displayProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4 max-w-md">
                  {searchValue ? `No products match "${searchValue}"` : "No products match your current filters"}
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : currentView === "grid" ? (
              <div className={getGridClass()} style={{ gap: `${gap * 4}px` }}>
                {displayProducts.map((product) => (
                  <a
                    key={product.id}
                    href={`/products/${product.handle}`}
                    className="block"
                  >
                    {CardComponent ? (
                      <CardComponent {...product} />
                    ) : (
                      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden">
                        <div className="aspect-square overflow-hidden bg-gray-100">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
                          <span className="text-lg font-bold">
                            {currency} {product.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </a>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {displayProducts.map((product) => (
                  <a
                    key={product.id}
                    href={`/products/${product.handle}`}
                    className="block group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 p-4">
                      <div className="w-full sm:w-48 h-48 shrink-0 overflow-hidden bg-gray-100 rounded-lg relative">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {product.badge && (
                          <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2 text-lg">{product.title}</h3>
                          {product.rating && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(product.rating || 0) ? "text-yellow-400" : "text-gray-300"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">({product.reviewCount || 0} reviews)</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-gray-900">
                              {currency} {product.price.toLocaleString()}
                            </span>
                            {product.comparePrice && (
                              <span className="text-lg text-gray-500 line-through">
                                {currency} {product.comparePrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* Pagination */}
            {showPagination && totalPages > 1 && PaginationComponent && (
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                from={startIndex + 1}
                to={Math.min(endIndex, totalProducts)}
                total={totalProducts}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsLayout;
