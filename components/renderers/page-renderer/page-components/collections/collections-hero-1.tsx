/**
 * Collections Hero Component 1
 * Gradient background hero with stats
 * Matches merchant panel component: CollectionsPage/CollectionsHero1.jsx
 */

"use client";

import Link from "next/link";
import { convertSettingsKeys } from "@/lib/settings-utils";

interface CollectionsHero1Settings {
  title?: string;
  subtitle?: string;
  badge?: string;
  showBreadcrumb?: boolean;
  showCollectionCount?: boolean;
  showStats?: boolean;
  // Background settings
  backgroundType?: "color" | "gradient" | "image";
  backgroundColor?: string;
  gradientStart?: string;
  gradientEnd?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
  // Color settings
  badgeColor?: string;
  badgeBgColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  breadcrumbColor?: string;
  collectionCountColor?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  statValueColor?: string;
  statLabelColor?: string;
  buttonText?: string;
  buttonLink?: string;
  titleFontFamily?: string;
  titleFontSize?: string;
  titleFontWeight?: string;
  subtitleFontFamily?: string;
  subtitleFontSize?: string;
  badgeFontFamily?: string;
  badgeFontSize?: string;
  statValueFontSize?: string;
  statLabelFontSize?: string;
  stats?: Array<{ label: string; value: string }>;
  // Legacy props
  textColor?: string;
}

interface CollectionsHero1Props {
  settings?: Record<string, unknown>;
  collectionCount?: number;
}

export default function CollectionsHero1({
  settings = {},
  collectionCount = 0,
}: CollectionsHero1Props) {
  // Convert snake_case settings to camelCase
  const s = convertSettingsKeys<CollectionsHero1Settings>(settings);

  // Extract settings with defaults
  const title = s.title || "Discover Your Style";
  const subtitle =
    s.subtitle ||
    "Explore our handpicked collections crafted for every occasion and trend";
  const badge = s.badge || "Curated Collections";
  const showBreadcrumb = s.showBreadcrumb !== false;
  const showCollectionCount = s.showCollectionCount !== false;
  const showStats = s.showStats !== false;

  // Background settings
  const backgroundType = s.backgroundType || "gradient";
  const backgroundColor = s.backgroundColor || "#EBF4FF";
  const gradientStart = s.gradientStart || "#EBF4FF";
  const gradientEnd = s.gradientEnd || "#F3E8FF";
  const backgroundImage = s.backgroundImage || "";
  const overlayOpacity = s.overlayOpacity ?? 60;

  // Compute background style based on backgroundType
  const getBackgroundStyle = (): React.CSSProperties => {
    switch (backgroundType) {
      case "color":
        return { backgroundColor };
      case "image":
        // For image, we use a solid color as fallback, image is rendered separately
        return { backgroundColor: backgroundColor || "#1f2937" };
      case "gradient":
      default:
        return {
          background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
        };
    }
  };

  // Colors
  const badgeColor = s.badgeColor || "#e28279";
  const badgeBgColor = s.badgeBgColor || `${badgeColor}20`;
  const titleColor = s.titleColor || s.textColor || "#111827";
  const subtitleColor = s.subtitleColor || s.textColor || "#4B5563";
  const breadcrumbColor = s.breadcrumbColor || "#6B7280";
  const collectionCountColor = s.collectionCountColor || "#6B7280";
  const buttonBgColor = s.buttonBackgroundColor || "#111827";
  const buttonTextColor = s.buttonTextColor || "#FFFFFF";
  const statValueColor = s.statValueColor || titleColor;
  const statLabelColor = s.statLabelColor || "#6B7280";

  // Button settings
  const buttonText = s.buttonText || "Shop Now";
  const buttonLink = s.buttonLink || "/products";

  // Typography
  const titleFontSize = s.titleFontSize || "text-4xl md:text-5xl";
  const titleFontWeight = s.titleFontWeight || "font-bold";
  const subtitleFontSize = s.subtitleFontSize || "text-lg";
  const statValueFontSize = s.statValueFontSize || "text-3xl md:text-4xl";
  const statLabelFontSize = s.statLabelFontSize || "text-sm";

  // Stats
  const stats = s.stats || [
    { label: "Collections", value: "50+" },
    { label: "Products", value: "1000+" },
    { label: "Happy Customers", value: "10K+" },
  ];

  return (
    <section
      className="relative overflow-hidden"
      style={getBackgroundStyle()}
    >
      {/* Background Image (only when backgroundType is "image") */}
      {backgroundType === "image" && backgroundImage && (
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

      {/* Gradient Mesh Background (decorative blurs for gradient type) */}
      {backgroundType === "gradient" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: badgeColor }}
          />
          <div
            className="absolute -bottom-1/2 -right-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-15"
            style={{ backgroundColor: buttonBgColor }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl opacity-10"
            style={{ backgroundColor: badgeColor }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative container px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16">
        {/* Breadcrumb */}
        {showBreadcrumb && (
          <nav
            className="flex items-center justify-center gap-2 text-sm mb-6"
            style={{ color: breadcrumbColor }}
          >
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span>Collections</span>
          </nav>
        )}

        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 lg:mb-8">
              <span
                className="px-3 py-1.5 sm:px-3.5 sm:py-1.5 lg:px-4 lg:py-2 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider"
                style={{ backgroundColor: badgeBgColor, color: badgeColor }}
              >
                {badge}
              </span>
            </div>
          )}

          {/* Title */}
          <h1
            className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl ${titleFontWeight} mb-3 sm:mb-4 lg:mb-6 tracking-tight leading-[1.1]`}
            style={{ color: titleColor }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              className="text-sm sm:text-lg md:text-xl lg:text-2xl max-w-md sm:max-w-xl lg:max-w-2xl mx-auto leading-relaxed opacity-80 mb-6 sm:mb-8 lg:mb-10"
              style={{ color: subtitleColor }}
            >
              {subtitle}
            </p>
          )}

          {/* Collection Count */}
          {showCollectionCount && collectionCount > 0 && (
            <p className="text-sm mb-6" style={{ color: collectionCountColor }}>
              {collectionCount} collections available
            </p>
          )}

          {/* CTA Button */}
          {buttonText && (
            <Link
              href={buttonLink}
              className="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-base gap-2 sm:gap-2 lg:gap-3 font-semibold rounded-full transition-all duration-300 hover:opacity-90 hover:gap-4 group"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              <span>{buttonText}</span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1"
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
            </Link>
          )}

          {/* Stats */}
          {showStats && stats && stats.length > 0 && (
            <div className="pt-6 sm:pt-8 lg:pt-10 mt-6 sm:mt-8 border-t border-white/10">
              <div className="grid grid-cols-3 gap-3 sm:gap-6 lg:gap-8 max-w-md sm:max-w-lg lg:max-w-xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div
                      className="text-xl sm:text-3xl md:text-4xl font-bold mb-0.5 sm:mb-1"
                      style={{ color: statValueColor }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-xs sm:text-sm opacity-60"
                      style={{ color: statLabelColor }}
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
        style={{
          background: `linear-gradient(90deg, transparent, ${badgeColor}, transparent)`,
        }}
      />
    </section>
  );
}
