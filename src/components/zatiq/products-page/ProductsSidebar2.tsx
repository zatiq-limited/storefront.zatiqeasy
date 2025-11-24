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

interface ProductsSidebar2Props {
  settings?: {
    collapsible?: boolean;
  };
  blocks?: FilterBlock[];
  selectedFilters?: Record<string, string[]>;
  onFilterChange?: (filterType: string, values: string[]) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const ProductsSidebar2: React.FC<ProductsSidebar2Props> = ({
  settings = {},
  blocks = [],
  selectedFilters = {},
  onFilterChange,
  isOpen = false,
  onClose,
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

  const handleFilterChange = (filterType: string, itemId: string) => {
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

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        <div className="flex items-center gap-4">
          <button onClick={clearAllFilters} className="text-sm text-blue-600 hover:text-blue-800">
            Clear all
          </button>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter Blocks */}
      <div className="flex-1 overflow-y-auto p-4">
        {blocks.map((block) => (
          <div key={block.id} className="mb-6">
            <button
              onClick={() => toggleSection(block.id)}
              className="flex items-center justify-between w-full text-left mb-3"
            >
              <h3 className="text-base font-semibold text-gray-900">{block.title}</h3>
              {collapsible && (
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections[block.id] ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>

            {expandedSections[block.id] && (
              <div className="space-y-2">
                {block.type === "price" ? (
                  <div className="space-y-3">
                    <input
                      type="range"
                      min={block.min || 0}
                      max={block.max || 10000}
                      value={priceRange.max}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-full accent-blue-600"
                    />
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">{block.currency || "৳"}{priceRange.min}</span>
                      <span className="text-gray-400">-</span>
                      <span className="text-gray-600">{block.currency || "৳"}{priceRange.max}</span>
                    </div>
                    <button
                      onClick={handlePriceApply}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Apply Price
                    </button>
                  </div>
                ) : block.type === "color" ? (
                  <div className="flex flex-wrap gap-3">
                    {block.items?.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleFilterChange("color", item.id)}
                        className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                          selectedFilters.color?.includes(item.id)
                            ? "border-blue-500 scale-110"
                            : "border-gray-200 hover:scale-105"
                        }`}
                        style={{ backgroundColor: item.hex }}
                        title={item.name}
                      >
                        {selectedFilters.color?.includes(item.id) && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : block.type === "size" ? (
                  <div className="flex flex-wrap gap-2">
                    {block.items?.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleFilterChange("size", item.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                          selectedFilters.size?.includes(item.id)
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  block.items?.map((item) => (
                    <label key={item.id} className="flex items-center gap-3 py-1 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedFilters[block.type]?.includes(item.id) || false}
                        onChange={() => handleFilterChange(block.type, item.id)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">{item.name}</span>
                      {item.count !== undefined && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{item.count}</span>
                      )}
                    </label>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Apply Button (Mobile) */}
      <div className="lg:hidden p-4 border-t bg-white">
        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          Show Results
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 bg-white rounded-xl border border-gray-200 h-fit sticky top-24 overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={onClose} />
          <div className="lg:hidden fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 shadow-xl">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
};

export default ProductsSidebar2;
