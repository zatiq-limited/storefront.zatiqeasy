/**
 * Collections Grid Component 2 - Regular Grid Layout
 * All collections displayed in equal-sized grid
 */

import React from "react";

interface Collection {
  id: number;
  name: string;
  image_url: string;
  banner_url?: string;
  description?: string;
  product_count: number;
  children?: Collection[];
}

interface CollectionsGrid2Props {
  collections?: Collection[];
  backgroundColor?: string;
  columns?: number; // Number of columns: 2, 3, or 4
}

const CollectionsGrid2: React.FC<CollectionsGrid2Props> = ({
  collections = [],
  backgroundColor = "#000000",
  columns = 3,
}) => {
  if (!collections || collections.length === 0) {
    return null;
  }

  // Dynamic grid classes based on columns
  const gridClasses = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  }[columns] || "md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-6">
        <div className={`grid grid-cols-1 ${gridClasses} gap-6 lg:gap-8`}>
          {collections.map((collection, index) => (
            <div
              key={collection.id}
              className="group"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Collection Card */}
              <a
                href={`/collections/${collection.id}`}
                className="block relative overflow-hidden rounded-2xl bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Collection Image */}
                <div className="relative aspect-4/3 overflow-hidden">
                  <img
                    src={collection.banner_url || collection.image_url}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>

                  {/* Product Count Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg">
                      <span className="text-xs font-bold text-gray-900">
                        {collection.product_count}
                      </span>
                      <span className="text-xs text-gray-600 ml-1">items</span>
                    </div>
                  </div>

                  {/* Collection Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {collection.name}
                    </h3>

                    {collection.description && (
                      <p className="text-white/90 text-sm line-clamp-2 mb-3">
                        {collection.description}
                      </p>
                    )}

                    {/* View Link */}
                    <div className="inline-flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
                      <span>Explore</span>
                      <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </a>

              {/* Subcategories - Horizontal List */}
              {collection.children && collection.children.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                  {collection.children.slice(0, 4).map((child) => (
                    <a
                      key={child.id}
                      href={`/collections/${child.id}`}
                      className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 transition-colors"
                      style={{ backgroundColor: backgroundColor }}
                    >
                      {child.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default CollectionsGrid2;
