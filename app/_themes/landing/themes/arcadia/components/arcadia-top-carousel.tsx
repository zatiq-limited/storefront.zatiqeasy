"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { ContentInterface } from "@/types/landing-page.types";

interface ArcadiaTopCarouselProps {
  content: ContentInterface[] | null | undefined;
  onBuyNow?: (link: string | null) => void;
}

export function ArcadiaTopCarousel({ content, onBuyNow }: ArcadiaTopCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = content?.length ?? 0;

  const handleNext = useCallback(() => {
    if (totalImages > 0) {
      setCurrentIndex((prev) => (prev + 1) % totalImages);
    }
  }, [totalImages]);

  // Auto-advance carousel
  useEffect(() => {
    if (totalImages <= 1) return;
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, [handleNext, totalImages]);

  if (!content?.length) {
    return null;
  }

  const currentBanner = content[currentIndex];

  return (
    <div className="relative overflow-hidden">
      <div className="relative h-[160px] sm:h-[240px] md:h-[287px] lg:h-[385px] xl:h-[500px] 2xl:h-[580px]">
        {/* Current Image */}
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          key={currentIndex}
        >
          {currentBanner?.image_url && (
            <FallbackImage
              src={currentBanner.image_url}
              alt={currentBanner.title || "Carousel Image"}
              fill
              className="object-contain"
              priority={currentIndex === 0}
            />
          )}
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="container mx-auto px-4 text-center text-white">
            {currentBanner?.title && (
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl px-4 font-bold mb-6 md:mb-14 animate-fade-in drop-shadow-lg">
                {currentBanner.title}
              </h1>
            )}

            {currentBanner?.button_text && currentBanner.title && (
              <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
                <button
                  onClick={() => onBuyNow?.(currentBanner.link)}
                  className="bg-landing-primary text-white px-3 py-1.5 md:px-8 md:py-4 rounded-full font-semibold md:font-bold md:text-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer"
                >
                  {currentBanner.button_text}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Button without title */}
        {currentBanner?.button_text && !currentBanner.title && (
          <div className="absolute bottom-4 md:bottom-10 left-1/2 transform -translate-x-1/2 z-20">
            <button
              onClick={() => onBuyNow?.(currentBanner.link)}
              className="bg-landing-primary text-white px-3 py-1.5 md:px-8 md:py-4 rounded-full font-semibold md:font-bold md:text-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer"
            >
              {currentBanner.button_text}
            </button>
          </div>
        )}

        {/* Indicators */}
        {totalImages > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {content.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-landing-primary w-8"
                    : "bg-gray-400/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ArcadiaTopCarousel;
