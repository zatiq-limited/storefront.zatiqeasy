/**
 * Collections Grid Component 1 - Featured Layout
 * First collection is featured (large), rest are in grid
 * Matches merchant panel component: CollectionsPage/CollectionsGrid1.jsx
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { convertSettingsKeys } from "@/lib/settings-utils";
import type { Collection } from "@/hooks/useCollections";

interface CollectionsGrid1Settings {
  columns?: number;
  columnsTablet?: number;
  columnsMobile?: number;
  gap?: number;
  cardType?: string;
  showProductCount?: boolean;
  showDescription?: boolean;
  showFeaturedLarge?: boolean;
  backgroundColor?: string;
  cardBgColor?: string;
  cardTitleColor?: string;
  cardDescriptionColor?: string;
  cardCountColor?: string;
  cardCountBgColor?: string;
  cardHoverBorderColor?: string;
  cardOverlayColor?: string;
  cardOverlayOpacity?: number;
  cardTitleFontFamily?: string;
  cardTitleFontSize?: string;
  cardTitleFontWeight?: string;
  cardDescriptionFontFamily?: string;
  cardDescriptionFontSize?: string;
  cardCountFontFamily?: string;
  cardCountFontSize?: string;
}

interface CollectionsGrid1Props {
  settings?: Record<string, unknown>;
  collections: Collection[];
  isLoading?: boolean;
}

export default function CollectionsGrid1({
  settings = {},
  collections,
  isLoading = false,
}: CollectionsGrid1Props) {
  // Convert snake_case settings to camelCase
  const s = convertSettingsKeys<CollectionsGrid1Settings>(settings);

  // Extract settings with defaults
  const showProductCount = s.showProductCount !== false;
  const showDescription = s.showDescription !== false;
  const showFeaturedLarge = s.showFeaturedLarge !== false;

  // Colors
  const backgroundColor = s.backgroundColor || "#f9fafb";
  const cardBgColor = s.cardBgColor || "#FFFFFF";
  const cardTitleColor = s.cardTitleColor || "#111827";
  const cardDescriptionColor = s.cardDescriptionColor || "#6B7280";
  const cardCountColor = s.cardCountColor || "#6B7280";
  const cardCountBgColor = s.cardCountBgColor || "#F3F4F6";
  const cardOverlayOpacity = s.cardOverlayOpacity || 40;

  // Typography
  const cardTitleFontWeight = s.cardTitleFontWeight || "font-bold";

  if (isLoading) {
    return (
      <section className="py-16 md:py-24" style={{ backgroundColor }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`animate-pulse bg-gray-200 rounded-2xl ${
                  i === 0 && showFeaturedLarge
                    ? "md:col-span-2 md:row-span-2 aspect-[12/9]"
                    : "aspect-[4/3]"
                }`}
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
        <div className="container">
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
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((collection, index) => {
            const isFirstCard = index === 0;
            const spanClass =
              isFirstCard && showFeaturedLarge
                ? "md:col-span-2 md:row-span-2"
                : "";

            return (
              <div
                key={collection.id}
                className={`group ${spanClass}`}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Main Collection Card */}
                <Link
                  href={`/collections/${collection.slug || collection.id}`}
                  className="block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  style={{ backgroundColor: cardBgColor }}
                >
                  {/* Collection Image Container */}
                  <div
                    className={`relative overflow-hidden ${
                      isFirstCard && showFeaturedLarge
                        ? "aspect-[12/9]"
                        : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={
                        collection.banner_url ||
                        collection.image_url ||
                        "/placeholder.jpg"
                      }
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized={(
                        collection.banner_url ||
                        collection.image_url ||
                        ""
                      ).startsWith("http")}
                    />

                    {/* Dark Overlay */}
                    <div
                      className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-black/20"
                      style={{ opacity: (cardOverlayOpacity / 100) * 2.5 }}
                    />

                    {/* Product Count Badge */}
                    {showProductCount && (
                      <div className="absolute top-4 right-4 z-10">
                        <div
                          className="px-4 py-2 rounded-lg shadow-xl"
                          style={{ backgroundColor: cardCountBgColor }}
                        >
                          <span
                            className="text-sm font-bold"
                            style={{ color: cardTitleColor }}
                          >
                            {collection.product_count}
                          </span>
                          <span
                            className="text-sm ml-1"
                            style={{ color: cardCountColor }}
                          >
                            items
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Collection Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                      <h2
                        className={`${cardTitleFontWeight} text-white mb-3 ${
                          isFirstCard && showFeaturedLarge
                            ? "text-3xl md:text-4xl"
                            : "text-xl md:text-2xl"
                        }`}
                      >
                        {collection.name}
                      </h2>

                      {showDescription && collection.description && (
                        <p
                          className={`text-white/95 line-clamp-2 mb-4 ${
                            isFirstCard && showFeaturedLarge
                              ? "text-base md:text-lg"
                              : "text-sm"
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
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Subcategories Grid */}
                {collection.children && collection.children.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {collection.children.slice(0, 3).map((child) => (
                      <Link
                        key={child.id}
                        href={`/collections/${child.slug || child.id}`}
                        className="group/child block relative overflow-hidden rounded-xl bg-white shadow hover:shadow-lg transition-all duration-300"
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={child.image_url}
                            alt={child.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover/child:scale-110"
                          />
                          {/* Dark overlay for text visibility */}
                          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent" />

                          {/* Text overlay on image */}
                          <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                            <p className="text-white font-bold text-sm leading-tight mb-1">
                              {child.name}
                            </p>
                            {showProductCount && (
                              <p className="text-white/90 text-xs">
                                {child.product_count} items
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
