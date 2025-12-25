"use client";

import React, { useMemo } from "react";
import type { ProductVideoInterface } from "@/types/landing-page.types";

interface GripProductVideoProps {
  content: ProductVideoInterface | ProductVideoInterface[] | null | undefined;
  onBuyNow?: (link: string | null) => void;
}

// Extract YouTube video ID from URL
function extractVideoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match ? match[1] : null;
}

export function GripProductVideo({ content, onBuyNow }: GripProductVideoProps) {
  // Support both single video and array of videos
  const featuredVideo = Array.isArray(content)
    ? content.find((v) => v.type === "FEATURED") || content[0]
    : content;

  const videoId = useMemo(
    () => (featuredVideo?.video_url ? extractVideoId(featuredVideo.video_url) : null),
    [featuredVideo?.video_url]
  );

  if (!featuredVideo || !videoId) {
    return null;
  }

  return (
    <div className="py-10 md:py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        {featuredVideo.title && (
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-foreground text-center font-bold leading-snug mb-4 md:mb-6">
            {featuredVideo.title}
          </h2>
        )}

        {/* Description */}
        {featuredVideo.description && (
          <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-8 md:mb-12">
            {featuredVideo.description}
          </p>
        )}

        {/* Video Player */}
        <div className="relative w-full max-w-4xl mx-auto aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
            title={featuredVideo.title || "Product video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0"
          />
        </div>

        {/* CTA Button */}
        {featuredVideo.button_text && featuredVideo.link && (
          <div className="flex justify-center mt-8 md:mt-12">
            <button
              onClick={() => onBuyNow?.(featuredVideo.link)}
              className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-landing-primary hover:bg-landing-primary/90 text-white font-medium rounded-full transition-all duration-300 hover:shadow-xl cursor-pointer"
            >
              {featuredVideo.button_text}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GripProductVideo;
