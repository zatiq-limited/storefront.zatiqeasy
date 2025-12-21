/**
 * Collection Products 1
 * Clean product grid with sidebar filters
 */

"use client";

import { convertSettingsKeys } from "@/lib/settings-utils";
import type { Collection } from "@/hooks/useCollectionDetails";

interface CollectionProducts1Props {
  settings?: Record<string, unknown>;
  collection: Collection;
  isLoading?: boolean;
}

interface CollectionProducts1Settings {
  cardStyle?: string;
  columns?: string;
  columnsMobile?: string;
  columnsTablet?: string;
  showFilters?: boolean;
  showSorting?: boolean;
  showPagination?: boolean;
  productsPerPage?: string;
  backgroundColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  loadMoreButtonText?: string;
  loadMoreGradientFrom?: string;
  loadMoreGradientTo?: string;
  loadMoreTextColor?: string;
}

export default function CollectionProducts1({
  settings = {},
  collection,
  isLoading = false,
}: CollectionProducts1Props) {
  const s = convertSettingsKeys<CollectionProducts1Settings>(settings);

  return (
    <section
      id="products"
      style={{ backgroundColor: s.backgroundColor || "#ffffff" }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {s.showFilters && (
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Filters</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Categories</label>
                      <div className="mt-2 space-y-2">
                        {/* Category filters */}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Price Range</label>
                      <div className="mt-2">
                        {/* Price filter */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sorting Bar */}
            {s.showSorting && (
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  {collection.product_count} products in {collection.name}
                </p>
                <select className="border rounded-lg px-4 py-2">
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                  <option>Best Selling</option>
                </select>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid gap-6 grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                Array.from({ length: 6 }, (_, i) => (
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
                <button
                  className="inline-flex items-center px-8 py-4 rounded-full font-semibold transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${
                      s.loadMoreGradientFrom || "#4f46e5"
                    } 0%, ${s.loadMoreGradientTo || "#9333ea"} 100%)`,
                    color: s.loadMoreTextColor || "#ffffff",
                  }}
                >
                  {s.loadMoreButtonText || "View More Products"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}