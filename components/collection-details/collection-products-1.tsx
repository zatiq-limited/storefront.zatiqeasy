/**
 * Collection Products 1
 * Premium product grid with advanced filters and enhanced interactions
 * Enhanced design matching Astro version
 */

"use client";

import { useState } from "react";
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
  showViewToggle?: boolean;
  defaultView?: string;
  productsPerPage?: string;
  backgroundColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  loadMoreButtonText?: string;
  loadMoreGradientFrom?: string;
  loadMoreGradientTo?: string;
  loadMoreTextColor?: string;
  accentColor?: string;
  textColor?: string;
  filterPosition?: string;
  showSearch?: boolean;
}

export default function CollectionProducts1({
  settings = {},
  collection,
  isLoading = false,
}: CollectionProducts1Props) {
  const s = convertSettingsKeys<CollectionProducts1Settings>(settings);
  const [viewMode, setViewMode] = useState(s.defaultView || "grid");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Responsive column classes
  const columnClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  };

  return (
    <section
      id="products"
      className="relative py-12 sm:py-16 lg:py-20"
      style={{ backgroundColor: s.backgroundColor || "#ffffff" }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239CA3AF' fill-opacity='0.05'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2v2h-2V0zm0 4h2v2h-2V4zm0 4h2v2h-2V8zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm4-36h2v2h-2V0zm4 0h2v2h-2V0zm4 0h2v2h-2V0zm4 0h2v2h-2V0zm4 0h2v2h-2V0zm4 0h2v2h-2V0zm4 0h2v2h-2V0zM0 40h2v2H0v-2zm4 0h2v2H2v-2zm4 0h2v2H6v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: s.textColor || "#111827" }}>
              Products
            </h2>
            <p className="text-sm sm:text-base opacity-70" style={{ color: s.textColor || "#6b7280" }}>
              {collection.product_count} products in {collection.name}
            </p>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Search */}
            {s.showSearch && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 rounded-xl border transition-all focus:outline-none focus:ring-2"
                  style={{
                    borderColor: `${s.accentColor || "#7c3aed"}30`,
                    focusRingColor: s.accentColor || "#7c3aed",
                  }}
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: s.textColor || "#9ca3af" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            )}

            {/* View Toggle */}
            {s.showViewToggle && (
              <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: `${s.accentColor || "#7c3aed"}10` }}>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid" ? "bg-white shadow-sm" : ""
                  }`}
                  style={{
                    color: viewMode === "grid" ? s.accentColor || "#7c3aed" : s.textColor || "#6b7280",
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list" ? "bg-white shadow-sm" : ""
                  }`}
                  style={{
                    color: viewMode === "list" ? s.accentColor || "#7c3aed" : s.textColor || "#6b7280",
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}

            {/* Sort Dropdown */}
            {s.showSorting && (
              <select className="px-4 py-2 rounded-xl border transition-all appearance-none cursor-pointer focus:outline-none focus:ring-2"
                style={{
                  borderColor: `${s.accentColor || "#7c3aed"}30`,
                  focusRingColor: s.accentColor || "#7c3aed",
                  color: s.textColor || "#374151",
                }}
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
                <option>Best Selling</option>
                <option>Top Rated</option>
                <option>A to Z</option>
                <option>Z to A</option>
              </select>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {s.showFilters && (
            <aside className={`${s.filterPosition === "floating" ? "lg:sticky lg:top-24" : ""} lg:w-80 xl:w-96 flex-shrink-0`}>
              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold" style={{ color: s.textColor || "#111827" }}>
                    Filters
                  </h3>
                  {activeFilters.length > 0 && (
                    <button
                      className="text-sm font-medium"
                      style={{ color: s.accentColor || "#7c3aed" }}
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Active Filters */}
                {activeFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2 pb-4 border-b" style={{ borderColor: `${s.textColor || "#e5e7eb"}20` }}>
                    {activeFilters.map((filter) => (
                      <span
                        key={filter}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${s.accentColor || "#7c3aed"}15`,
                          color: s.accentColor || "#7c3aed",
                        }}
                      >
                        {filter}
                        <button className="hover:opacity-70">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Filter Categories */}
                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: s.textColor || "#374151" }}>
                      Categories
                    </h4>
                    <div className="space-y-2">
                      {["Electronics", "Clothing", "Accessories", "Home", "Sports"].map((category) => (
                        <label key={category} className="flex items-center cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                          <span className="ml-2 text-sm" style={{ color: s.textColor || "#6b7280" }}>
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: s.textColor || "#374151" }}>
                      Price Range
                    </h4>
                    <div className="space-y-3">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        className="w-full"
                        style={{
                          accentColor: s.accentColor || "#7c3aed",
                        }}
                      />
                      <div className="flex justify-between text-sm" style={{ color: s.textColor || "#6b7280" }}>
                        <span>$0</span>
                        <span>$1000</span>
                      </div>
                    </div>
                  </div>

                  {/* Brands */}
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: s.textColor || "#374151" }}>
                      Brands
                    </h4>
                    <div className="space-y-2">
                      {["Brand A", "Brand B", "Brand C", "Brand D"].map((brand) => (
                        <label key={brand} className="flex items-center cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                          <span className="ml-2 text-sm" style={{ color: s.textColor || "#6b7280" }}>
                            {brand}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: s.textColor || "#374151" }}>
                      Rating
                    </h4>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                          <div className="flex items-center ml-2">
                            <div className="flex">
                              {Array.from({ length: 5 }, (_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < rating ? "text-yellow-400" : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-2 text-sm" style={{ color: s.textColor || "#6b7280" }}>
                              & Up
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {/* Products Container */}
            <div className={`${viewMode === "grid" ? columnClasses[Number(s.columns) as keyof typeof columnClasses] || columnClasses[3] : "space-y-4"} gap-6`}>
              {isLoading ? (
                Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`${viewMode === "grid" ? "col-span-full" : ""} flex flex-col items-center justify-center py-20 text-center`}>
                  <svg className="w-24 h-24 mx-auto mb-4 opacity-20" style={{ color: s.accentColor || "#7c3aed" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: s.textColor || "#374151" }}>
                    No products found
                  </h3>
                  <p className="text-sm opacity-70" style={{ color: s.textColor || "#6b7280" }}>
                    Try adjusting your filters or search terms
                  </p>
                </div>
              )}
            </div>

            {/* Load More Button */}
            {s.showPagination && (
              <div className="mt-12 text-center">
                <button
                  className="group relative inline-flex items-center px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-2xl overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${
                      s.loadMoreGradientFrom || "#4f46e5"
                    } 0%, ${s.loadMoreGradientTo || "#9333ea"} 100%)`,
                    color: s.loadMoreTextColor || "#ffffff",
                  }}
                >
                  <span className="relative z-10 flex items-center">
                    {s.loadMoreButtonText || "Load More Products"}
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}