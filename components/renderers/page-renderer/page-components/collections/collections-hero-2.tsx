/**
 * Collections Hero Component 2
 * Split-screen hero with image
 * Matches merchant panel component: CollectionsPage/CollectionsHero2.jsx
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { convertSettingsKeys } from "@/lib/settings-utils";

interface CollectionsHero2Settings {
  title?: string;
  subtitle?: string;
  badge?: string;
  showBreadcrumb?: boolean;
  showCollectionCount?: boolean;
  showStats?: boolean;
  image?: string;
  imagePosition?: "left" | "right";
  heroHeight?: string;
  backgroundColor?: string;
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
  // Legacy prop
  textColor?: string;
}

interface CollectionsHero2Props {
  settings?: Record<string, unknown>;
  collectionCount?: number;
}

export default function CollectionsHero2({
  settings = {},
  collectionCount = 0,
}: CollectionsHero2Props) {
  // Convert snake_case settings to camelCase
  const s = convertSettingsKeys<CollectionsHero2Settings>(settings);

  // Extract settings with defaults
  const title = s.title || "Discover Your Style";
  const subtitle =
    s.subtitle ||
    "Explore our handpicked collections crafted for every occasion and trend";
  const badge = s.badge || "New Season";
  const showBreadcrumb = s.showBreadcrumb !== false;
  const showCollectionCount = s.showCollectionCount !== false;
  const showStats = s.showStats !== false;

  // Image settings
  const image =
    s.image ||
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80";
  const imagePosition = s.imagePosition || "right";

  // Colors
  const backgroundColor = s.backgroundColor || "#f8f9fa";
  const badgeColor = s.badgeColor || "#ff6f61";
  const badgeBgColor = s.badgeBgColor || `${badgeColor}20`;
  const titleColor = s.titleColor || s.textColor || "#1a1a1a";
  const subtitleColor = s.subtitleColor || s.textColor || "#4B5563";
  const breadcrumbColor = s.breadcrumbColor || "#6B7280";
  const collectionCountColor = s.collectionCountColor || "#6B7280";
  const buttonBgColor = s.buttonBackgroundColor || "#ff6f61";
  const buttonTextColor = s.buttonTextColor || "#ffffff";
  const statValueColor = s.statValueColor || titleColor;
  const statLabelColor = s.statLabelColor || "#6B7280";

  // Button settings
  const buttonText = s.buttonText || "Explore Collections";
  const buttonLink = s.buttonLink || "/products";

  // Stats
  const stats = s.stats || [
    { label: "Collections", value: "50+" },
    { label: "Products", value: "1000+" },
    { label: "Happy Customers", value: "10K+" },
  ];

  const isImageLeft = imagePosition === "left";

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor }}>
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        <div
          className={`grid lg:grid-cols-2 gap-0 min-h-[500px] lg:min-h-[600px] ${
            isImageLeft ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Content Side */}
          <div
            className={`flex items-center px-0 sm:px-10 lg:px-16 py-16 lg:py-20 ${
              isImageLeft ? "lg:order-2" : ""
            }`}
          >
            <div className="max-w-xl">
              {/* Breadcrumb */}
              {showBreadcrumb && (
                <nav
                  className="flex items-center gap-2 text-sm mb-6"
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
                  />
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
                style={{ color: titleColor }}
              >
                {title}
              </h1>

              {/* Subtitle */}
              {subtitle && (
                <p
                  className="text-lg sm:text-xl mb-6 leading-relaxed opacity-80"
                  style={{ color: subtitleColor }}
                >
                  {subtitle}
                </p>
              )}

              {/* Collection Count */}
              {showCollectionCount && collectionCount > 0 && (
                <p
                  className="text-sm mb-8"
                  style={{ color: collectionCountColor }}
                >
                  {collectionCount} collections available
                </p>
              )}

              {/* CTA Button */}
              {buttonText && (
                <Link
                  href={buttonLink}
                  className="inline-flex items-center gap-3 px-8 py-4 font-semibold rounded-full hover:opacity-90 transition-all duration-300 group"
                  style={{
                    backgroundColor: buttonBgColor,
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
                </Link>
              )}

              {/* Stats */}
              {showStats && stats && stats.length > 0 && (
                <div className="mt-12 grid grid-cols-3 gap-2 sm:gap-6">
                  {stats.map((stat, index) => (
                    <div key={index}>
                      <div
                        className="text-3xl font-bold mb-1"
                        style={{ color: statValueColor }}
                      >
                        {stat.value}
                      </div>
                      <div
                        className="text-sm opacity-70"
                        style={{ color: statLabelColor }}
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
            className={`relative overflow-hidden min-h-[300px] lg:min-h-full ${
              isImageLeft ? "lg:order-1" : ""
            }`}
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              priority
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/20 to-transparent" />

            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full" />
            <div className="absolute bottom-20 left-10 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
