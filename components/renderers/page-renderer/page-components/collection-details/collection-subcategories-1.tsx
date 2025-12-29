/**
 * Collection Subcategories 1
 * Premium circular grid with enhanced hover effects and animations
 * Enhanced design matching Astro version
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { convertSettingsKeys } from "@/lib/settings-utils";
import type { CollectionDetails as Collection } from "@/hooks/useCollectionDetails";

interface CollectionSubcategories1Props {
  settings?: Record<string, unknown>;
  collection: Collection;
}

interface CollectionSubcategories1Settings {
  title?: string;
  showTitle?: boolean;
  columns?: string;
  columnsMobile?: string;
  columnsTablet?: string;
  showProductCount?: boolean;
  backgroundColor?: string;
  titleColor?: string;
  textColor?: string;
  hoverColor?: string;
  accentColor?: string;
  imageSize?: string;
  borderRadius?: string;
  spacing?: string;
  showDescription?: boolean;
  showIcons?: boolean;
}

export default function CollectionSubcategories1({
  settings = {},
  collection,
}: CollectionSubcategories1Props) {
  const s = convertSettingsKeys<CollectionSubcategories1Settings>(settings);

  const subcategories = collection.children || [];

  if (subcategories.length === 0) {
    return null;
  }

  // Responsive column classes
  const columnClasses = {
    2: "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
    8: "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8",
  };

  // Image size classes
  const imageSizeClasses = {
    small: "w-16 h-16 sm:w-20 sm:h-20",
    medium: "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28",
    large: "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32",
    xlarge: "w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36",
  };

  // Spacing classes
  const spacingClasses = {
    tight: "gap-4 sm:gap-6",
    normal: "gap-6 sm:gap-8",
    loose: "gap-8 sm:gap-10",
    xloose: "gap-10 sm:gap-12",
  };

  return (
    <section
      className="relative overflow-hidden py-12 sm:py-16 lg:py-20"
      style={{ backgroundColor: s.backgroundColor || "#ffffff" }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239CA3AF' fill-opacity='0.1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          {s.showTitle && s.title && (
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
              style={{ color: s.titleColor || "#181D25" }}
            >
              {s.title}
            </h2>
          )}
          <div
            className="w-20 h-1 mx-auto rounded-full"
            style={{ backgroundColor: s.accentColor || "#7c3aed" }}
          ></div>
        </div>

        {/* Subcategories Grid */}
        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <div
            className={`grid ${
              columnClasses[Number(s.columns) as keyof typeof columnClasses] ||
              columnClasses[6]
            } ${
              spacingClasses[s.spacing as keyof typeof spacingClasses] ||
              spacingClasses.normal
            } min-w-max`}
          >
            {subcategories.map((subcategory, index) => (
              <Link
                key={subcategory.id}
                href={`/collections/${subcategory.slug}`}
                className="group flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  backgroundColor: `${s.backgroundColor || "#ffffff"}50`,
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${
                    s.hoverColor || "#7c3aed"
                  }10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${
                    s.backgroundColor || "#ffffff"
                  }50`;
                }}
              >
                {/* Image Container */}
                <div className="relative mb-4 group/image">
                  {/* Glow Effect */}
                  <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 blur-xl"
                    style={{
                      background: `radial-gradient(circle, ${
                        s.accentColor || "#7c3aed"
                      }40 0%, transparent 70%)`,
                      transform: "scale(1.2)",
                    }}
                  />

                  {/* Image */}
                  <div
                    className={`relative ${
                      imageSizeClasses[
                        s.imageSize as keyof typeof imageSizeClasses
                      ] || imageSizeClasses.medium
                    } rounded-full overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 border-4 border-white shadow-lg group-hover/image:shadow-2xl transition-all duration-300`}
                  >
                    {subcategory.image_url ? (
                      <Image
                        src={subcategory.image_url}
                        alt={subcategory.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover/image:scale-110"
                      />
                    ) : (
                      <div
                        className="flex items-center justify-center w-full h-full"
                        style={{ backgroundColor: s.accentColor || "#7c3aed" }}
                      >
                        <svg
                          className="w-1/2 h-1/2 text-white"
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

                    {/* Floating Badge */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                      <svg
                        className="w-3 h-3"
                        style={{ color: s.accentColor || "#7c3aed" }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full">
                  <h3
                    className="font-semibold text-sm sm:text-base mb-2 transition-colors duration-300 group-hover:text-transparent"
                    style={{
                      color: s.textColor || "#374151",
                      backgroundImage: `linear-gradient(135deg, ${
                        s.textColor || "#374151"
                      } 0%, ${s.hoverColor || "#7c3aed"} 100%)`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                    }}
                  >
                    {subcategory.name}
                  </h3>

                  {s.showDescription && subcategory.description && (
                    <p
                      className="text-xs sm:text-sm mb-3 line-clamp-2 opacity-70"
                      style={{ color: s.textColor || "#374151" }}
                    >
                      {subcategory.description}
                    </p>
                  )}

                  {s.showProductCount && subcategory.product_count && (
                    <div
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${s.accentColor || "#7c3aed"}15`,
                        color: s.accentColor || "#7c3aed",
                        border: `1px solid ${s.accentColor || "#7c3aed"}30`,
                      }}
                    >
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      {subcategory.product_count} products
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* View All Link */}
        {subcategories.length > 6 && (
          <div className="text-center mt-8">
            <Link
              href={`/collections/${collection.slug}/categories`}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: `${s.accentColor || "#7c3aed"}10`,
                color: s.accentColor || "#7c3aed",
                border: `1px solid ${s.accentColor || "#7c3aed"}30`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  s.accentColor || "#7c3aed";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${
                  s.accentColor || "#7c3aed"
                }10`;
                e.currentTarget.style.color = s.accentColor || "#7c3aed";
              }}
            >
              <span>View All Categories</span>
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>

      <style>{`
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

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
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
}
