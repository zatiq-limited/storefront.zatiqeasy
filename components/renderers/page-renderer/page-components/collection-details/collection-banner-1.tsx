/**
 * Collection Banner 1
 * Immersive full-screen hero with parallax effect
 * Enhanced design matching Astro version
 */

"use client";

import { convertSettingsKeys } from "@/lib/settings-utils";
import type { CollectionDetails as Collection } from "@/hooks/useCollectionDetails";

interface CollectionBanner1Props {
  settings?: Record<string, unknown>;
  collection: Collection;
}

interface CollectionBanner1Settings {
  showBanner?: boolean;
  showDescription?: boolean;
  showProductCount?: boolean;
  textPosition?: "left" | "center" | "right";
  height?: "small" | "medium" | "large";
  overlayOpacity?: string;
  textColor?: string;
  badgeBackgroundColor?: string;
  badgeTextColor?: string;
  bannerButtonText?: string;
  bannerButtonLink?: string;
}

export default function CollectionBanner1({
  settings = {},
  collection,
}: CollectionBanner1Props) {
  const s = convertSettingsKeys<CollectionBanner1Settings>(settings);

  const bannerImage = collection.image_url || collection.banner_url;

  const heightClasses = {
    small:
      "h-[40vh] min-h-[300px] sm:h-[45vh] sm:min-h-[350px] md:h-[50vh] md:min-h-[400px] lg:h-[55vh] lg:min-h-[450px]",
    medium:
      "h-[50vh] min-h-[350px] sm:h-[60vh] sm:min-h-[400px] md:h-[70vh] md:min-h-[500px] lg:h-[80vh] lg:min-h-[600px]",
    large:
      "h-[60vh] min-h-[400px] sm:h-[70vh] sm:min-h-[500px] md:h-[80vh] md:min-h-[600px] lg:h-[90vh] lg:min-h-[700px]",
  };

  const textPositionClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <section
      className={`relative ${
        heightClasses[s.height || "medium"]
      } overflow-hidden bg-gray-900`}
    >
      {/* Background Image with enhanced effects */}
      {s.showBanner && bannerImage && (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105"
            style={{
              backgroundImage: `url(${bannerImage})`,
              animation: "parallaxFloat 20s ease-in-out infinite",
            }}
          />
          {/* Enhanced gradient overlay */}
          <div
            className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/50 md:from-transparent md:via-black/20 md:to-black/0"
            style={{ opacity: parseFloat(s.overlayOpacity || "0.5") }}
          />
          {/* Vignette effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>
      )}

      {/* No image fallback - modern gradient */}
      {(!s.showBanner || !bannerImage) && (
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 18c3.314 0 6 2.686 6 6s-2.686 6-6 6-6-2.686-6-6 2.686-6 6-6zm0 2c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 2c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2z' fill='%23fff' opacity='.05'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="w-full container px-4 sm:px-6 lg:px-8">
          <div
            className={`flex flex-col ${
              textPositionClasses[s.textPosition || "center"]
            } max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl ${
              s.textPosition === "center" ? "mx-auto" : ""
            }`}
          >
            {/* Product count badge */}
            {s.showProductCount && collection.product_count && (
              <div
                className="inline-flex items-center backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2 mb-3 sm:mb-4 md:mb-6"
                style={{ animation: "fadeInUp 0.8s ease-out" }}
              >
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 mr-2 sm:mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-white"></span>
                </span>
                <span
                  className="text-white text-xs sm:text-sm font-medium tracking-wider uppercase"
                  style={{ color: s.textColor || "#ffffff" }}
                >
                  {collection.product_count} Products
                </span>
              </div>
            )}

            {/* Title with enhanced typography */}
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 lg:mb-6 leading-tight tracking-tight"
              style={{
                animation: "fadeInUp 0.8s ease-out 0.2s both",
                textShadow: "0 4px 60px rgba(0,0,0,0.5)",
                color: s.textColor || "#ffffff",
              }}
            >
              {collection.name}
            </h1>

            {/* Description */}
            {s.showDescription && collection.description && (
              <p
                className="text-sm sm:text-base md:text-lg lg:text-xl font-light max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mb-4 sm:mb-6 md:mb-8 lg:mb-10 leading-relaxed"
                style={{
                  animation: "fadeInUp 0.8s ease-out 0.4s both",
                  textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                  color: s.textColor || "#ffffff",
                  opacity: 0.9,
                }}
              >
                {collection.description}
              </p>
            )}

            {/* Action buttons */}
            <div
              className={`flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 md:gap-6 ${
                s.textPosition === "center" ? "justify-center items-center" : ""
              }`}
              style={{ animation: "fadeInUp 0.8s ease-out 0.6s both" }}
            >
              {/* CTA Button with hover effect */}
              {s.bannerButtonText && (
                <a
                  href={s.bannerButtonLink || "#products"}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base font-semibold shadow-2xl transition-all hover:scale-105 hover:shadow-white/25 w-full sm:w-auto"
                  style={{
                    backgroundColor: s.badgeBackgroundColor || "#ffffff",
                    color: s.badgeTextColor || "#111827",
                  }}
                >
                  <span className="absolute inset-0 bg-linear-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center justify-center group-hover:text-white transition-colors">
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
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#products"
        className="hidden sm:flex absolute bottom-4 md:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex-col items-center text-white/80 hover:text-white transition-colors"
        style={{ animation: "bounce 2s infinite" }}
      >
        <span className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 tracking-wider uppercase">
          Scroll
        </span>
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </a>

      {/* Decorative bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 md:h-24 lg:h-32 bg-linear-to-t from-white/80 to-transparent pointer-events-none" />

      {/* Enhanced animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes parallaxFloat {
          0%, 100% {
            transform: scale(1.05) translateY(0);
          }
          50% {
            transform: scale(1.08) translateY(-10px);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-10px);
          }
        }
      `}</style>
    </section>
  );
}
