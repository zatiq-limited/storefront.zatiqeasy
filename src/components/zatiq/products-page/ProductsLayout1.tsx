import React, { useState } from "react";
import ProductsSidebar1 from "./ProductsSidebar1";
import ProductsGrid1 from "./ProductsGrid1";

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
  review_summary?: {
    average_rating: number;
    total_reviews: number;
  };
}

interface ProductsLayout1Props {
  settings?: {
    showSidebar?: boolean;
    sidebarPosition?: "left" | "right";
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

const ProductsLayout1: React.FC<ProductsLayout1Props> = ({
  settings = {},
  blocks = [],
  products = [],
  selectedFilters = {},
}) => {
  const { showSidebar = true, sidebarPosition = "left" } = settings;
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Find sidebar and grid blocks
  const sidebarBlock = blocks.find((b) => b.type === "products-sidebar-1" || b.type === "products-sidebar-2");
  const gridBlock = blocks.find((b) => b.type === "products-grid-1" || b.type === "products-grid-2");

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Filter Button */}
        {showSidebar && (
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="font-medium">Filters</span>
            </button>
          </div>
        )}

        <div className={`flex gap-8 ${sidebarPosition === "right" ? "flex-row-reverse" : ""}`}>
          {/* Sidebar */}
          {showSidebar && sidebarBlock && (
            <>
              {/* Desktop Sidebar */}
              <div className="hidden lg:block flex-shrink-0">
                <ProductsSidebar1
                  settings={sidebarBlock.settings}
                  blocks={sidebarBlock.blocks}
                  selectedFilters={selectedFilters}
                />
              </div>

              {/* Mobile Sidebar Overlay */}
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
                      <ProductsSidebar1
                        settings={sidebarBlock.settings}
                        blocks={sidebarBlock.blocks}
                        selectedFilters={selectedFilters}
                      />
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

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {products.length > 0 ? (
              <ProductsGrid1
                settings={gridBlock?.settings}
                products={products}
              />
            ) : (
              <div className="text-center py-20 bg-white rounded-xl">
                <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-6 text-2xl font-semibold text-gray-900">No products found</h3>
                <p className="mt-2 text-gray-600">Try adjusting your search or filter criteria</p>
                <a
                  href="/products"
                  className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View All Products
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsLayout1;
