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

  // Calculate stats
  const onSaleCount = products.filter((p) => p.old_price && p.old_price > p.price).length;

  return (
    <section className="py-8 sm:py-16 md:py-20" style={{ backgroundColor }} id="products">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">

        {/* Modern Sticky Header Bar */}
        <div className="sm:mb-12">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {collection?.title || "Products"}
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                <span className="text-emerald-600 font-medium">{products.length} Products</span>
                {onSaleCount > 0 && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    <span className="text-rose-600 font-medium">{onSaleCount} On Sale</span>
                  </>
                )}
              </div>
            </div>
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
                <button className="group relative px-8 py-1.5 sm:py-3 bg-white border-2 border-gray-900 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all overflow-hidden">
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
              onClick={() => window.location.href = "/collections"}
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Go back to Collections
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
