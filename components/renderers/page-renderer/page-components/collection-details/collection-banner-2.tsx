/**
 * Collection Banner 2
 * Editorial asymmetric layout with overlapping elements
 * Enhanced design matching Astro version
 */

"use client";

import { convertSettingsKeys } from "@/lib/settings-utils";
import type { CollectionDetails as Collection } from "@/hooks/useCollectionDetails";
import Image from "next/image";

interface CollectionBanner2Props {
  settings?: Record<string, unknown>;
  collection: Collection;
}

interface CollectionBanner2Settings {
  showBanner?: boolean;
  showDescription?: boolean;
  showProductCount?: boolean;
  imagePosition?: "left" | "right";
  backgroundColor?: string;
  cardBackgroundColor?: string;
  titleColor?: string;
  descriptionColor?: string;
  badgeBackgroundColor?: string;
  badgeTextColor?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  bannerButtonText?: string;
  bannerButtonLink?: string;
}

export default function CollectionBanner2({
  settings = {},
  collection,
}: CollectionBanner2Props) {
  const s = convertSettingsKeys<CollectionBanner2Settings>(settings);

  const bannerImage = collection.image_url || collection.banner_url;

  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-32"
      style={{ backgroundColor: s.backgroundColor || "#f9fafb" }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239CA3AF' opacity='.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center ${
            s.imagePosition === "left" ? "lg:grid-flow-col-dense" : ""
          }`}
        >
          {/* Content Card */}
          <div
            className={`${s.imagePosition === "left" ? "lg:col-start-2" : ""}`}
          >
            <div
              className="relative p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl shadow-xl backdrop-blur-sm border border-white/50"
              style={{
                backgroundColor: s.cardBackgroundColor || "#ffffff",
                animation: "fadeInUp 0.8s ease-out",
              }}
            >
              {/* Glow Effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 blur-xl transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
                }}
              />

              {/* Product Count Badge */}
              {s.showProductCount && collection.product_count && (
                <div
                  className="inline-flex items-center px-4 py-2 rounded-lg font-semibold mb-4 sm:mb-6"
                  style={{
                    backgroundColor: s.badgeBackgroundColor || "#ecfdf5",
                    color: s.badgeTextColor || "#059669",
                    animation: "fadeInUp 0.8s ease-out 0.2s both",
                  }}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
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
                  <span>{collection.product_count} Products</span>
                </div>
              )}

              {/* Title */}
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
                style={{
                  animation: "fadeInUp 0.8s ease-out 0.3s both",
                  color: s.titleColor || "#111827",
                }}
              >
                {collection.name}
              </h1>

              {/* Description */}
              {s.showDescription && collection.description && (
                <p
                  className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed"
                  style={{
                    animation: "fadeInUp 0.8s ease-out 0.4s both",
                    color: s.descriptionColor || "#6b7280",
                  }}
                >
                  {collection.description}
                </p>
              )}

              {/* CTA Button */}
              {s.bannerButtonText && (
                <a
                  href={s.bannerButtonLink || "#products"}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold transition-all hover:scale-105 hover:shadow-2xl"
                  style={{
                    animation: "fadeInUp 0.8s ease-out 0.5s both",
                    backgroundColor: s.buttonBackgroundColor || "#111827",
                    color: s.buttonTextColor || "#ffffff",
                  }}
                >
                  <span className="absolute inset-0 bg-linear-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center justify-center">
                    {s.bannerButtonText}
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
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
                  </span>
                </a>
              )}

              {/* Decorative Elements */}
              <div
                className="absolute -top-2 -right-2 w-24 h-24 bg-linear-to-br from-purple-400 to-pink-400 rounded-full opacity-10 blur-2xl"
                style={{ animation: "float 6s ease-in-out infinite" }}
              />
              <div
                className="absolute -bottom-2 -left-2 w-32 h-32 bg-linear-to-tr from-blue-400 to-green-400 rounded-full opacity-10 blur-2xl"
                style={{ animation: "float 8s ease-in-out infinite reverse" }}
              />
            </div>
          </div>

          {/* Image */}
          {s.showBanner && bannerImage && (
            <div
              className={`${
                s.imagePosition === "right" ? "" : "lg:col-start-1"
              }`}
            >
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-full min-h-[400px] rounded-2xl overflow-hidden group">
                {/* Main Image */}
                <Image
                  src={bannerImage}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Floating Badge */}
                <div
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg transform transition-all duration-300 group-hover:scale-110"
                  style={{ animation: "fadeInUp 0.8s ease-out 0.6s both" }}
                >
                  <span className="text-xs sm:text-sm font-medium text-gray-800">
                    Featured
                  </span>
                </div>

                {/* Decorative Corner */}
                <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-b-[40px] border-b-white opacity-20" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
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

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </section>
  );
}
