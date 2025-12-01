/**
 * ========================================
 * COLLECTION BANNER 2
 * ========================================
 * Editorial asymmetric layout with overlapping elements
 * Inspired by Glossier, Reformation, and Allbirds
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
  imgTag?: string;
}

interface CollectionBanner2Props {
  collection: Collection;
  settings?: {
    showBanner?: boolean;
    showDescription?: boolean;
    showProductCount?: boolean;
    imagePosition?: "left" | "right";
    backgroundColor?: string;
    rate?: number;
    cardTag?: string;
    cardTagValue?: string;
    bannerButtonText?: string;
    bannerButtonLink?: string;
  };
}

const CollectionBanner2: React.FC<CollectionBanner2Props> = ({
  collection,
  settings = {},
}) => {
  const {
    showBanner = true,
    showDescription = true,
    showProductCount = true,
    imagePosition = "right",
    backgroundColor = "#fafafa",
    rate = 4.9,
    cardTag = "New",
    cardTagValue = "Arrival",
    bannerButtonText = "Explore Collection",
    bannerButtonLink = "/products",
  } = settings;

  const bannerImage = collection.banner_url || collection.image;

  return (
    <section
      className="relative py-8 md:py-14 overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Asymmetric Grid Layout - 60/40 split */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
            imagePosition === "left" ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Content Side - 60% width */}
          <div
            className={`lg:col-span-7 ${
              imagePosition === "left" ? "lg:col-start-6" : ""
            }`}
          >
            <div
              className="relative z-10"
              style={{ animation: "fadeInLeft 1s ease-out" }}
            >
              {/* Vertical Label Accent */}
              {collection.subtitle && (
                <div className="flex items-center mb-6">
                  <div className="h-px w-12 bg-gray-900"></div>
                  <span className="ml-4 text-sm font-semibold tracking-widest uppercase text-gray-600">
                    {collection.subtitle}
                  </span>
                </div>
              )}

              {/* Title - Extra Large Display */}
              <h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 leading-[0.95] tracking-tight"
                style={{
                  animation: "fadeInLeft 1s ease-out 0.2s both",
                }}
              >
                {collection.title}
              </h1>

              {/* Description */}
              {showDescription && collection.description && (
                <p
                  className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl"
                  style={{
                    animation: "fadeInLeft 1s ease-out 0.4s both",
                  }}
                >
                  {collection.description}
                </p>
              )}

              {/* Floating Stats Cards */}
              <div
                className="flex flex-wrap gap-4 mb-10"
                style={{ animation: "fadeInLeft 1s ease-out 0.6s both" }}
              >
                {showProductCount && collection.product_count !== undefined && (
                  <div className="group relative backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
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
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {collection.product_count}
                        </p>
                        <p className="text-xs text-gray-600 font-medium">
                          Products
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="group relative backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {cardTag}
                      </p>
                      <p className="text-xs text-gray-600 font-medium">
                        {cardTagValue}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group relative backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{rate}</p>
                      <p className="text-xs text-gray-600 font-medium">Rated</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <a
                href={bannerButtonLink}
                className="group inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 hover:gap-5 hover:pr-6"
                style={{ animation: "fadeInLeft 1s ease-out 0.8s both" }}
              >
                <span>{bannerButtonText}</span>
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
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
              </a>
            </div>
          </div>

          {/* Image Side - 40% width with overlap */}
          {showBanner && bannerImage && (
            <div
              className={`lg:col-span-5 ${
                imagePosition === "left" ? "lg:col-start-1 lg:row-start-1" : ""
              }`}
              style={{ animation: "fadeInRight 1s ease-out 0.4s both" }}
            >
              <div className="relative">
                {/* Main Large Image with artistic treatment */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                  <img
                    src={bannerImage}
                    alt={collection.title}
                    className="w-full h-[500px] md:h-[600px] object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Floating Badge */}
                  {collection.imgTag && (
                    <div className="absolute top-6 right-6 backdrop-blur-md bg-white/90 rounded-full px-4 py-2 shadow-lg">
                      <span className="text-sm font-bold text-gray-900">
                        {collection.imgTag}
                      </span>
                    </div>
                  )}
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-20 blur-3xl"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
};

export default CollectionBanner2;
