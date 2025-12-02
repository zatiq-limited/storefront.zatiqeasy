/**
 * ========================================
 * COLLECTION SUBCATEGORIES 1
 * ========================================
 * Grid layout with circle images
 * Shows children/subcategories of a collection
 */

import React from "react";

interface Subcategory {
  id: number;
  name: string;
  image_url?: string;
  banner_url?: string;
  description?: string;
  product_count?: number;
  serial?: number;
  parent_id?: number;
}

interface Collection {
  id: number;
  title: string;
}

interface CollectionSubcategories1Props {
  subcategories?: Subcategory[];
  collection?: Collection;
  settings?: {
    title?: string;
    showTitle?: boolean;
    columns?: number;
    columnsMobile?: number;
    columnsTablet?: number;
    showProductCount?: boolean;
    backgroundColor?: string;
    titleColor?: string;
    countColor?: string;
    cardStyle?: "circle" | "rounded" | "square";
  };
}

const CollectionSubcategories1: React.FC<CollectionSubcategories1Props> = ({
  subcategories = [],
  collection,
  settings = {},
}) => {
  const {
    title = "Shop by Category",
    showTitle = true,
    columns = 6,
    columnsMobile = 2,
    columnsTablet = 4,
    showProductCount = true,
    backgroundColor = "#ffffff",
    titleColor = "#181D25",
    countColor = "#666666",
    cardStyle = "circle",
  } = settings;

  // Don't render if no subcategories
  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  // Dynamic grid classes based on columns
  const getGridCols = () => {
    const mobileCols = `grid-cols-${columnsMobile}`;
    const tabletCols = `md:grid-cols-${columnsTablet}`;
    const desktopCols = `lg:grid-cols-${columns}`;
    return `${mobileCols} ${tabletCols} ${desktopCols}`;
  };

  // Card style classes
  const getImageContainerClass = () => {
    switch (cardStyle) {
      case "circle":
        return "rounded-full";
      case "rounded":
        return "rounded-2xl";
      case "square":
        return "rounded-none";
      default:
        return "rounded-full";
    }
  };

  return (
    <section
      className="py-8 sm:py-12 lg:py-16"
      style={{ backgroundColor }}
    >
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0 lg:px-8">
        {/* Section Title */}
        {showTitle && title && (
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold"
              style={{ color: titleColor }}
            >
              {title}
            </h2>
          </div>
        )}

        {/* Subcategories Grid */}
        <div className={`grid ${getGridCols()} gap-4 sm:gap-6 lg:gap-8`}>
          {subcategories.map((subcategory) => (
            <a
              key={subcategory.id}
              href={`/collections/${subcategory.id}`}
              className="group flex flex-col items-center text-center transition-transform hover:scale-105"
            >
              {/* Image Container */}
              <div
                className={`relative overflow-hidden ${getImageContainerClass()} w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mb-3 sm:mb-4 bg-gray-100 shadow-md group-hover:shadow-lg transition-shadow`}
              >
                {subcategory.image_url ? (
                  <img
                    src={subcategory.image_url}
                    alt={subcategory.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <svg
                      className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Category Name */}
              <h3
                className="font-semibold text-sm sm:text-base lg:text-lg leading-tight mb-1 group-hover:text-primary transition-colors"
                style={{ color: titleColor }}
              >
                {subcategory.name}
              </h3>

              {/* Product Count */}
              {showProductCount && subcategory.product_count !== undefined && (
                <p
                  className="text-xs sm:text-sm"
                  style={{ color: countColor }}
                >
                  {subcategory.product_count} Products
                </p>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionSubcategories1;
