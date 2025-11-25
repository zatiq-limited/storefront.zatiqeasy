import React, { useState } from "react";

interface FilterItem {
  id: string;
  name: string;
  count?: number;
  hex?: string;
}

interface FilterBlock {
  id: string;
  title: string;
  type: "category" | "price" | "brand" | "color" | "size";
  items?: FilterItem[];
  min?: number;
  max?: number;
  currency?: string;
}

interface ProductsSidebar1Props {
  settings?: {
    showCategories?: boolean;
    showPriceRange?: boolean;
    showBrands?: boolean;
    showColors?: boolean;
    showSizes?: boolean;
    collapsible?: boolean;
  };
  blocks?: FilterBlock[];
  selectedFilters?: Record<string, string[]>;
  onFilterChange?: (filterType: string, values: string[]) => void;
}

const ProductsSidebar1: React.FC<ProductsSidebar1Props> = ({
  settings = {},
  blocks = [],
  selectedFilters = {},
  onFilterChange,
}) => {
  const { collapsible = true } = settings;
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    blocks.reduce((acc, block) => ({ ...acc, [block.id]: true }), {})
  );
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });

  const toggleSection = (id: string) => {
    if (!collapsible) return;
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCheckboxChange = (filterType: string, itemId: string) => {
    const current = selectedFilters[filterType] || [];
    const updated = current.includes(itemId)
      ? current.filter((id) => id !== itemId)
      : [...current, itemId];

    if (onFilterChange) {
      onFilterChange(filterType, updated);
    } else {
      const url = new URL(window.location.href);
      if (updated.length > 0) {
        url.searchParams.set(filterType, updated.join(","));
      } else {
        url.searchParams.delete(filterType);
      }
      url.searchParams.delete("page");
      window.location.href = url.toString();
    }
  };

  const handlePriceApply = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("minPrice", priceRange.min.toString());
    url.searchParams.set("maxPrice", priceRange.max.toString());
    url.searchParams.delete("page");
    window.location.href = url.toString();
  };

  const clearAllFilters = () => {
    window.location.href = "/products";
  };

  const renderFilterBlock = (block: FilterBlock) => {
    const isExpanded = expandedSections[block.id];

    return (
      <div key={block.id} className="border-b border-gray-200 py-4">
        <button
          onClick={() => toggleSection(block.id)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-sm font-semibold text-gray-900">{block.title}</h3>
          {collapsible && (
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-3">
            {block.type === "price" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange((prev) => ({ ...prev, min: Number(e.target.value) }))}
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))}
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <button
                  onClick={handlePriceApply}
                  className="w-full py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Apply
                </button>
              </div>
            ) : block.type === "color" ? (
              <div className="flex flex-wrap gap-2">
                {block.items?.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleCheckboxChange("color", item.id)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedFilters.color?.includes(item.id) ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: item.hex }}
                    title={item.name}
                  />
                ))}
              </div>
            ) : (
              block.items?.map((item) => (
                <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedFilters[block.type]?.includes(item.id) || false}
                    onChange={() => handleCheckboxChange(block.type, item.id)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">{item.name}</span>
                  {item.count !== undefined && (
                    <span className="text-xs text-gray-400">({item.count})</span>
                  )}
                </label>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-full lg:w-64 bg-white rounded-lg border border-gray-200 p-4 h-fit lg:sticky lg:top-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        <button onClick={clearAllFilters} className="text-sm text-blue-600 hover:text-blue-800">
          Clear all
        </button>
      </div>
      <div className="divide-y divide-gray-200">
        {blocks.map(renderFilterBlock)}
      </div>
    </aside>
  );
};

export default ProductsSidebar1;
