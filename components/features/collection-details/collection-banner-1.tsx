/**
 * Collection Banner 1
 * Immersive full-screen hero with parallax effect
 */

"use client";

import { convertSettingsKeys } from "@/lib/settings-utils";
import type { Collection } from "@/hooks/useCollectionDetails";
import Image from "next/image";

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

  const heightClasses = {
    small: "h-64 md:h-80",
    medium: "h-80 md:h-96",
    large: "h-96 md:min-h-[500px]",
  };

  const textPositionClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      {s.showBanner && collection.image_url && (
        <div className="absolute inset-0">
          <Image
            src={collection.image_url}
            alt={collection.name}
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: parseFloat(s.overlayOpacity || "0.5") }}
          />
        </div>
      )}

      {/* Content */}
      <div
        className={`relative flex ${heightClasses[s.height || "medium"]} ${textPositionClasses[s.textPosition || "center"]}`}
      >
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-4xl">
            {/* Badge */}
            {s.showProductCount && (
              <div
                className="inline-flex items-center px-4 py-2 rounded-full font-semibold mb-6"
                style={{
                  backgroundColor: s.badgeBackgroundColor || "#ffffff",
                  color: s.badgeTextColor || "#111827",
                }}
              >
                {collection.product_count} Products
              </div>
            )}

            {/* Title */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{ color: s.textColor || "#ffffff" }}
            >
              {collection.name}
            </h1>

            {/* Description */}
            {s.showDescription && collection.description && (
              <p
                className="text-lg md:text-xl mb-8 max-w-2xl leading-relaxed"
                style={{
                  color: s.textColor || "#ffffff",
                  opacity: 0.9,
                }}
              >
                {collection.description}
              </p>
            )}

            {/* CTA Button */}
            {s.bannerButtonText && (
              <a
                href={s.bannerButtonLink || "#products"}
                className="inline-flex items-center px-8 py-4 rounded-full font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: s.badgeBackgroundColor || "#ffffff",
                  color: s.badgeTextColor || "#111827",
                }}
              >
                {s.bannerButtonText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}