/**
 * Collections Grid Component 1 - Featured Layout
 * First collection is featured (large), rest are in grid
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

interface CollectionsGrid1Props {
  collections?: Collection[];
  backgroundColor?: string;
}

const CollectionsGrid1: React.FC<CollectionsGrid1Props> = ({
  collections = [],
  backgroundColor = "#f9fafb",
}) => {
  if (!collections || collections.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((collection, index) => (
            <div
              key={collection.id}
              className={`group ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Main Collection Card */}
              <a
                href={`/collections/${collection.id}`}
                className="block relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Collection Image Container */}
                <div
                  className={`relative overflow-hidden ${
                    index === 0 ? "aspect-[16/9]" : "aspect-[4/3]"
                  }`}
                >
                  <img
                    src={
                      collection.banner_url ||
                      collection.image_url
                    }
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20"></div>

                  {/* Product Count Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-xl">
                      <span className="text-sm font-bold text-gray-900">
                        {collection.product_count}
                      </span>
                      <span className="text-sm text-gray-600 ml-1">items</span>
                    </div>
                  </div>

                  {/* Collection Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                    <h2
                      className={`font-bold text-white mb-3 ${
                        index === 0
                          ? "text-3xl md:text-4xl"
                          : "text-xl md:text-2xl"
                      }`}
                    >
                      {collection.name}
                    </h2>

                    {collection.description && (
                      <p
                        className={`text-white/95 line-clamp-2 mb-4 ${
                          index === 0 ? "text-base md:text-lg" : "text-sm"
                        }`}
                      >
                        {collection.description}
                      </p>
                    )}

                    {/* View Button */}
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 font-semibold text-sm rounded-lg hover:bg-gray-100 transition-all group-hover:gap-3">
                      <span>View Collection</span>
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

              {/* Subcategories Grid */}
              {collection.children && collection.children.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {collection.children.slice(0, 3).map((child) => (
                    <a
                      key={child.id}
                      href={`/collections/${child.id}`}
                      className="group/child block relative overflow-hidden rounded-xl bg-white shadow hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={child.image_url}
                          alt={child.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/child:scale-110"
                          loading="lazy"
                        />
                        {/* Dark overlay for text visibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                        {/* Text overlay on image */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                          <p className="text-white font-bold text-sm leading-tight mb-1">
                            {child.name}
                          </p>
                          <p className="text-white/90 text-xs">
                            {child.product_count} items
                          </p>
                        </div>
                      </div>
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

export default CollectionsGrid1;
