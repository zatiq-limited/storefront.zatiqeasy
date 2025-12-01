/**
 * Collections Hero Component 2
 * Modern split-screen hero with image and content
 */

import React from "react";

interface CollectionsHero2Props {
  title?: string;
  subtitle?: string;
  badge?: string;
  buttonText?: string;
  buttonLink?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  image?: string;
  backgroundColor?: string;
  textColor?: string;
  imagePosition?: "left" | "right";
  badgeColor?: string;
  showStats?: boolean;
  stats?: {
    label: string;
    value: string;
  }[];
}

const CollectionsHero2: React.FC<CollectionsHero2Props> = ({
  title = "Discover Your Style",
  subtitle = "Curated Collections",
  badge = "New Season",
  badgeColor = "#ff6f61",
  buttonText = "Explore Collections",
  buttonLink = "/products",
  buttonBackgroundColor = "#ff6f61",
  buttonTextColor = "#ffffff",
  image = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80",
  backgroundColor = "#f8f9fa",
  textColor = "#1a1a1a",
  imagePosition = "right",
  showStats = true,
  stats = [
    { label: "Collections", value: "50+" },
    { label: "Products", value: "1000+" },
    { label: "Happy Customers", value: "10K+" },
  ],
}) => {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor }}>
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        <div
          className={`grid lg:grid-cols-2 gap-0 min-h-[500px] lg:min-h-[600px] ${
            imagePosition === "left" ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Content Side */}
          <div
            className={`flex items-center px-0 sm:px-10 lg:px-16 py-16 lg:py-20 ${
              imagePosition === "left" ? "lg:order-2" : ""
            }`}
          >
            <div className="max-w-xl">
              {/* Badge */}
              {badge && (
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                  style={{
                    backgroundColor: badgeColor,
                    color: buttonTextColor,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: buttonTextColor }}
                  ></span>
                  <span
                    className="text-sm font-semibold uppercase tracking-wider"
                    style={{ color: buttonTextColor }}
                  >
                    {badge}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                style={{ color: textColor }}
              >
                {title}
              </h1>

              {/* subtitle */}
              {subtitle && (
                <p
                  className="text-lg sm:text-xl mb-8 leading-relaxed opacity-80"
                  style={{ color: textColor }}
                >
                  {subtitle}
                </p>
              )}

              {/* CTA Button */}
              {buttonText && (
                <a
                  href={buttonLink}
                  className="inline-flex items-center gap-3 px-8 py-4 font-semibold rounded-full hover:opacity-90 transition-all duration-300 group"
                  style={{
                    backgroundColor: buttonBackgroundColor,
                    color: buttonTextColor,
                  }}
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
              {showStats && stats && stats.length > 0 && (
                <div className="mt-12 grid grid-cols-3 gap-2 sm:gap-6">
                  {stats.map((stat, index) => (
                    <div key={index}>
                      <div
                        className="text-3xl font-bold mb-1"
                        style={{ color: textColor }}
                      >
                        {stat.value}
                      </div>
                      <div
                        className="text-sm opacity-70"
                        style={{ color: textColor }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

            {/* linear Overlay */}
            <div className="absolute inset-0 bg-linear-to-t lg:bg-linear-to-r from-black/20 to-transparent"></div>

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
