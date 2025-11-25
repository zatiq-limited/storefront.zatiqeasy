import React, { useState } from "react";

interface SortOption {
  value: string;
  label: string;
}

interface ProductsFilter2Props {
  settings?: {
    showSearch?: boolean;
    showSort?: boolean;
    sortOptions?: SortOption[];
  };
  currentSort?: string;
  currentSearch?: string;
  productCount?: number;
  onSortChange?: (sort: string) => void;
  onSearchChange?: (search: string) => void;
  onFilterToggle?: () => void;
}

const ProductsFilter2: React.FC<ProductsFilter2Props> = ({
  settings = {},
  currentSort = "featured",
  currentSearch = "",
  productCount = 0,
  onSortChange,
  onSearchChange,
  onFilterToggle,
}) => {
  const [searchValue, setSearchValue] = useState(currentSearch);
  const {
    showSearch = true,
    showSort = true,
    sortOptions = [],
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
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Left Side - Filter Button & Product Count */}
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">{productCount}</span> products
            </p>
          </div>

          {/* Right Side - Search & Sort */}
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
