/**
 * ========================================
 * COLLECTION SUBCATEGORIES 2
 * ========================================
 * Card layout with overlay text
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

interface CollectionSubcategories2Props {
  subcategories?: Subcategory[];
  collection?: Collection;
  settings?: {
    title?: string;
    showTitle?: boolean;
    columns?: number;
    columnsMobile?: number;
    columnsTablet?: number;
    showProductCount?: boolean;
    showDescription?: boolean;
    backgroundColor?: string;
    titleColor?: string;
    cardTextColor?: string;
    overlayOpacity?: number;
  };
}

const CollectionSubcategories2: React.FC<CollectionSubcategories2Props> = ({
  subcategories = [],
  collection,
  settings = {},
}) => {
  const {
    title = "Shop by Category",
    showTitle = true,
    columns = 4,
    columnsMobile = 1,
    columnsTablet = 2,
    showProductCount = true,
    showDescription = false,
    backgroundColor = "#f9fafb",
    titleColor = "#181D25",
    cardTextColor = "#ffffff",
    overlayOpacity = 0.5,
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

  return (
    <section className="py-8 sm:py-12 lg:py-16" style={{ backgroundColor }}>
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
        <div className={`grid ${getGridCols()} gap-4 sm:gap-6`}>
          {subcategories.map((subcategory, index) => (
            <a
              key={subcategory.id}
              href={`/collections/${subcategory.id}`}
              className="group relative block overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Image */}
              <div className="aspect-4/3 relative overflow-hidden">
                {subcategory.image_url || subcategory.banner_url ? (
                  <img
                    src={subcategory.banner_url || subcategory.image_url}
                    alt={subcategory.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-200 to-gray-300">
                    <svg
                      className="w-16 h-16 text-gray-400"
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

                {/* Gradient Overlay */}
                <div
                  className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent"
                  style={{ opacity: overlayOpacity }}
                />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10">
                  {/* Category Name */}
                  <h3
                    className="font-bold text-lg sm:text-xl lg:text-2xl mb-1 leading-tight"
                    style={{ color: cardTextColor }}
                  >
                    {subcategory.name}
                  </h3>

                  {/* Description */}
                  {showDescription && subcategory.description && (
                    <p
                      className="text-sm opacity-90 line-clamp-2 mb-2"
                      style={{ color: cardTextColor }}
                    >
                      {subcategory.description}
                    </p>
                  )}

                  {/* Product Count & Arrow */}
                  <div className="flex items-center justify-between">
                    {showProductCount &&
                      subcategory.product_count !== undefined && (
                        <span
                          className="text-sm opacity-80"
                          style={{ color: cardTextColor }}
                        >
                          {subcategory.product_count} Products
                        </span>
                      )}

                    {/* Arrow Icon */}
                    <div
                      className="flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all"
                      style={{ color: cardTextColor }}
                    >
                      <span>Shop</span>
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Product Count Badge (Top Right) */}
                {showProductCount &&
                  subcategory.product_count !== undefined && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-md">
                        <span className="text-xs font-bold text-gray-900">
                          {subcategory.product_count}
                        </span>
                        <span className="text-xs text-gray-600 ml-1">
                          items
                        </span>
                      </div>
                    </div>
                  )}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default CollectionSubcategories2;
