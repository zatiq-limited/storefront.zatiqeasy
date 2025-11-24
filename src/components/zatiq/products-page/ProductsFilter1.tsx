import React from "react";

interface SortOption {
  value: string;
  label: string;
}

interface ProductsFilter1Props {
  settings?: {
    showSearch?: boolean;
    showSort?: boolean;
    sticky?: boolean;
    sortOptions?: SortOption[];
  };
  currentSort?: string;
  currentSearch?: string;
  onSortChange?: (sort: string) => void;
  onSearchChange?: (search: string) => void;
}

const ProductsFilter1: React.FC<ProductsFilter1Props> = ({
  settings = {},
  currentSort = "featured",
  currentSearch = "",
  onSortChange,
  onSearchChange,
}) => {
  const {
    showSearch = true,
    showSort = true,
    sticky = true,
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
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0 py-4">
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
    </section>
  );
};

export default ProductsFilter1;
