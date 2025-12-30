/**
 * Collections Grid Component 2 - Regular Grid Layout
 * All collections displayed in equal-sized grid
 * Matches merchant panel component: CollectionsPage/CollectionsGrid2.jsx
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { convertSettingsKeys } from "@/lib/settings-utils";
import type { Collection } from "@/hooks/useCollections";

interface CollectionsGrid2Settings {
  columns?: number;
  columnsTablet?: number;
  columnsMobile?: number;
  gap?: number;
  cardType?: string;
  cardAspectRatio?: string;
  showProductCount?: boolean;
  showDescription?: boolean;
  showViewButton?: boolean;
  backgroundColor?: string;
  cardBgColor?: string;
  cardTitleColor?: string;
  cardDescriptionColor?: string;
  cardCountColor?: string;
  cardCountBgColor?: string;
  cardHoverBorderColor?: string;
  cardOverlayColor?: string;
  cardOverlayOpacity?: number;
  viewButtonColor?: string;
  viewButtonHoverColor?: string;
  cardTitleFontFamily?: string;
  cardTitleFontSize?: string;
  cardTitleFontWeight?: string;
  cardDescriptionFontFamily?: string;
  cardDescriptionFontSize?: string;
  cardCountFontFamily?: string;
  cardCountFontSize?: string;
  viewButtonFontSize?: string;
}

interface CollectionsGrid2Props {
  settings?: Record<string, unknown>;
  collections: Collection[];
  isLoading?: boolean;
}

export default function CollectionsGrid2({
  settings = {},
  collections,
  isLoading = false,
}: CollectionsGrid2Props) {
  // Convert snake_case settings to camelCase
  const s = convertSettingsKeys<CollectionsGrid2Settings>(settings);

  // Extract settings with defaults
  const columns = s.columns || 3;
  const showProductCount = s.showProductCount !== false;
  const showDescription = s.showDescription !== false;
  const showViewButton = s.showViewButton !== false;

  // Colors
  const backgroundColor = s.backgroundColor || "#ffffff";
  const cardBgColor = s.cardBgColor || "#FFFFFF";
  const cardTitleColor = s.cardTitleColor || "#111827";
  const cardCountColor = s.cardCountColor || "#FFFFFF";
  const cardCountBgColor = s.cardCountBgColor || "#00000080";
  const cardOverlayOpacity = s.cardOverlayOpacity || 30;
  const viewButtonColor = s.viewButtonColor || "#FFFFFF";

  // Typography
  const cardTitleFontWeight = s.cardTitleFontWeight || "font-bold";

  // Dynamic grid classes based on columns
  const gridClasses =
    {
      2: "md:grid-cols-2",
      3: "md:grid-cols-2 lg:grid-cols-3",
      4: "md:grid-cols-2 lg:grid-cols-4",
    }[columns] || "md:grid-cols-2 lg:grid-cols-3";

  if (isLoading) {
    return (
      <section className="py-16 md:py-24" style={{ backgroundColor }}>
        <div className="container px-4 2xl:px-6">
          <div className={`grid grid-cols-1 ${gridClasses} gap-6 lg:gap-8`}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 rounded-2xl aspect-[4/3]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <section className="py-16 md:py-24" style={{ backgroundColor }}>
        <div className="container px-4 2xl:px-6">
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Collections Found
            </h3>
            <p className="text-gray-500">
              Add categories to see them displayed here
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor }}>
      <div className="container px-4 2xl:px-6">
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
              <Link
                href={`/collections/${collection.slug || collection.id}`}
                className="block relative overflow-hidden rounded-2xl bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: cardBgColor }}
              >
                {/* Collection Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={collection.banner_url || collection.image_url}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"
                    style={{ opacity: (cardOverlayOpacity / 100) * 2.5 }}
                  />

                  {/* Product Count Badge */}
                  {showProductCount && (
                    <div className="absolute top-4 right-4 z-10">
                      <div
                        className="px-3 py-1.5 rounded-lg shadow-lg"
                        style={{ backgroundColor: cardCountBgColor }}
                      >
                        <span
                          className="text-xs font-bold"
                          style={{ color: cardCountColor }}
                        >
                          {collection.product_count}
                        </span>
                        <span
                          className="text-xs ml-1"
                          style={{ color: cardCountColor }}
                        >
                          items
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Collection Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <h3
                      className={`text-xl ${cardTitleFontWeight} text-white mb-2`}
                    >
                      {collection.name}
                    </h3>

                    {showDescription && collection.description && (
                      <p className="text-white/90 text-sm line-clamp-2 mb-3">
                        {collection.description}
                      </p>
                    )}

                    {/* View Link */}
                    {showViewButton && (
                      <div
                        className="inline-flex items-center gap-2 font-semibold text-sm group-hover:gap-3 transition-all"
                        style={{ color: viewButtonColor }}
                      >
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
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </Link>

              {/* Subcategories - Horizontal List */}
              {collection.children && collection.children.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                  {collection.children.slice(0, 4).map((child) => (
                    <Link
                      key={child.id}
                      href={`/collections/${child.slug || child.id}`}
                      className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
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
}
