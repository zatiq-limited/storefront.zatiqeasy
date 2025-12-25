"use client";

import React from "react";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { ContentInterface } from "@/types/landing-page.types";

interface GripFeaturedProps {
  content: ContentInterface[] | null | undefined;
  onBuyNow?: (link: string | null) => void;
}

export function GripFeatured({ content, onBuyNow }: GripFeaturedProps) {
  if (!content?.length) {
    return null;
  }

  return (
    <div className="py-10 md:py-16 lg:py-24">
      <div className="space-y-12 md:space-y-16 lg:space-y-24">
        {content.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            } items-center gap-8 lg:gap-12`}
          >
            {/* Image */}
            <div className="w-full lg:w-1/2">
              {item.image_url && (
                <div className="relative overflow-hidden rounded-lg group">
                  <FallbackImage
                    src={item.image_url}
                    alt={item.title || `Featured ${index + 1}`}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="w-full lg:w-1/2 space-y-4 md:space-y-6">
              {/* Tag */}
              {item.tag && (
                <span className="inline-block text-sm font-semibold text-landing-primary uppercase tracking-wider">
                  {item.tag}
                </span>
              )}

              {/* Title */}
              {item.title && (
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  {item.title}
                </h2>
              )}

              {/* Subtitle */}
              {item.subtitle && (
                <h3 className="text-lg md:text-xl font-semibold text-foreground/80">
                  {item.subtitle}
                </h3>
              )}

              {/* Description */}
              {item.description && (
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* CTA Button */}
              {item.button_text && item.link && (
                <button
                  onClick={() => onBuyNow?.(item.link)}
                  className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-landing-primary hover:bg-landing-primary/90 text-white font-medium rounded-full transition-all duration-300 hover:shadow-xl cursor-pointer mt-4"
                >
                  {item.button_text}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GripFeatured;
