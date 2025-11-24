import React from "react";

interface SortOption {
  value: string;
  label: string;
}

interface ProductsFilter1Props {
  settings?: {
    showSearch?: boolean;
    showSort?: boolean;
    showViewToggle?: boolean;
    sticky?: boolean;
    sortOptions?: SortOption[];
  };
  currentSort?: string;
  currentSearch?: string;
  currentView?: "grid" | "list";
  onSortChange?: (sort: string) => void;
  onSearchChange?: (search: string) => void;
  onViewChange?: (view: "grid" | "list") => void;
}

const ProductsFilter1: React.FC<ProductsFilter1Props> = ({
  settings = {},
  currentSort = "featured",
  currentSearch = "",
  currentView = "grid",
  onSortChange,
  onSearchChange,
  onViewChange,
}) => {
  const {
    showSearch = true,
    showSort = true,
    showViewToggle = true,
    sticky = true,
    sortOptions = [
      { value: "featured", label: "Featured" },
      { value: "price-asc", label: "Price: Low to High" },
      { value: "price-desc", label: "Price: High to Low" },
      { value: "newest", label: "Newest First" },
      { value: "rating", label: "Top Rated" },
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

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    if (onSearchChange) {
      onSearchChange(search);
    } else {
      const url = new URL(window.location.href);
      if (search) {
        url.searchParams.set("search", search);
      } else {
        url.searchParams.delete("search");
      }
      url.searchParams.delete("page");
      window.location.href = url.toString();
    }
  };

  return (
    <section className={`border-b bg-white ${sticky ? "sticky top-0 z-40" : ""} shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          {showSearch && (
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md w-full">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="search"
                  name="search"
                  defaultValue={currentSearch}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
          )}

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            {showViewToggle && (
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => onViewChange?.("grid")}
                  className={`p-2 ${currentView === "grid" ? "bg-gray-100" : "bg-white"} hover:bg-gray-50 transition-colors`}
                  aria-label="Grid view"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => onViewChange?.("list")}
                  className={`p-2 ${currentView === "list" ? "bg-gray-100" : "bg-white"} hover:bg-gray-50 transition-colors`}
                  aria-label="List view"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            )}

            {/* Sort */}
            {showSort && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 hidden sm:block">Sort by:</label>
                <select
                  value={currentSort}
                  onChange={handleSortChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsFilter1;
