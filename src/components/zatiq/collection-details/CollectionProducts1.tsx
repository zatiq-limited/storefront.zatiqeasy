/**
 * ========================================
 * COLLECTION PRODUCTS 1
 * ========================================
 * Curated collection with featured hero products
 * Modern grid layout with category organization
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

interface CollectionProducts1Props {
  products: Product[];
  collection?: Collection;
  settings?: {
    columns?: number;
    columnsMobile?: 1 | 2;
    cardStyle?: string;
    backgroundColor?: string;
  };
}

const CollectionProducts1: React.FC<CollectionProducts1Props> = ({
  products = [],
  collection,
  settings = {},
}) => {
  const { backgroundColor = "#ffffff", columns = 4, columnsMobile = 2, cardStyle = "product-card-1" } = settings;

  // Initialize viewMode based on columns prop, default to 4
  const getInitialViewMode = (): 2 | 3 | 4 => {
    if (columns === 2 || columns === 3 || columns === 4) {
      return columns;
    }
    return 4; // Default fallback
  };

  const [viewMode, setViewMode] = useState<2 | 3 | 4>(getInitialViewMode());

  return (
    <section className="py-16 md:py-20" style={{ backgroundColor }} id="products">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">

        {/* Header Section - Enhanced */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            {/* Title & Description */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  {collection?.title || "Products"}
                </h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
                  {products.length}
                </span>
              </div>
              <p className="text-gray-600 text-lg">
                Discover our carefully curated selection of premium products
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">View:</span>
              <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode(2)}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 2 ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                  }`}
                  aria-label="2 columns"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="8" height="18" rx="1" />
                    <rect x="13" y="3" width="8" height="18" rx="1" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode(3)}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 3 ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                  }`}
                  aria-label="3 columns"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="3" width="6" height="18" rx="1" />
                    <rect x="9" y="3" width="6" height="18" rx="1" />
                    <rect x="16" y="3" width="6" height="18" rx="1" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode(4)}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 4 ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                  }`}
                  aria-label="4 columns"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="3" width="4.5" height="18" rx="1" />
                    <rect x="7" y="3" width="4.5" height="18" rx="1" />
                    <rect x="12" y="3" width="4.5" height="18" rx="1" />
                    <rect x="17" y="3" width="4.5" height="18" rx="1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Divider with decorative element */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-white px-4">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-600"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-600"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-pink-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <CollectionProductsGrid
            products={products}
            settings={{
              ...settings,
              columns: viewMode,
              columnsMobile,
              cardStyle,
            }}
          />
        ) : (
          /* Beautiful Empty State */
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-6">
              <svg
                className="w-12 h-12 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We're curating amazing products for this collection. Check back soon for exciting new arrivals!
            </p>
            <a
              href="/collections"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              <span>Browse Other Collections</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* Load More CTA */}
      <div className="flex justify-center mt-16">
        <a
          href="/products"
          className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
        >
          {/* Animated Background */}
          <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>

          {/* Content */}
          <span className="relative z-10 flex items-center gap-3">
            View More Products
            <svg
              className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>

          {/* Shine Effect */}
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
        </a>
      </div>
    </section>
  );
};

export default CollectionProducts1;
