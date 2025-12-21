/**
 * Collection Products 2
 * Modern grid with top filter bar
 */

"use client";

import { convertSettingsKeys } from "@/lib/settings-utils";
import type { Collection } from "@/hooks/useCollectionDetails";

interface CollectionProducts2Props {
  settings?: Record<string, unknown>;
  collection: Collection;
  isLoading?: boolean;
}

export default function CollectionProducts2({
  settings = {},
  collection,
  isLoading = false,
}: CollectionProducts2Props) {
  const s = convertSettingsKeys(settings);

  return (
    <section id="products" style={{ backgroundColor: "#f9fafb" }}>
      <div className="container mx-auto px-4 py-12">
        {/* Top Filter Bar */}
        {(s.showFilters || s.showSorting) && (
          <div className="mb-8 p-4 bg-white rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {s.showFilters && (
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                    All Products
                  </button>
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                    New Arrivals
                  </button>
                </div>
              )}

              {s.showSorting && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select className="border rounded-lg px-4 py-2">
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        <p className="text-gray-600 mb-6">
          Showing {collection.product_count} products
        </p>

        {/* Products Grid */}
        <div className="grid gap-6 grid-cols-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Products will be displayed here</p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {s.showPagination && (
          <div className="mt-12 text-center">
            <button className="inline-flex items-center px-12 py-4 rounded-full font-semibold transition-all hover:scale-105 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white">
              View All Products
            </button>
          </div>
        )}
      </div>
    </section>
  );
}