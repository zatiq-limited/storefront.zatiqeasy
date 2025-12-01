/**
 * Collections Hero Component 1
 * Dynamic hero section for collections page - Shopify inspired
 */

import React from "react";
import { ArrowRight } from "lucide-react";

interface CollectionsHero1Props {
  title?: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  backgroundColor?: string;
  textColor?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
  buttonText?: string;
  buttonLink?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  showStats?: boolean;
  stats?: {
    label: string;
    value: string;
  }[];
}

const CollectionsHero1: React.FC<CollectionsHero1Props> = ({
  title = "Discover Your Style",
  subtitle = "Explore our handpicked collections crafted for every occasion and trend",
  badge = "Curated Collections",
  badgeColor = "#ff6f61",
  backgroundColor = "#0f0f0f",
  textColor = "#ffffff",
  backgroundImage,
  overlayOpacity = 60,
  buttonText = "Shop Now",
  buttonLink = "/products",
  buttonBackgroundColor = "#ffffff",
  buttonTextColor = "#000000",
  showStats = true,
  stats = [
    { label: "Collections", value: "50+" },
    { label: "Products", value: "1000+" },
    { label: "Happy Customers", value: "10K+" },
  ],
}) => {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity / 100 }}
          />
        </div>
      )}

      {/* Gradient Mesh Background (when no image) */}
      {!backgroundImage && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated gradient orbs */}
          <div
            className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: badgeColor }}
          />
          <div
            className="absolute -bottom-1/2 -right-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-15"
            style={{ backgroundColor: buttonBackgroundColor }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl opacity-10"
            style={{ backgroundColor: badgeColor }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center gap-2 mb-6 sm:mb-8">
              <span
                className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider"
                style={{ backgroundColor: badgeColor, color: "#ffffff" }}
              >
                {badge}
              </span>
            </div>
          )}

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 tracking-tight leading-[1.1]"
            style={{ color: textColor }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed opacity-80 mb-8 sm:mb-10"
              style={{ color: textColor }}
            >
              {subtitle}
            </p>
          )}

          {/* CTA Button */}
          {buttonText && (
            <a
              href={buttonLink}
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-full transition-all duration-300 hover:opacity-90 hover:gap-4 group text-sm sm:text-base"
              style={{ backgroundColor: buttonBackgroundColor, color: buttonTextColor }}
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
            </a>
          )}

          {/* Stats */}
          {showStats && stats && stats.length > 0 && (
            <div className="pt-8 sm:pt-10 border-t border-white/10">
              <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div
                      className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1"
                      style={{ color: textColor }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-xs sm:text-sm opacity-60"
                      style={{ color: textColor }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom decorative line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, transparent, ${badgeColor}, transparent)` }}
      />
    </section>
  );
};

export default CollectionsHero1;
