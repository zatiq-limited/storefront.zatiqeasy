/**
 * ========================================
 * COLLECTION PRODUCTS 2
 * ========================================
 * Dynamic masonry-style layout with interactive cards
 * Inspired by Pinterest and modern e-commerce platforms
 */

import React, { useState } from "react";
import CollectionProductsGrid from "./CollectionProductsGrid";

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

interface Collection {
  id: number;
  title: string;
}

interface CollectionProducts2Props {
  products: Product[];
  collection?: Collection;
  settings?: {
    columns?: number;
    cardStyle?: string;
    backgroundColor?: string;
  };
}

const CollectionProducts2: React.FC<CollectionProducts2Props> = ({
  products = [],
  collection,
  settings = {},
}) => {
  const { backgroundColor = "#fafafa", cardStyle = "product-card-1" } = settings;
  const [showFilters, setShowFilters] = useState(false);

  // Calculate stats
  const inStockCount = products.filter((p) => p.quantity > 0).length;
  const onSaleCount = products.filter((p) => p.old_price && p.old_price > p.price).length;

  return (
    <section className="py-16 md:py-20" style={{ backgroundColor }} id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Modern Sticky Header Bar */}
        <div className="mb-12">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {collection?.title || "Products"}
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">{products.length} Products</span>
                <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                <span className="text-emerald-600 font-medium">{inStockCount} In Stock</span>
                {onSaleCount > 0 && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    <span className="text-rose-600 font-medium">{onSaleCount} On Sale</span>
                  </>
                )}
              </div>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border-2 border-gray-200 hover:border-gray-900 transition-colors font-medium"
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
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              <span>Filters</span>
              {showFilters && (
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              )}
            </button>
          </div>

          {/* Expandable Filter Bar */}
          {showFilters && (
            <div
              className="bg-white rounded-xl border border-gray-200 p-6 mb-6"
              style={{ animation: "slideDown 0.3s ease-out" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Availability Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Availability
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700 group-hover:text-gray-900">
                        In Stock ({inStockCount})
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700 group-hover:text-gray-900">
                        On Sale ({onSaleCount})
                      </span>
                    </label>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Price Range
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-gray-400">—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Sort By
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest</option>
                    <option>Best Selling</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                <button className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                  Apply Filters
                </button>
                <button className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium">
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-full bg-white border-2 border-gray-200 hover:border-indigo-600 hover:text-indigo-600 transition-all text-sm font-medium">
              All Products
            </button>
            <button className="px-4 py-2 rounded-full bg-white border-2 border-gray-200 hover:border-emerald-600 hover:text-emerald-600 transition-all text-sm font-medium">
              In Stock
            </button>
            {onSaleCount > 0 && (
              <button className="px-4 py-2 rounded-full bg-rose-50 border-2 border-rose-200 text-rose-600 hover:bg-rose-100 transition-all text-sm font-medium">
                🔥 On Sale
              </button>
            )}
            <button className="px-4 py-2 rounded-full bg-white border-2 border-gray-200 hover:border-amber-600 hover:text-amber-600 transition-all text-sm font-medium">
              ⭐ 4+ Stars
            </button>
          </div>
        </div>

        {/* Products Grid with Masonry Feel */}
        {products.length > 0 ? (
          <div className="relative">
            <CollectionProductsGrid
              products={products}
              settings={{
                ...settings,
                cardStyle,
              }}
            />

            {/* Load More Section */}
            <div className="mt-12 text-center">
              <div className="inline-flex flex-col items-center gap-4">
                <p className="text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{products.length}</span> of{" "}
                  <span className="font-semibold text-gray-900">{products.length}</span> products
                </p>
                <button className="group relative px-8 py-3 bg-white border-2 border-gray-900 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all overflow-hidden">
                  <span className="relative z-10">View All Products</span>
                  <div className="absolute inset-0 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Beautiful Empty State */
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 max-w-sm mx-auto mb-6">
              Try adjusting your filters or check back later for new arrivals
            </p>
            <button
              onClick={() => setShowFilters(false)}
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default CollectionProducts2;
