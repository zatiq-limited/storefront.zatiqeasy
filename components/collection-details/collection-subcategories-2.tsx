/**
 * Collection Subcategories 2
 * Premium card layout with overlay effects and enhanced animations
 * Enhanced design matching Astro version
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { convertSettingsKeys } from "@/lib/settings-utils";
import type { Collection } from "@/hooks/useCollectionDetails";

interface CollectionSubcategories2Props {
  settings?: Record<string, unknown>;
  collection: Collection;
}

interface CollectionSubcategories2Settings {
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
  cardHeight?: string;
  imageEffect?: string;
  overlayIntensity?: string;
  showDescription?: boolean;
  showIcons?: boolean;
}

export default function CollectionSubcategories2({
  settings = {},
  collection,
}: CollectionSubcategories2Props) {
  const s = convertSettingsKeys<CollectionSubcategories2Settings>(settings);

  const subcategories = collection.children || [];

  if (subcategories.length === 0) {
    return null;
  }

  // Responsive column classes
  const columnClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  };

  // Card height classes
  const heightClasses = {
    small: "h-40 sm:h-44 md:h-48",
    medium: "h-48 sm:h-52 md:h-56",
    large: "h-56 sm:h-64 md:h-72",
    xlarge: "h-64 sm:h-72 md:h-80",
  };

  // Overlay intensity
  const overlayStyles = {
    light: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)",
    medium: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
    heavy: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
    accent: `linear-gradient(135deg, ${s.accentColor || "#7c3aed"}dd 0%, ${s.accentColor || "#7c3aed"}99 50%, rgba(0,0,0,0.3) 100%)`,
  };

  return (
    <section
      className="relative overflow-hidden py-12 sm:py-16 lg:py-20"
      style={{ backgroundColor: s.backgroundColor || "#f9fafb" }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239CA3AF' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
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
          <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: s.accentColor || "#7c3aed" }}></div>
        </div>

        {/* Subcategories Grid */}
        <div className={`grid gap-6 ${columnClasses[Number(s.columns) as keyof typeof columnClasses] || columnClasses[3]}`}>
          {subcategories.map((subcategory, index) => (
            <Link
              key={subcategory.id}
              href={`/collections/${subcategory.slug}`}
              className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                height: heightClasses[s.cardHeight as keyof typeof heightClasses]?.split(' ')[0] || heightClasses.medium,
              }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                {subcategory.image_url ? (
                  <Image
                    src={subcategory.image_url}
                    alt={subcategory.name}
                    fill
                    className={`object-cover transition-transform duration-700 ${
                      s.imageEffect === "zoom" ? "group-hover:scale-110" :
                      s.imageEffect === "rotate" ? "group-hover:scale-110 group-hover:rotate-3" :
                      "group-hover:scale-105"
                    }`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: s.accentColor || "#7c3aed" }}>
                    <svg className="w-1/3 h-1/3 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Overlay */}
              <div
                className="absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                style={{
                  background: overlayStyles[s.overlayIntensity as keyof typeof overlayStyles] || overlayStyles.medium,
                }}
              />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-6">
                {/* Top Badge */}
                <div className="flex justify-between items-start">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      backgroundColor: s.hoverColor || "#7c3aed",
                      color: "#ffffff",
                    }}
                  >
                    Explore
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>

                {/* Bottom Content */}
                <div>
                  <h3
                    className="text-xl sm:text-2xl font-bold mb-2 text-white transform transition-transform duration-300 group-hover:translate-y-1"
                  >
                    {subcategory.name}
                  </h3>

                  {s.showDescription && subcategory.description && (
                    <p className="text-sm sm:text-base text-white/80 mb-3 line-clamp-2">
                      {subcategory.description}
                    </p>
                  )}

                  {s.showProductCount && subcategory.product_count && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      <span className="text-sm font-medium text-white/90">
                        {subcategory.product_count} Products
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          ))}
        </div>

        {/* View All Link */}
        {subcategories.length > 12 && (
          <div className="text-center mt-12">
            <Link
              href={`/collections/${collection.slug}/categories`}
              className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
              style={{
                backgroundColor: s.accentColor || "#7c3aed",
                color: "#ffffff",
              }}
            >
              <span>View All Categories</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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