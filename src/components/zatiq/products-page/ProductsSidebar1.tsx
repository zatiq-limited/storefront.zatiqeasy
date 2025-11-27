import React, { useState } from "react";

interface Category {
  id: number | string;
  name: string;
  products_count?: number;
  count?: number;
  sub_categories?: Category[];
}

interface ProductsSidebar1Props {
  // Visibility settings
  collapsible?: boolean;

  // Colors
  bgColor?: string;
  borderColor?: string;
  titleColor?: string;
  sectionTitleColor?: string;
  textColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  clearButtonColor?: string;

  // Font settings
  titleFontFamily?: string;
  titleFontSize?: string;
  titleFontWeight?: string;
  sectionTitleFontFamily?: string;
  sectionTitleFontSize?: string;
  sectionTitleFontWeight?: string;
  textFontFamily?: string;
  textFontSize?: string;

  // Data
  categories?: Category[] | null;
  selectedCategories?: (string | number)[];
  onCategoryChange?: (categoryId: string | number, isSelected: boolean) => void;
  onClearFilters?: () => void;
  priceRange?: { min: number; max: number };
  onPriceRangeChange?: (range: { min: number; max: number }) => void;
}

// FilterSection moved outside to prevent re-creation on every render
const FilterSection: React.FC<{
  id: string;
  title: string;
  isExpanded: boolean;
  children: React.ReactNode;
  borderColor: string;
  collapsible: boolean;
  sectionTitleFontSize: string;
  sectionTitleFontWeight: string;
  sectionTitleColor: string;
  sectionTitleFontFamily: string;
  onToggle: (id: string) => void;
}> = ({
  id,
  title,
  isExpanded,
  children,
  borderColor,
  collapsible,
  sectionTitleFontSize,
  sectionTitleFontWeight,
  sectionTitleColor,
  sectionTitleFontFamily,
  onToggle,
}) => {
  const getSectionTitleFontStyle = (): React.CSSProperties => {
    return sectionTitleFontFamily !== "inherit"
      ? { fontFamily: sectionTitleFontFamily, color: sectionTitleColor }
      : { color: sectionTitleColor };
  };

  return (
    <div className="py-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
      <button onClick={() => onToggle(id)} className="flex items-center justify-between w-full text-left">
        <h3 className={`${sectionTitleFontSize} ${sectionTitleFontWeight}`} style={getSectionTitleFontStyle()}>
          {title}
        </h3>
        {collapsible && (
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            style={{ color: sectionTitleColor }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
      {isExpanded && <div className="mt-4">{children}</div>}
    </div>
  );
};

const ProductsSidebar1: React.FC<ProductsSidebar1Props> = ({
  collapsible = true,
  bgColor = "#FFFFFF",
  borderColor = "#E5E7EB",
  titleColor = "#111827",
  sectionTitleColor = "#111827",
  textColor = "#374151",
  buttonBgColor = "#111827",
  buttonTextColor = "#FFFFFF",
  clearButtonColor = "#3B82F6",
  titleFontFamily = "inherit",
  titleFontSize = "text-lg",
  titleFontWeight = "font-bold",
  sectionTitleFontFamily = "inherit",
  sectionTitleFontSize = "text-sm",
  sectionTitleFontWeight = "font-semibold",
  textFontFamily = "inherit",
  textFontSize = "text-sm",
  categories = null,
  selectedCategories = [],
  onCategoryChange = null,
  onClearFilters = null,
  priceRange = { min: 0, max: 0 },
  onPriceRangeChange = null,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    brand: true,
    color: true,
    size: true,
  });

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Local state for price inputs (before applying)
  const [localPriceMin, setLocalPriceMin] = useState<string>(priceRange.min ? String(priceRange.min) : "");
  const [localPriceMax, setLocalPriceMax] = useState<string>(priceRange.max ? String(priceRange.max) : "");

  // Apply price range filter
  const handleApplyPriceFilter = () => {
    if (onPriceRangeChange) {
      onPriceRangeChange({
        min: Number(localPriceMin) || 0,
        max: Number(localPriceMax) || 0,
      });
    }
  };

  const toggleSection = (id: string) => {
    if (!collapsible) return;
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCategory = (categoryId: string | number) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const getTitleFontStyle = (): React.CSSProperties => {
    return titleFontFamily !== "inherit" ? { fontFamily: titleFontFamily, color: titleColor } : { color: titleColor };
  };

  const getTextFontStyle = (): React.CSSProperties => {
    return textFontFamily !== "inherit" ? { fontFamily: textFontFamily, color: textColor } : { color: textColor };
  };

  // Mock data (used if no real categories provided)
  const mockCategories: Category[] = [
    { id: "1", name: "Women's Fashion", count: 45 },
    { id: "2", name: "Men's Fashion", count: 38 },
    { id: "3", name: "Accessories", count: 22 },
    { id: "4", name: "Bags", count: 15 },
    { id: "5", name: "Shoes", count: 28 },
  ];

  // Transform real categories to match component structure
  const transformCategory = (category: Category): Category => ({
    id: category.id?.toString() || String(category.id),
    name: category.name,
    count: category.products_count || category.count || 0,
    sub_categories: category.sub_categories || [],
  });

  // Use real categories if provided, otherwise use mock categories
  const displayCategories = categories && categories.length > 0 ? categories.map(transformCategory) : mockCategories;

  // Recursive function to render category items with subcategories
  const renderCategoryItem = (category: Category, level: number = 0) => {
    const hasSubcategories = category.sub_categories && category.sub_categories.length > 0;
    const isExpanded = expandedCategories[category.id];
    const isSelected =
      selectedCategories.includes(category.id) || selectedCategories.includes(category.id?.toString());

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCategoryChange) {
        onCategoryChange(category.id, e.target.checked);
      }
    };

    return (
      <div key={category.id}>
        <div className="flex items-center gap-2 cursor-pointer group py-1" style={{ paddingLeft: `${level * 12}px` }}>
          {/* Expand/Collapse button for categories with subcategories */}
          {hasSubcategories ? (
            <button
              onClick={() => toggleCategory(category.id)}
              className="shrink-0 w-4 h-4 flex items-center justify-center hover:bg-gray-100 rounded"
            >
              <svg
                className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                style={{ color: textColor }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <span className="w-4" />
          )}

          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
          />

          {/* Category name */}
          <span
            className={`${textFontSize} flex-1`}
            style={getTextFontStyle()}
            onClick={() => onCategoryChange && onCategoryChange(category.id, !isSelected)}
          >
            {category.name}
          </span>

          {/* Product count */}
          <span className="text-xs text-gray-400">({category.count})</span>
        </div>

        {/* Render subcategories if expanded */}
        {hasSubcategories && isExpanded && (
          <div className="mt-1">
            {category.sub_categories!.map((subCategory) => {
              const transformedSubCategory = transformCategory(subCategory);
              return renderCategoryItem(transformedSubCategory, level + 1);
            })}
          </div>
        )}
      </div>
    );
  };

  const brands = [
    { id: "1", name: "ZatiqStyle", count: 25 },
    { id: "2", name: "ZatiqDenim", count: 18 },
    { id: "3", name: "ZatiqBasics", count: 32 },
    { id: "4", name: "ZatiqLux", count: 12 },
  ];

  const colors = [
    { id: "1", name: "Black", hex: "#000000", count: 45 },
    { id: "2", name: "White", hex: "#FFFFFF", count: 38 },
    { id: "3", name: "Blue", hex: "#3B82F6", count: 22 },
    { id: "4", name: "Red", hex: "#EF4444", count: 15 },
    { id: "5", name: "Brown", hex: "#92400E", count: 18 },
  ];

  const sizes = [
    { id: "1", name: "XS", count: 12 },
    { id: "2", name: "S", count: 28 },
    { id: "3", name: "M", count: 45 },
    { id: "4", name: "L", count: 38 },
    { id: "5", name: "XL", count: 22 },
    { id: "6", name: "XXL", count: 10 },
  ];

  // Common props for FilterSection
  const filterSectionProps = {
    borderColor,
    collapsible,
    sectionTitleFontSize,
    sectionTitleFontWeight,
    sectionTitleColor,
    sectionTitleFontFamily,
    onToggle: toggleSection,
  };

  return (
    <aside
      className="w-full lg:w-64 rounded-lg p-4 h-fit lg:sticky lg:top-24"
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={`${titleFontSize} ${titleFontWeight}`} style={getTitleFontStyle()}>
          Filters
        </h2>
        <button
          className={`${textFontSize} hover:underline`}
          style={{ color: clearButtonColor }}
          onClick={onClearFilters || undefined}
        >
          Clear all
        </button>
      </div>

      <div>
        {/* Categories */}
        <FilterSection id="category" title="Categories" isExpanded={expandedSections.category} {...filterSectionProps}>
          <div className="space-y-2">{displayCategories.map((item) => renderCategoryItem(item))}</div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection id="price" title="Price Range" isExpanded={expandedSections.price} {...filterSectionProps}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={localPriceMin}
                onChange={(e) => setLocalPriceMin(e.target.value)}
                placeholder="Min"
                className={`w-full px-3 py-2 rounded-md ${textFontSize}`}
                style={{
                  borderWidth: "1px",
                  borderColor: borderColor,
                  ...getTextFontStyle(),
                }}
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                value={localPriceMax}
                onChange={(e) => setLocalPriceMax(e.target.value)}
                placeholder="Max"
                className={`w-full px-3 py-2 rounded-md ${textFontSize}`}
                style={{
                  borderWidth: "1px",
                  borderColor: borderColor,
                  ...getTextFontStyle(),
                }}
              />
            </div>
            <button
              onClick={handleApplyPriceFilter}
              className={`w-full py-2 rounded-md ${textFontSize} font-medium transition-colors`}
              style={{
                backgroundColor: buttonBgColor,
                color: buttonTextColor,
              }}
            >
              Apply
            </button>
          </div>
        </FilterSection>

        {/* Brands */}
        <FilterSection id="brand" title="Brands" isExpanded={expandedSections.brand} {...filterSectionProps}>
          <div className="space-y-3">
            {brands.map((item) => (
              <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className={`${textFontSize} flex-1`} style={getTextFontStyle()}>
                  {item.name}
                </span>
                <span className="text-xs text-gray-400">({item.count})</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Colors */}
        <FilterSection id="color" title="Colors" isExpanded={expandedSections.color} {...filterSectionProps}>
          <div className="flex flex-wrap gap-2">
            {colors.map((item) => (
              <button
                key={item.id}
                className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-blue-500 transition-colors"
                style={{ backgroundColor: item.hex }}
                title={item.name}
              />
            ))}
          </div>
        </FilterSection>

        {/* Sizes */}
        <FilterSection id="size" title="Sizes" isExpanded={expandedSections.size} {...filterSectionProps}>
          <div className="flex flex-wrap gap-2">
            {sizes.map((item) => (
              <button
                key={item.id}
                className={`px-4 py-2 rounded-md border transition-all ${textFontSize}`}
                style={{
                  borderColor: borderColor,
                  ...getTextFontStyle(),
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        </FilterSection>
      </div>
    </aside>
  );
};

export default ProductsSidebar1;
