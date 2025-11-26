import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { getComponent } from "@/lib/component-registry";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SortOption {
  value: string;
  label: string;
}

interface FilterItem {
  id: string;
  name: string;
  count?: number;
  hex?: string;
}

interface Filter {
  id: string;
  title: string;
  type: "category" | "price" | "brand" | "color" | "size";
  items?: FilterItem[];
  min?: number;
  max?: number;
  currency?: string;
}

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
  review_summary?: {
    average_rating: number;
    total_reviews: number;
  };
}

interface ProductsLayout2Props {
  settings?: {
    showSidebar?: boolean;
    sidebarPosition?: "left" | "right";
    showViewToggle?: boolean;
    defaultView?: "grid" | "list";
    columns?: number;
    columnsTablet?: number;
    columnsMobile?: number;
    gap?: number;
    cardStyle?: string;
    showSearch?: boolean;
    showSort?: boolean;
    sticky?: boolean;
    sortOptions?: SortOption[];
  };
  sidebar?: {
    type?: string;
    settings?: {
      collapsible?: boolean;
    };
    filters?: Filter[];
  };
  products?: Product[];
  currency?: string;
  currentSort?: string;
  currentSearch?: string;
  productCount?: number;
  onSortChange?: (sort: string) => void;
  onSearchChange?: (search: string) => void;
}

