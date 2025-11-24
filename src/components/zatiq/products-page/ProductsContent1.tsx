import React, { useState, useEffect } from "react";
import { getComponent } from "@/lib/component-registry";

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

interface ProductsContent1Props {
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
}

const ProductsContent1: React.FC<ProductsContent1Props> = ({
  settings = {},
  sidebar,
  products = [],
  currency = "BDT",
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
  } = settings;

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"grid" | "list">(defaultView);

  useEffect(() => {
    setCurrentView(defaultView);
  }, [defaultView]);

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

  // Render product grid
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
          <a
            href="/products"
            className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Products
          </a>
        </div>
      );
    }

    // List View
    if (currentView === "list") {
      return (
        <div className="space-y-4">
          {products.map((product) => {
            const props = mapProductToCardProps(product);
            return (
              <a
                key={product.id}
                href={`/products/${product.product_code?.toLowerCase() || product.id}`}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden p-4 border border-gray-100"
              >
                {/* Product Image */}
                <div className="relative w-full sm:w-48 h-48 shrink-0 overflow-hidden bg-gray-100 rounded-lg">
                  <img
                    src={props.image}
                    alt={props.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {props.badge && (
                    <div
                      className="absolute top-2 left-2 text-white px-2 py-1 rounded text-xs font-bold"
                      style={{ backgroundColor: props.badgeColor }}
                    >
                      {props.badge}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    {props.vendor && (
                      <p className="text-xs text-blue-600 font-medium mb-1 uppercase tracking-wide">
                        {props.vendor}
                      </p>
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {props.title}
                    </h3>
                    {props.subtitle && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {props.subtitle}
                      </p>
                    )}
                    {props.rating && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(props.rating!) ? "text-yellow-400" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        {props.reviewCount && (
                          <span className="text-sm text-gray-500">
                            ({props.reviewCount} reviews)
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {currency} {props.price?.toLocaleString()}
                      </span>
                      {props.comparePrice && (
                        <span className="text-base text-gray-500 line-through">
                          {currency} {props.comparePrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {props.quickAddEnabled && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
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
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Add to Cart
                      </button>
                    )}
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
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap: `${gap * 4}px`,
          }}
          className={`grid-cols-${columnsMobile} sm:grid-cols-${columnsTablet} lg:grid-cols-${columns}`}
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
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: `${gap * 4}px`,
        }}
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
              {product.brand && (
                <p className="text-xs text-blue-600 mb-1">{product.brand}</p>
              )}
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>
              <div>
                <span className="text-lg font-bold">
                  {currency} {product.price.toLocaleString()}
                </span>
                {product.old_price && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    {currency} {product.old_price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    );
  };

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {showSidebar && (
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="font-medium">Filters</span>
              </button>
            )}
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{products.length}</span>{" "}
              products
            </p>
          </div>

          {showViewToggle && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 hidden sm:block">View:</span>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setCurrentView("grid")}
                  className={`p-2 transition-colors ${
                    currentView === "grid"
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentView("list")}
                  className={`p-2 transition-colors ${
                    currentView === "list"
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div
          className={`flex gap-8 ${sidebarPosition === "right" ? "flex-row-reverse" : ""}`}
        >
          {/* Sidebar */}
          {showSidebar && sidebar && (
            <>
              <div className="hidden lg:block w-64 shrink-0">
                {SidebarComponent ? (
                  <SidebarComponent
                    settings={sidebar.settings}
                    blocks={sidebar.filters}
                  />
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
                      {SidebarComponent ? (
                        <SidebarComponent
                          settings={sidebar.settings}
                          blocks={sidebar.filters}
                        />
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

export default ProductsContent1;
