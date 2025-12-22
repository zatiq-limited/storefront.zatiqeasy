/**
 * Collection Products 2
 * Premium masonry layout with floating filters and modern interactions
 * Enhanced design matching Astro version
 */

"use client";

import { useState, useEffect } from "react";
import { convertSettingsKeys } from "@/lib/settings-utils";
import type { CollectionDetails as Collection } from "@/hooks/useCollectionDetails";

interface CollectionProducts2Props {
  settings?: Record<string, unknown>;
  collection: Collection;
  isLoading?: boolean;
}

interface CollectionProducts2Settings {
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
  filterStyle?: string;
  showQuickView?: boolean;
  showCompare?: boolean;
}

export default function CollectionProducts2({
  settings = {},
  collection,
  isLoading = false,
}: CollectionProducts2Props) {
  const s = convertSettingsKeys<CollectionProducts2Settings>(settings);
  const [viewMode, setViewMode] = useState(s.defaultView || "grid");
  const [selectedSort, setSelectedSort] = useState("featured");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Responsive column classes
  const columnClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  };

  // Masonry classes for different heights
  const masonryClasses = viewMode === "masonry" ? "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6" : "";

  useEffect(() => {
    // Scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeInUp");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".product-card");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section
      id="products"
      className="relative py-12 sm:py-16 lg:py-20"
      style={{ backgroundColor: s.backgroundColor || "#f9fafb" }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10"
          style={{
            backgroundColor: s.accentColor || "#7c3aed",
            filter: "blur(60px)",
            animation: "float 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10"
          style={{
            backgroundColor: s.accentColor || "#7c3aed",
            filter: "blur(60px)",
            animation: "float 20s ease-in-out infinite reverse",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ color: s.textColor || "#111827" }}>
            Shop Our Collection
          </h2>
          <p className="text-lg opacity-70 max-w-2xl mx-auto" style={{ color: s.textColor || "#6b7280" }}>
            Discover {collection.product_count} carefully curated products in {collection.name}
          </p>
        </div>

        {/* Floating Filter Bar */}
        {(s.showFilters || s.showSorting) && (
          <div
            className={`${s.filterStyle === "floating" ? "sticky top-20 z-30 backdrop-blur-lg border-b" : "mb-8"} rounded-2xl p-6 transition-all duration-300`}
            style={{
              backgroundColor: s.filterStyle === "floating"
                ? `${s.backgroundColor || "#ffffff"}F0`
                : "#ffffff",
              borderColor: `${s.textColor || "#e5e7eb"}20`,
              boxShadow: s.filterStyle === "floating"
                ? "0 8px 32px rgba(0,0,0,0.1)"
                : "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              {/* Filter Tags */}
              {s.showFilters && (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all hover:scale-105"
                    style={{
                      backgroundColor: `${s.accentColor || "#7c3aed"}15`,
                      color: s.accentColor || "#7c3aed",
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                    <span>Filters</span>
                    {activeFilters.length > 0 && (
                      <span
                        className="px-2 py-0.5 rounded-full text-xs"
                        style={{
                          backgroundColor: s.accentColor || "#7c3aed",
                          color: "#ffffff",
                        }}
                      >
                        {activeFilters.length}
                      </span>
                    )}
                  </button>

                  {/* Quick Filter Tags */}
                  {["New Arrivals", "Best Sellers", "Sale", "Eco-Friendly"].map((tag) => (
                    <button
                      key={tag}
                      className="px-4 py-2 rounded-xl border-2 font-medium transition-all hover:scale-105"
                      style={{
                        borderColor: `${s.accentColor || "#7c3aed"}30`,
                        color: s.textColor || "#374151",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${s.accentColor || "#7c3aed"}10`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      {tag}
                    </button>
                  ))}

                  {activeFilters.length > 0 && (
                    <button
                      className="text-sm font-medium"
                      style={{ color: s.accentColor || "#7c3aed" }}
                    >
                      Clear All
                    </button>
                  )}
                </div>
              )}

              {/* Right Controls */}
              <div className="flex items-center gap-3">
                {/* View Toggle */}
                {s.showViewToggle && (
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-white shadow-sm border" style={{ borderColor: `${s.textColor || "#e5e7eb"}30` }}>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "grid" ? "shadow-sm" : ""
                      }`}
                      style={{
                        backgroundColor: viewMode === "grid" ? s.accentColor || "#7c3aed" : "transparent",
                        color: viewMode === "grid" ? "#ffffff" : s.textColor || "#6b7280",
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "list" ? "shadow-sm" : ""
                      }`}
                      style={{
                        backgroundColor: viewMode === "list" ? s.accentColor || "#7c3aed" : "transparent",
                        color: viewMode === "list" ? "#ffffff" : s.textColor || "#6b7280",
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode("masonry")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "masonry" ? "shadow-sm" : ""
                      }`}
                      style={{
                        backgroundColor: viewMode === "masonry" ? s.accentColor || "#7c3aed" : "transparent",
                        color: viewMode === "masonry" ? "#ffffff" : s.textColor || "#6b7280",
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M4 6h8v8H4zM14 6h6v4h-6zM14 14h6v6h-6zM4 16h6v4H4z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Sort Dropdown */}
                {s.showSorting && (
                  <div className="relative">
                    <select
                      value={selectedSort}
                      onChange={(e) => setSelectedSort(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2 rounded-xl border-2 font-medium cursor-pointer transition-all focus:outline-none focus:ring-2"
                      style={{
                        borderColor: `${s.accentColor || "#7c3aed"}30`,
                        "--tw-ring-color": s.accentColor || "#7c3aed",
                        color: s.textColor || "#374151",
                        backgroundColor: "#ffffff",
                      } as React.CSSProperties}
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                      <option value="bestselling">Best Selling</option>
                      <option value="rated">Top Rated</option>
                      <option value="name-az">A to Z</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: s.textColor || "#6b7280" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Expandable Filter Panel */}
            {isFilterOpen && (
              <div className="mt-6 pt-6 border-t" style={{ borderColor: `${s.textColor || "#e5e7eb"}20` }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: s.textColor || "#374151" }}>
                      Category
                    </label>
                    <select className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: `${s.accentColor || "#7c3aed"}30` }}>
                      <option>All Categories</option>
                      <option>Electronics</option>
                      <option>Clothing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: s.textColor || "#374151" }}>
                      Price Range
                    </label>
                    <div className="flex items-center space-x-2">
                      <input type="number" placeholder="Min" className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: `${s.accentColor || "#7c3aed"}30` }} />
                      <span style={{ color: s.textColor || "#6b7280" }}>-</span>
                      <input type="number" placeholder="Max" className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: `${s.accentColor || "#7c3aed"}30` }} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: s.textColor || "#374151" }}>
                      Brand
                    </label>
                    <select className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: `${s.accentColor || "#7c3aed"}30` }}>
                      <option>All Brands</option>
                      <option>Brand A</option>
                      <option>Brand B</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: s.textColor || "#374151" }}>
                      Rating
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="p-1 transition-colors"
                          style={{ color: "#fbbf24" }}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Products Grid/List/Masonry */}
        <div className={viewMode === "masonry" ? masonryClasses : `grid ${columnClasses[Number(s.columns) as keyof typeof columnClasses] || columnClasses[4]} gap-6`}>
          {isLoading ? (
            Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="product-card bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : (
            <div className={`${viewMode === "grid" ? "col-span-full" : ""} flex flex-col items-center justify-center py-20 text-center`}>
              <svg className="w-32 h-32 mx-auto mb-6 opacity-20" style={{ color: s.accentColor || "#7c3aed" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h3 className="text-2xl font-bold mb-3" style={{ color: s.textColor || "#374151" }}>
                Your cart is waiting
              </h3>
              <p className="text-lg opacity-70 max-w-md" style={{ color: s.textColor || "#6b7280" }}>
                Looks like you haven't added any products yet. Start shopping to fill it up!
              </p>
              <button
                className="mt-6 px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: s.accentColor || "#7c3aed",
                  color: "#ffffff",
                }}
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Load More */}
        {s.showPagination && (
          <div className="mt-12 flex flex-col items-center">
            <button
              className="group relative inline-flex items-center px-10 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:shadow-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${
                  s.loadMoreGradientFrom || "#4f46e5"
                } 0%, ${s.loadMoreGradientTo || "#9333ea"} 100%)`,
                color: s.loadMoreTextColor || "#ffffff",
              }}
            >
              <span className="relative z-10 flex items-center">
                {s.loadMoreButtonText || "Explore More Products"}
                <svg className="w-6 h-6 ml-3 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
            <p className="mt-3 text-sm opacity-70" style={{ color: s.textColor || "#6b7280" }}>
              Showing 12 of {collection.product_count} products
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-30px) rotate(120deg);
          }
          66% {
            transform: translateY(30px) rotate(240deg);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        .product-card {
          opacity: 0;
        }

        .product-card.animate-fadeInUp {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}