const ProductsLayout2: React.FC<ProductsLayout2Props> = ({
  settings = {},
  sidebar,
  products = [],
  currency = "BDT",
  currentSort = "featured",
  currentSearch = "",
  productCount = 0,
  onSortChange,
  onSearchChange,
}) => {
  const {
    showSidebar = true,
    sidebarPosition = "left",
    showViewToggle = true,
    defaultView = "grid",
    columns = 3,
    columnsTablet = 2,
    columnsMobile = 1,
    gap = 6,
    cardStyle = "product-card-1",
    showSearch = true,
    showSort = true,
    sticky = true,
    sortOptions = [],
  } = settings;

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"grid" | "list">(defaultView);
  const [searchValue, setSearchValue] = useState(currentSearch);

  useEffect(() => {
    setCurrentView(defaultView);
  }, [defaultView]);

  // Handle sort change
  const handleSortChange = (value: string) => {
    if (onSortChange) {
      onSortChange(value);
    } else {
      const url = new URL(window.location.href);
      url.searchParams.set("sort", value);
      window.location.href = url.toString();
    }
  };

  // Handle search
  const handleSearch = () => {
    if (onSearchChange) {
      onSearchChange(searchValue);
    } else {
      const url = new URL(window.location.href);
      if (searchValue) {
        url.searchParams.set("search", searchValue);
      } else {
        url.searchParams.delete("search");
      }
      url.searchParams.delete("page");
      window.location.href = url.toString();
    }
  };

  // Get sidebar component dynamically
  const SidebarComponent = sidebar?.type ? getComponent(sidebar.type) : null;

  // Get product card component dynamically
  const ProductCard = getComponent(cardStyle);

  // Map product data to card props
  const mapProductToCardProps = (product: Product) => {
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
      badgeColor: "#7C3AED",
      rating: product.review_summary?.average_rating,
      reviewCount: product.review_summary?.total_reviews,
      quickAddEnabled: product.quantity > 0,
    };
  };

  // Generate responsive grid class
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
    const desktopClass = colsMap[columns] || "grid-cols-3";

    return `grid ${mobileClass} sm:${tabletClass} lg:${desktopClass}`;
  };

  // Render products
  const renderProducts = () => {
    if (products.length === 0) {
      return (
        <div className="text-center py-24 px-6">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl flex items-center justify-center shadow-lg">
            <svg className="w-16 h-16 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">No Products Found</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
            We couldn't find what you're looking for. Try different filters or browse our collections.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => window.location.href = "/products"}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Reset Filters
            </button>
            <a
              href="/"
              className="px-8 py-4 bg-white text-gray-700 rounded-full font-semibold border-2 border-gray-200 hover:border-purple-300 hover:text-purple-600 transition-all"
            >
              Go Home
            </a>
          </div>
        </div>
      );
    }

    // List View - Horizontal Cards with gradient accent
    if (currentView === "list") {
      return (
        <div className="space-y-5">
          {products.map((product) => {
            const props = mapProductToCardProps(product);
            return (
              <a
                key={product.id}
                href={`/products/${product.product_code?.toLowerCase() || product.id}`}
                className="group flex flex-col md:flex-row gap-5 bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-xl hover:shadow-purple-100/50"
              >
                {/* Image with gradient overlay */}
                <div className="relative w-full md:w-48 h-44 md:h-auto shrink-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  <img
                    src={props.image}
                    alt={props.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  {props.badge && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      {props.badge}
                    </div>
                  )}
                  {/* Quick view overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-900 shadow-lg">
                      Quick View
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    {props.vendor && (
                      <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 text-xs font-semibold rounded-full mb-3">
                        {props.vendor}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {props.title}
                    </h3>
                    {props.subtitle && (
                      <p className="text-gray-500 line-clamp-2 mb-4">
                        {props.subtitle}
                      </p>
                    )}
                    {/* Rating */}
                    {props.rating && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(props.rating!) ? "text-yellow-400" : "text-gray-200"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">({props.reviewCount})</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        {currency} {props.price?.toLocaleString()}
                      </span>
                      {props.comparePrice && (
                        <span className="text-base text-gray-400 line-through">
                          {currency} {props.comparePrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-purple-600 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      );
    }

    // Grid View
    if (ProductCard) {
      return (
        <div
          className={getGridClass()}
          style={{ gap: `${gap * 4}px` }}
        >
          {products.map((product) => (
            <a
              key={product.id}
              href={`/products/${product.product_code?.toLowerCase() || product.id}`}
              className="block group"
            >
              <ProductCard {...mapProductToCardProps(product)} />
            </a>
          ))}
        </div>
      );
    }

    // Fallback grid with modern card design
    return (
      <div
        className={getGridClass()}
        style={{ gap: `${gap * 4}px` }}
      >
        {products.map((product) => {
          const props = mapProductToCardProps(product);
          return (
            <a
              key={product.id}
              href={`/products/${product.product_code?.toLowerCase() || product.id}`}
              className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-xl hover:shadow-purple-100/50 transform hover:-translate-y-1"
            >
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                {props.badge && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {props.badge}
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <button className="px-6 py-2.5 bg-white text-gray-900 rounded-full text-sm font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Quick Add
                  </button>
                </div>
              </div>
              <div className="p-5">
                {props.vendor && (
                  <p className="text-xs text-purple-600 font-semibold mb-1 uppercase tracking-wider">
                    {props.vendor}
                  </p>
                )}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {currency} {product.price.toLocaleString()}
                  </span>
                  {props.comparePrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {currency} {props.comparePrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    );
  };

  return (
    <section className="pb-10 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Filter Bar - Professional Design */}
      {(showSearch || showSort) && (
        <div
          className={cn(
            "border-b border-border/40 bg-gradient-to-r from-background/98 to-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/90",
            sticky && "sticky top-0 z-40 shadow-[0_1px_3px_0_rgb(0_0_0_/0.05)]"
          )}
        >
          <div className="max-w-[1440px] mx-auto px-4 2xl:px-0 py-3">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Left - Search and Filter Button */}
              <div className="flex items-center gap-2 flex-1 w-full md:w-auto min-w-0">
                {showSidebar && (
                  <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="lg:hidden inline-flex items-center justify-center gap-2 h-10 px-3 bg-gradient-to-b from-background to-muted/30 text-foreground rounded-lg hover:bg-muted/50 transition-all shadow-sm border border-border/50 hover:border-border shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <span className="font-medium text-sm">Filters</span>
                  </button>
                )}

                {showSearch && (
                  <div className="relative flex-1 max-w-md min-w-0 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <Input
                      type="search"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="Search products..."
                      className="h-10 pl-9 pr-4 bg-background/50 border-border/50 hover:border-border focus:border-primary/50 transition-all shadow-sm"
                    />
                  </div>
                )}
              </div>

              {/* Right - Product Count, Sort and View Toggle */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end min-w-0">
                {/* Product Count Badge */}
                {productCount > 0 && (
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-md border border-border/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <p className="text-xs font-medium text-foreground">
                      <span className="font-bold">{productCount}</span>
                      <span className="text-muted-foreground ml-1">items</span>
                    </p>
                  </div>
                )}

                {/* Sort Dropdown */}
                {showSort && sortOptions.length > 0 && (
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:block">
                      Sort
                    </label>
                    <Select value={currentSort} onValueChange={handleSortChange}>
                      <SelectTrigger className="h-10 w-[140px] sm:w-[160px] bg-background/50 border-border/50 hover:border-border shadow-sm transition-all">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent className="min-w-[160px]">
                        {sortOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-sm"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* View Toggle */}
                {showViewToggle && (
                  <div className="flex p-1 bg-muted/50 rounded-lg border border-border/30 shrink-0">
                    <button
                      onClick={() => setCurrentView("grid")}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                        currentView === "grid"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      <span className="hidden sm:inline">Grid</span>
                    </button>
                    <button
                      onClick={() => setCurrentView("list")}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                        currentView === "list"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="hidden sm:inline">List</span>
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
        <div className={`flex gap-8 ${sidebarPosition === "right" ? "flex-row-reverse" : ""}`}>
          {/* Sidebar - Dark theme with gradient */}
          {showSidebar && sidebar && (
            <>
              <div className="hidden lg:block w-72 shrink-0">
                <div className="sticky top-6">
                  {SidebarComponent ? (
                    <SidebarComponent settings={sidebar.settings} blocks={sidebar.filters} />
                  ) : (
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-2xl">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold">Filters</h3>
                        <button className="text-xs text-purple-400 hover:text-purple-300 font-medium">
                          Clear All
                        </button>
                      </div>
                      {sidebar.filters?.map((filter, index) => (
                        <div key={filter.id} className={`${index !== 0 ? "pt-5 mt-5 border-t border-gray-700" : ""}`}>
                          <h4 className="font-semibold text-sm mb-3 text-gray-300 uppercase tracking-wider">
                            {filter.title}
                          </h4>
                          {filter.type === "color" && filter.items ? (
                            <div className="flex flex-wrap gap-2">
                              {filter.items.map((item) => (
                                <button
                                  key={item.id}
                                  className="w-8 h-8 rounded-full border-2 border-gray-600 hover:border-purple-400 transition-colors relative group"
                                  style={{ backgroundColor: item.hex }}
                                  title={item.name}
                                >
                                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {item.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          ) : filter.items ? (
                            <ul className="space-y-2">
                              {filter.items.map((item) => (
                                <li key={item.id}>
                                  <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                      type="checkbox"
                                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-800"
                                    />
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors flex-1">
                                      {item.name}
                                    </span>
                                    <span className="text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded-full">
                                      {item.count}
                                    </span>
                                  </label>
                                </li>
                              ))}
                            </ul>
                          ) : filter.type === "price" ? (
                            <div className="space-y-4">
                              <div className="flex gap-3">
                                <input
                                  type="number"
                                  placeholder="Min"
                                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                />
                                <input
                                  type="number"
                                  placeholder="Max"
                                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                />
                              </div>
                              <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
                                Apply
                              </button>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Sidebar - Slide from right with dark theme */}
              {isMobileSidebarOpen && (
                <>
                  <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    onClick={() => setIsMobileSidebarOpen(false)}
                  />
                  <div className="lg:hidden fixed inset-y-0 right-0 w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 z-50 overflow-y-auto shadow-2xl">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white">Filters</h2>
                        <button
                          onClick={() => setIsMobileSidebarOpen(false)}
                          className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      {SidebarComponent ? (
                        <SidebarComponent settings={sidebar.settings} blocks={sidebar.filters} />
                      ) : (
                        <div className="space-y-6">
                          {sidebar.filters?.map((filter) => (
                            <div key={filter.id} className="pb-6 border-b border-gray-700 last:border-0">
                              <h4 className="font-semibold text-sm mb-4 text-gray-300 uppercase tracking-wider">
                                {filter.title}
                              </h4>
                              {filter.items && (
                                <ul className="space-y-3">
                                  {filter.items.map((item) => (
                                    <li key={item.id}>
                                      <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500"
                                        />
                                        <span className="text-gray-300 flex-1">{item.name}</span>
                                        <span className="text-xs text-gray-500">({item.count})</span>
                                      </label>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-8 flex gap-3">
                        <button
                          onClick={() => setIsMobileSidebarOpen(false)}
                          className="flex-1 py-4 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                        >
                          Clear All
                        </button>
                        <button
                          onClick={() => setIsMobileSidebarOpen(false)}
                          className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
                        >
                          Show {products.length} Results
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Products */}
          <div className="flex-1 min-w-0">{renderProducts()}</div>
        </div>
      </div>
    </section>
  );
};

export default ProductsLayout2;
