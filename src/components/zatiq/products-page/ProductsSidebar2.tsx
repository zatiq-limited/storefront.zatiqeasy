import React, { useState } from "react";

interface Category {
  id: number | string;
  name: string;
  products_count?: number;
  count?: number;
  sub_categories?: Category[];
}

interface ProductsSidebar2Props {
  showCategories?: boolean;
  showPriceFilter?: boolean;
  showColors?: boolean;
  showSizes?: boolean;
  categories?: Category[] | null;
  selectedCategories?: (string | number)[];
  onCategoryChange?: (categoryId: string | number, isSelected: boolean) => void;
  onClearFilters?: () => void;
  priceRange?: { min: number; max: number };
  onPriceRangeChange?: (range: { min: number; max: number }) => void;
  // Button colors
  buttonBgColor?: string;
  buttonTextColor?: string;
}

const ProductsSidebar2: React.FC<ProductsSidebar2Props> = ({
  showCategories = true,
  showPriceFilter = true,
  showColors = true,
  showSizes = true,
  categories = null,
  selectedCategories = [],
  onCategoryChange = null,
  onClearFilters = null,
  priceRange = { min: 0, max: 0 },
  onPriceRangeChange = null,
  // Button colors
  buttonBgColor = "#111827",
  buttonTextColor = "#FFFFFF",
}) => {
  // Local state for price inputs
  const [localPriceMin, setLocalPriceMin] = useState<string>(
    priceRange.min ? String(priceRange.min) : ""
  );
  const [localPriceMax, setLocalPriceMax] = useState<string>(
    priceRange.max ? String(priceRange.max) : ""
  );

  // Apply price range filter
  const handleApplyPriceFilter = () => {
    if (onPriceRangeChange) {
      onPriceRangeChange({
        min: Number(localPriceMin) || 0,
        max: Number(localPriceMax) || 0,
      });
    }
  };

  // Mock categories (used if no real categories provided)
  const mockCategories: Category[] = [
    { id: "all", name: "All Products" },
    { id: "new", name: "New Arrivals" },
    { id: "best", name: "Best Sellers" },
    { id: "sale", name: "On Sale" },
  ];

  // Transform real categories
  const displayCategories =
    categories && categories.length > 0
      ? categories.slice(0, 4).map((cat) => ({ id: cat.id, name: cat.name }))
      : mockCategories;

  return (
    <div className="w-full bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Filters</h3>

      {/* Categories */}
      {showCategories && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
          <div className="space-y-2">
            {displayCategories.map((cat) => {
              const isSelected =
                selectedCategories.includes(cat.id) ||
                selectedCategories.includes(cat.id?.toString());
              return (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) =>
                      onCategoryChange && onCategoryChange(cat.id, e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{cat.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Price */}
      {showPriceFilter && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="number"
              value={localPriceMin}
              onChange={(e) => setLocalPriceMin(e.target.value)}
              placeholder="Min"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              value={localPriceMax}
              onChange={(e) => setLocalPriceMax(e.target.value)}
              placeholder="Max"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <button
            onClick={handleApplyPriceFilter}
            className="w-full py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
          >
            Apply
          </button>
        </div>
      )}

      {/* Colors */}
      {showColors && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Colors</h4>
          <div className="flex flex-wrap gap-2">
            {["#000000", "#FFFFFF", "#FF0000", "#0000FF", "#00FF00", "#FFFF00"].map(
              (color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-blue-500"
                  style={{ backgroundColor: color }}
                />
              )
            )}
          </div>
        </div>
      )}

      {/* Sizes */}
      {showSizes && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Sizes</h4>
          <div className="grid grid-cols-3 gap-2">
            {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                className="py-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 text-sm"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onClearFilters || undefined}
        className="w-full py-3 rounded hover:opacity-90 transition-opacity mt-4"
        style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default ProductsSidebar2;
