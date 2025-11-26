import React, { useState } from "react";
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

interface ProductsLayout1Props {
  settings?: {
    showSidebar?: boolean;
    sidebarPosition?: "left" | "right";
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

const ProductsLayout1: React.FC<ProductsLayout1Props> = ({
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
  const [searchValue, setSearchValue] = useState(currentSearch);

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
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      badgeColor: "#F55157",
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

  // Render products grid
  const renderProducts = () => {
    if (products.length === 0) {
      return (
        <div className="text-center py-20 bg-white rounded-xl">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-6 text-2xl font-semibold text-gray-900">
            No products found
          </h3>
          <p className="mt-2 text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      );
    }

    // Grid View with dynamic card
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
              className="block"
            >
              <ProductCard {...mapProductToCardProps(product)} />
            </a>
          ))}
        </div>
      );
    }

    // Fallback grid
    return (
      <div
        className={getGridClass()}
        style={{ gap: `${gap * 4}px` }}
      >
        {products.map((product) => (
          <a
            key={product.id}
            href={`/products/${product.product_code?.toLowerCase() || product.id}`}
            className="block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden"
          >
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>
              <span className="text-lg font-bold">
                {currency} {product.price.toLocaleString()}
              </span>
            </div>
          </a>
        ))}
      </div>
    );
  };

  return (
    <section className="pb-8 bg-gray-50">
      {/* Filter Bar - Shadcn Design */}
      {(showSearch || showSort) && (
        <div
          className={cn(
            "border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm",
            sticky && "sticky top-0 z-40"
          )}
        >
          <div className="max-w-[1440px] mx-auto px-4 2xl:px-0 py-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Left - Search and Filter Button */}
              <div className="flex items-center gap-3 flex-1 w-full md:w-auto">
                {showSidebar && (
                  <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="font-medium text-sm">Filters</span>
                  </button>
                )}

                {showSearch && (
                  <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="search"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search products..."
                        className="pl-9"
                      />
                    </div>
                  </form>
                )}
              </div>

              {/* Right - Product Count and Sort */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                {/* Product Count */}
                {productCount > 0 && (
                  <p className="text-sm text-muted-foreground hidden sm:block">
                    <span className="font-semibold text-foreground">{productCount}</span> products
                  </p>
                )}

                {/* Sort */}
                {showSort && sortOptions.length > 0 && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-foreground hidden sm:block">
                      Sort by:
                    </label>
                    <Select value={currentSort} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-[150px] sm:w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
          {/* Sidebar */}
          {showSidebar && sidebar && (
            <>
              <div className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-24">
                  {SidebarComponent ? (
                    <SidebarComponent settings={sidebar.settings} blocks={sidebar.filters} />
                  ) : (
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <h3 className="font-semibold mb-4">Filters</h3>
                      {sidebar.filters?.map((filter) => (
                        <div key={filter.id} className="mb-4">
                          <h4 className="font-medium text-sm mb-2">{filter.title}</h4>
                          {filter.items && (
                            <ul className="space-y-1">
                              {filter.items.map((item) => (
                                <li key={item.id} className="text-sm text-gray-600">
                                  {item.name} ({item.count})
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      {SidebarComponent ? (
                        <SidebarComponent settings={sidebar.settings} blocks={sidebar.filters} />
                      ) : (
                        sidebar.filters?.map((filter) => (
                          <div key={filter.id} className="mb-4">
                            <h4 className="font-medium text-sm mb-2">{filter.title}</h4>
                            {filter.items && (
                              <ul className="space-y-1">
                                {filter.items.map((item) => (
                                  <li key={item.id} className="text-sm text-gray-600">
                                    {item.name} ({item.count})
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))
                      )}
                      <button
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className="w-full mt-4 py-3 bg-gray-900 text-white rounded-lg font-semibold"
                      >
                        Show Results
                      </button>
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

export default ProductsLayout1;
