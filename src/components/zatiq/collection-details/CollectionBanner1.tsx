/**
 * ========================================
 * COLLECTION BANNER 1
 * ========================================
 * Immersive full-screen hero with parallax effect
 * Inspired by modern Shopify themes like Impulse & Prestige
 */

import React from "react";

interface Collection {
  id: number;
  handle: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  banner_url?: string;
  product_count?: number;
}

interface CollectionBanner1Props {
  collection: Collection;
  settings?: {
    showBanner?: boolean;
    showDescription?: boolean;
    showProductCount?: boolean;
    textPosition?: "left" | "center" | "right";
    overlayOpacity?: number;
    bannerButtonText?: string;
    bannerButtonLink?: string;
  };
}

const CollectionBanner1: React.FC<CollectionBanner1Props> = ({
  collection,
  settings = {},
}) => {
  const {
    showBanner = true,
    showDescription = true,
    showProductCount = true,
    textPosition = "center",
    overlayOpacity = 0.4,
    bannerButtonText = "Explore Collection",
    bannerButtonLink = "/products",
  } = settings;

  const bannerImage = collection.banner_url || collection.image;

  const textAlignClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }[textPosition];

  return (
    <section className="relative h-[85vh] min-h-[750px] overflow-hidden bg-gray-900">
      {/* Parallax Background Image */}
      {showBanner && bannerImage && (
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{
            backgroundImage: `url(${bannerImage})`,
            animation: "parallaxFloat 20s ease-in-out infinite",
          }}
        >
          {/* Elegant Gradient Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/0"
            style={{ opacity: overlayOpacity }}
          />
          {/* Vignette Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>
      )}

      {/* No Image Fallback - Modern Gradient */}
      {(!showBanner || !bannerImage) && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyYy0yLjIxIDAtNCAx Ljc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OS00LTQtNHptMCAyYzEuMTA1IDAgMiAuODk1IDIgMnMtLjg5NSAyLTIgMi0yLS44OTUtMi0yIC44OTUtMiAyLTJ6IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-30" />
        </div>
      )}

      {/* Content Container */}
      <div className="relative h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex flex-col ${textAlignClass} max-w-4xl ${textPosition === 'center' ? 'mx-auto' : ''}`}>

            {/* Animated Badge */}
            {collection.subtitle && (
              <div
                className="inline-flex items-center backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-6"
                style={{ animation: "fadeInUp 0.8s ease-out" }}
              >
                <span className="relative flex h-2 w-2 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="text-white text-sm font-medium tracking-wider uppercase">
                  {collection.subtitle}
                </span>
              </div>
            )}

            {/* Title with Modern Typography */}
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight tracking-tight"
              style={{
                animation: "fadeInUp 0.8s ease-out 0.2s both",
                textShadow: "0 4px 60px rgba(0,0,0,0.5)",
              }}
            >
              {collection.title}
            </h1>

            {/* Description */}
            {showDescription && collection.description && (
              <p
                className="text-white/90 text-lg sm:text-xl lg:text-2xl font-light max-w-2xl mb-10 leading-relaxed"
                style={{
                  animation: "fadeInUp 0.8s ease-out 0.4s both",
                  textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                }}
              >
                {collection.description}
              </p>
            )}

            {/* Action Row */}
            <div
              className={`flex flex-wrap gap-6 ${textPosition === 'center' ? 'justify-center' : ''}`}
              style={{ animation: "fadeInUp 0.8s ease-out 0.6s both" }}
            >
              {/* Explore Button */}
              <a
                href={bannerButtonLink}
                className="group relative inline-flex items-center overflow-hidden rounded-full bg-white text-gray-900 px-8 py-4 font-semibold shadow-2xl transition-all hover:scale-105 hover:shadow-white/25"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center group-hover:text-white transition-colors">
                  {bannerButtonText}
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
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

              {/* Product Count Badge */}
              {showProductCount && collection.product_count !== undefined && (
                <div className="inline-flex items-center backdrop-blur-md bg-black/20 border border-white/30 rounded-full px-6 py-4 text-white">
                  <svg
                    className="w-5 h-5 mr-3 opacity-80"
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
                  <span className="font-semibold">{collection.product_count} Products</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a
        href="#products"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-black hover:text-white transition-colors"
        style={{ animation: "bounce 2s infinite" }}
      >
        <span className="text-sm font-medium mb-2 tracking-wider uppercase">Scroll</span>
        <svg
          className="w-6 h-6"
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

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />

      {/* Animations */}
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
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </section>
  );
};

export default CollectionBanner1;
