"use client";

import { Search, SlidersHorizontal, Grid2X2, List } from "lucide-react";
import type { FilterBarProps } from "./types";

export default function FilterBar({
  showSearch,
  showSort,
  showViewToggle,
  showSidebar,
  sticky,
  currentView,
  searchValue,
  sortValue,
  totalProducts,
  onSearchChange,
  onSearchSubmit,
  onSortChange,
  onViewChange,
  onOpenMobileSidebar,
  filterBarBgColor,
  searchBorderColor,
  sortBorderColor,
  productCountBgColor,
  productCountTextColor,
  viewToggleActiveBgColor,
  viewToggleActiveIconColor,
  viewToggleInactiveBgColor,
  viewToggleInactiveIconColor,
}: FilterBarProps) {
  if (!showSearch && !showSort) return null;

  return (
    <div
      className={`border-b ${sticky ? "sticky top-0 z-40 shadow-sm" : ""}`}
      style={{ backgroundColor: filterBarBgColor }}
    >
      <div className="container py-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Filter Button and Search */}
          <div className="flex items-center gap-2 flex-1 w-full md:w-auto min-w-0">
            {/* Mobile Filter Button */}
            {showSidebar && (
              <button
                onClick={onOpenMobileSidebar}
                className="inline-flex lg:hidden items-center justify-center gap-2 h-10 px-3 bg-white rounded-lg hover:bg-gray-50 transition-all shadow-sm border shrink-0"
                style={{ borderColor: searchBorderColor }}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="font-medium text-sm">Filters</span>
              </button>
            )}

            {showSearch && (
              <form onSubmit={onSearchSubmit} className="flex-1 max-w-md min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="search"
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search products..."
                    className="h-10 w-full pl-9 pr-4 rounded-lg transition-all shadow-sm text-sm border"
                    style={{ borderColor: searchBorderColor }}
                  />
                </div>
              </form>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end min-w-0">
            {/* Product Count */}
            {totalProducts > 0 && (
              <div
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border"
                style={{ backgroundColor: productCountBgColor }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                <p
                  className="text-xs font-medium"
                  style={{ color: productCountTextColor }}
                >
                  <span className="font-bold">{totalProducts}</span>
                  <span className="ml-1">items</span>
                </p>
              </div>
            )}

            {/* Sort */}
            {showSort && (
              <div className="flex items-center gap-2 shrink-0">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide hidden md:block">
                  Sort
                </label>
                <select
                  value={sortValue}
                  onChange={onSortChange}
                  className="h-10 px-3 rounded-lg shadow-sm transition-all text-sm border"
                  style={{ borderColor: sortBorderColor }}
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>
            )}

            {/* View Toggle */}
            {showViewToggle && (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onViewChange("grid")}
                  className="p-2 rounded-lg transition-all"
                  style={{
                    backgroundColor:
                      currentView === "grid"
                        ? viewToggleActiveBgColor
                        : viewToggleInactiveBgColor,
                    color:
                      currentView === "grid"
                        ? viewToggleActiveIconColor
                        : viewToggleInactiveIconColor,
                  }}
                >
                  <Grid2X2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onViewChange("list")}
                  className="p-2 rounded-lg transition-all"
                  style={{
                    backgroundColor:
                      currentView === "list"
                        ? viewToggleActiveBgColor
                        : viewToggleInactiveBgColor,
                    color:
                      currentView === "list"
                        ? viewToggleActiveIconColor
                        : viewToggleInactiveIconColor,
                  }}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
