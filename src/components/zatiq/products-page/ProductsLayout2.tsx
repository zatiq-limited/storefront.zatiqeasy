import React, { useState } from "react";
import ProductsSidebar2 from "./ProductsSidebar2";
import ProductsGrid2 from "./ProductsGrid2";

interface FilterBlock {
  id: string;
  title: string;
  type: "category" | "price" | "brand" | "color" | "size";
  items?: Array<{ id: string; name: string; count?: number; hex?: string }>;
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
    defaultView?: "grid" | "list";
  };
  blocks?: Array<{
    id: string;
    type: string;
    settings?: any;
    blocks?: FilterBlock[];
  }>;
  products?: Product[];
  selectedFilters?: Record<string, string[]>;
}

const ProductsLayout2: React.FC<ProductsLayout2Props> = ({
  settings = {},
  blocks = [],
  products = [],
  selectedFilters = {},
}) => {
  const { showSidebar = true, sidebarPosition = "left", defaultView = "grid" } = settings;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"grid" | "list">(defaultView);

  const sidebarBlock = blocks.find((b) => b.type === "products-sidebar-1" || b.type === "products-sidebar-2");
  const gridBlock = blocks.find((b) => b.type === "products-grid-1" || b.type === "products-grid-2");

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div className="flex items-center gap-4">
            {showSidebar && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
            )}
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{products.length}</span> products
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden sm:block">View:</span>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setCurrentView("grid")}
                className={`p-2 ${currentView === "grid" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentView("list")}
                className={`p-2 ${currentView === "list" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className={`flex gap-8 ${sidebarPosition === "right" ? "flex-row-reverse" : ""}`}>
          {/* Sidebar */}
          {showSidebar && sidebarBlock && (
            <ProductsSidebar2
              settings={sidebarBlock.settings}
              blocks={sidebarBlock.blocks}
              selectedFilters={selectedFilters}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Products */}
          <div className="flex-1 min-w-0">
            {products.length > 0 ? (
              <ProductsGrid2
                settings={gridBlock?.settings}
                products={products}
                view={currentView}
              />
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => window.location.href = "/products"}
                    className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Clear Filters
                  </button>
                  <a
                    href="/"
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back to Home
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsLayout2;
