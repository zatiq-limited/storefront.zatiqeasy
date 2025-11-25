/**
 * Collections Hero Component 2
 * Modern split-screen hero with image and content
 */

import React from "react";

interface CollectionsHero2Props {
  title?: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string;
  backgroundColor?: string;
  textColor?: string;
  imagePosition?: "left" | "right";
}

const CollectionsHero2: React.FC<CollectionsHero2Props> = ({
  title = "Discover Your Style",
  subtitle = "Curated Collections",
  description = "Explore our handpicked collections crafted for every occasion and trend. From timeless classics to the latest trends, find pieces that define your unique style.",
  badge = "New Season",
  buttonText = "Explore Collections",
  buttonLink = "#collections",
  image = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80",
  backgroundColor = "#f8f9fa",
  textColor = "#1a1a1a",
  imagePosition = "right",
}) => {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`grid lg:grid-cols-2 gap-0 min-h-[500px] lg:min-h-[600px] ${
            imagePosition === "left" ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Content Side */}
          <div
            className={`flex items-center px-6 sm:px-10 lg:px-16 py-16 lg:py-20 ${
              imagePosition === "left" ? "lg:order-2" : ""
            }`}
          >
            <div className="max-w-xl">
              {/* Badge */}
              {badge && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full mb-6">
                  <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
                  <span
                    className="text-sm font-semibold uppercase tracking-wider"
                    style={{ color: textColor }}
                  >
                    {badge}
                  </span>
                </div>
              )}

              {/* Subtitle */}
              {subtitle && (
                <p
                  className="text-sm uppercase tracking-[0.2em] font-bold mb-4 opacity-70"
                  style={{ color: textColor }}
                >
                  {subtitle}
                </p>
              )}

              {/* Title */}
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                style={{ color: textColor }}
              >
                {title}
              </h1>

              {/* Description */}
              {description && (
                <p
                  className="text-lg sm:text-xl mb-8 leading-relaxed opacity-80"
                  style={{ color: textColor }}
                >
                  {description}
                </p>
              )}

              {/* CTA Button */}
              {buttonText && (
                <a
                  href={buttonLink}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 group"
                >
                  <span>{buttonText}</span>
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
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
                </a>
              )}

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                <div>
                  <div
                    className="text-3xl font-bold mb-1"
                    style={{ color: textColor }}
                  >
                    50+
                  </div>
                  <div
                    className="text-sm opacity-70"
                    style={{ color: textColor }}
                  >
                    Collections
                  </div>
                </div>
                <div>
                  <div
                    className="text-3xl font-bold mb-1"
                    style={{ color: textColor }}
                  >
                    1000+
                  </div>
                  <div
                    className="text-sm opacity-70"
                    style={{ color: textColor }}
                  >
                    Products
                  </div>
                </div>
                <div>
                  <div
                    className="text-3xl font-bold mb-1"
                    style={{ color: textColor }}
                  >
                    4.9
                  </div>
                  <div
                    className="text-sm opacity-70"
                    style={{ color: textColor }}
                  >
                    Rating
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div
            className={`relative overflow-hidden ${
              imagePosition === "left" ? "lg:order-1" : ""
            }`}
          >
            {/* Background Image */}
            <img
              src={image}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/20 to-transparent"></div>

            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full"></div>
            <div className="absolute bottom-20 left-10 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionsHero2;
