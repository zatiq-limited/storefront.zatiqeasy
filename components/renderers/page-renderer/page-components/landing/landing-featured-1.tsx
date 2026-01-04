/**
 * Landing Featured 1
 * Grid layout for featured images/benefits
 */

"use client";

import React from "react";
import Image from "next/image";

interface FeaturedItem {
  title?: string;
  description?: string;
  image?: string;
  icon?: string;
}

interface LandingFeatured1Settings {
  title?: string;
  subtitle?: string;
  items?: FeaturedItem[];
  columns?: number;
  showIcons?: boolean;
  titleColor?: string;
  subtitleColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  viewMode?: "desktop" | "tablet" | "mobile" | null;
}

interface LandingFeatured1Props {
  settings: LandingFeatured1Settings;
}

const defaultItems: FeaturedItem[] = [
  {
    title: "Premium Quality",
    description: "Made with the finest materials",
    image:
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=300&fit=crop",
    icon: "✨",
  },
  {
    title: "Fast Delivery",
    description: "Get your order within 3-5 days",
    image:
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop",
    icon: "🚀",
  },
  {
    title: "Money Back",
    description: "30-day money back guarantee",
    image:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop",
    icon: "💰",
  },
];

export default function LandingFeatured1({ settings }: LandingFeatured1Props) {
  const {
    title = "Why Choose Us",
    subtitle = "Discover the benefits",
    items = defaultItems,
    columns = 3,
    showIcons = true,
    titleColor = "#111827",
    subtitleColor = "#6B7280",
    backgroundColor = "#FFFFFF",
    fontFamily = "inherit",
  } = settings;

  const gridColsClass =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
      ? "md:grid-cols-4"
      : "md:grid-cols-3";

  return (
    <section
      className="py-16 px-4"
      style={{ backgroundColor, fontFamily }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {subtitle && (
            <p
              className="text-sm uppercase tracking-wider mb-2"
              style={{ color: subtitleColor }}
            >
              {subtitle}
            </p>
          )}
          {title && (
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: titleColor }}
            >
              {title}
            </h2>
          )}
        </div>

        {/* Grid */}
        <div className={`grid grid-cols-1 ${gridColsClass} gap-8`}>
          {items.map((item, index) => (
            <div
              key={index}
              className="group text-center"
            >
              {/* Image */}
              {item.image && (
                <div className="relative aspect-[4/3] mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title || `Feature ${index + 1}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}

              {/* Icon */}
              {showIcons && item.icon && (
                <div className="text-4xl mb-3">{item.icon}</div>
              )}

              {/* Title */}
              {item.title && (
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: titleColor }}
                >
                  {item.title}
                </h3>
              )}

              {/* Description */}
              {item.description && (
                <p style={{ color: subtitleColor }}>{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
