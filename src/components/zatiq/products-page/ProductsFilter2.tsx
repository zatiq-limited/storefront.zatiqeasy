import React, { useState } from "react";

interface SortOption {
  value: string;
  label: string;
}

interface ProductsFilter2Props {
  settings?: {
    showSearch?: boolean;
    showSort?: boolean;
    showViewToggle?: boolean;
    showFilterButton?: boolean;
    sortOptions?: SortOption[];
  };
  currentSort?: string;
  currentSearch?: string;
  currentView?: "grid" | "list";
  productCount?: number;
  onSortChange?: (sort: string) => void;
  onSearchChange?: (search: string) => void;
  onViewChange?: (view: "grid" | "list") => void;
  onFilterToggle?: () => void;
}

const ProductsFilter2: React.FC<ProductsFilter2Props> = ({
  settings = {},
  currentSort = "featured",
  currentSearch = "",
  currentView = "grid",
  productCount = 0,
  onSortChange,
  onSearchChange,
  onViewChange,
  onFilterToggle,
}) => {
  const [searchValue, setSearchValue] = useState(currentSearch);
  const {
    showSearch = true,
    showSort = true,
    showViewToggle = true,
    showFilterButton = true,
    sortOptions = [
      { value: "featured", label: "Featured" },
      { value: "price-asc", label: "Price: Low to High" },
      { value: "price-desc", label: "Price: High to Low" },
      { value: "newest", label: "Newest First" },
    ],
  } = settings;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (onSortChange) {
      onSortChange(value);
    } else {
      const url = new URL(window.location.href);
      url.searchParams.set("sort", value);
      window.location.href = url.toString();
    }
  };

  const handleSearch = () => {
    if (onSearchChange) {
      onSearchChange(searchValue);
    } else {
      const url = new URL(window.location.href);
      if (searchValue) {
        url.searchParams.set("search", searchValue);
      } else {
        url.searchParams.delete("search");
      }
      url.searchParams.delete("page");
      window.location.href = url.toString();
    }
  };

  return (
    <section className="bg-gray-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Left Side - Filter Button & Product Count */}
          <div className="flex items-center gap-4">
            {showFilterButton && (
              <button
                onClick={onFilterToggle}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="font-medium">Filters</span>
              </button>
            )}
            <p className="text-sm text-gray-600">
              <span className="font-semibold">{productCount}</span> products
            </p>
          </div>

          {/* Right Side - Search, View Toggle & Sort */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Search */}
            {showSearch && (
              <div className="flex-1 lg:flex-none lg:w-64">
                <div className="relative flex">
                  <input
                    type="search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search..."
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* View Toggle */}
            {showViewToggle && (
              <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => onViewChange?.("grid")}
                  className={`p-2.5 ${currentView === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-600"} hover:bg-gray-50 transition-colors`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => onViewChange?.("list")}
                  className={`p-2.5 ${currentView === "list" ? "bg-blue-50 text-blue-600" : "text-gray-600"} hover:bg-gray-50 transition-colors`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            {/* Sort */}
            {showSort && (
              <select
                value={currentSort}
                onChange={handleSortChange}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsFilter2;
