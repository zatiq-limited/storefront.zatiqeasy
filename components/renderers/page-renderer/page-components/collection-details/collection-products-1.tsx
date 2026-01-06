/**
 * Collection Products 1
 * Premium product grid with advanced filters and enhanced interactions
 * Enhanced design matching Astro version
 */

"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { convertSettingsKeys } from "@/lib/settings-utils";
import { useShopStore } from "@/stores";
import type { CollectionDetails as Collection } from "@/hooks/useCollectionDetails";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  slug?: string;
  price: number;
  regular_price?: number;
  short_description?: string;
  brand?: string;
  image?: string;
  images?: string[];
  quantity?: number;
  categories?: { id: number; name: string }[];
}

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

// Fetch products for collection
async function fetchCollectionProducts(
  shopUuid: string,
  categoryId: number,
  page: number = 1,
  limit: number = 12,
  sort: string = "newest",
  search?: string
): Promise<{ products: Product[]; pagination: { total: number; total_pages: number; current_page: number } }> {
  const response = await fetch("/api/storefront/v1/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      shop_uuid: shopUuid,
      category_id: categoryId,
      page,
      limit,
      sort,
      search,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();
  return {
    products: data.data?.products || [],
    pagination: data.data?.pagination || { total: 0, total_pages: 0, current_page: 1 },
  };
}

export default function CollectionProducts1({
  settings = {},
  collection,
  isLoading: pageLoading = false,
}: CollectionProducts1Props) {
  const s = convertSettingsKeys<CollectionProducts1Settings>(settings);
  const [viewMode, setViewMode] = useState(s.defaultView || "grid");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = parseInt(s.productsPerPage || "12", 10);

  // Get shop_uuid from store
  const shopDetails = useShopStore((state) => state.shopDetails);
  const shopUuid = shopDetails?.shop_uuid;

  // Fetch products for this collection
  const {
    data: productsData,
    isLoading: isProductsLoading,
    error,
  } = useQuery({
    queryKey: ["collection-products", collection.id, shopUuid, currentPage, productsPerPage, sortBy, searchQuery],
    queryFn: () =>
      fetchCollectionProducts(
        shopUuid!,
        collection.id,
        currentPage,
        productsPerPage,
        sortBy,
        searchQuery || undefined
      ),
    enabled: !!shopUuid && !!collection.id,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
  });

  const products = productsData?.products || [];
  const pagination = productsData?.pagination || { total: 0, total_pages: 0, current_page: 1 };
  const isLoading = pageLoading || isProductsLoading;

  // Reset to page 1 when sort or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, searchQuery]);

  // Responsive column classes
  const columnClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  };

  const gridClass = viewMode === "grid"
    ? `grid ${columnClasses[Number(s.columns) as keyof typeof columnClasses] || columnClasses[3]} gap-6`
    : "space-y-4";

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
              {pagination.total || collection.product_count} products in {collection.name}
            </p>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            {s.showSearch && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-xl border transition-all focus:outline-none focus:ring-2"
                  style={{
                    borderColor: `${s.accentColor || "#7c3aed"}30`,
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
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-xl border transition-all appearance-none cursor-pointer focus:outline-none focus:ring-2"
                style={{
                  borderColor: `${s.accentColor || "#7c3aed"}30`,
                  color: s.textColor || "#374151",
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">A to Z</option>
                <option value="name_desc">Z to A</option>
              </select>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className={gridClass}>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className={gridClass}>
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug || product.id}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {/* Out of Stock Badge */}
                    {product.quantity !== undefined && product.quantity <= 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                        Out of Stock
                      </div>
                    )}
                    {/* Discount Badge */}
                    {product.regular_price && product.regular_price > product.price && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded">
                        {Math.round(((product.regular_price - product.price) / product.regular_price) * 100)}% OFF
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3
                      className="font-semibold text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors"
                      style={{ color: s.textColor || "#111827" }}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-lg font-bold"
                        style={{ color: s.accentColor || "#7c3aed" }}
                      >
                        ৳{product.price.toLocaleString()}
                      </span>
                      {product.regular_price && product.regular_price > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ৳{product.regular_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
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
                {searchQuery ? "Try adjusting your search terms" : "No products in this collection yet"}
              </p>
            </div>
          )}

          {/* Pagination / Load More */}
          {s.showPagination && pagination.total_pages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                style={{ borderColor: `${s.accentColor || "#7c3aed"}30` }}
              >
                Previous
              </button>
              <span className="px-4 py-2" style={{ color: s.textColor || "#374151" }}>
                Page {currentPage} of {pagination.total_pages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(pagination.total_pages, p + 1))}
                disabled={currentPage === pagination.total_pages}
                className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                style={{ borderColor: `${s.accentColor || "#7c3aed"}30` }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
