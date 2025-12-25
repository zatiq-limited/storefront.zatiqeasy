"use client";

import React from "react";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { ContentInterface } from "@/types/landing-page.types";

interface GripStandaloneProps {
  content: ContentInterface | null | undefined;
  onBuyNow?: (link: string | null) => void;
}

export function GripStandalone({ content, onBuyNow }: GripStandaloneProps) {
  if (!content) {
    return null;
  }

  const hasBackgroundImage = !!content.image_url;

  return (
    <div
      className={`relative py-16 md:py-24 lg:py-32 ${
        hasBackgroundImage ? "" : "bg-gray-100 dark:bg-gray-900"
      }`}
    >
      {/* Background Image */}
      {hasBackgroundImage && (
        <>
          <div className="absolute inset-0">
            <FallbackImage
              src={content.image_url!}
              alt={content.title || "Background"}
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/60" />
        </>
      )}

      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Tag */}
          {content.tag && (
            <span
              className={`inline-block text-sm font-semibold uppercase tracking-wider mb-4 ${
                hasBackgroundImage ? "text-landing-primary" : "text-landing-primary"
              }`}
            >
              {content.tag}
            </span>
          )}

          {/* Title */}
          {content.title && (
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 ${
                hasBackgroundImage ? "text-white" : "text-foreground"
              }`}
            >
              {content.title}
            </h2>
          )}

          {/* Subtitle */}
          {content.subtitle && (
            <h3
              className={`text-lg md:text-xl font-medium mb-4 ${
                hasBackgroundImage ? "text-white/90" : "text-foreground/80"
              }`}
            >
              {content.subtitle}
            </h3>
          )}

          {/* Description */}
          {content.description && (
            <p
              className={`text-base md:text-lg leading-relaxed mb-8 ${
                hasBackgroundImage ? "text-white/80" : "text-muted-foreground"
              }`}
            >
              {content.description}
            </p>
          )}

          {/* CTA Button */}
          {content.button_text && content.link && (
            <button
              onClick={() => onBuyNow?.(content.link)}
              className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-landing-primary hover:bg-landing-primary/90 text-white font-medium rounded-full transition-all duration-300 hover:shadow-xl cursor-pointer"
            >
              {content.button_text}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default GripStandalone;
