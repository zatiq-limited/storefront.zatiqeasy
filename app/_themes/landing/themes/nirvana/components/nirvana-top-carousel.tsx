"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { ContentInterface } from "@/types/landing-page.types";

interface NirvanaTopCarouselProps {
  content: ContentInterface[] | null | undefined;
  onBuyNow?: (link: string | null) => void;
}

export function NirvanaTopCarousel({ content, onBuyNow }: NirvanaTopCarouselProps) {
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
    const timer = setInterval(handleNext, 4000);
    return () => clearInterval(timer);
  }, [handleNext, totalImages]);

  if (!content?.length) {
    return null;
  }

  const currentBanner = content[currentIndex];

  return (
    <div className="relative overflow-hidden">
      <div
        className="md:rounded-md relative shadow-sm select-none md:mt-1 cursor-pointer"
        onClick={() => {
          if (currentBanner?.link && currentBanner.link !== "buy-now") {
            window.open(currentBanner.link, "_blank");
          }
        }}
      >
        {/* Image */}
        <div className="w-full bg-transparent md:rounded-md overflow-hidden">
          {currentBanner?.image_url && (
            <FallbackImage
              src={currentBanner.image_url}
              alt={`Slide ${currentIndex + 1}`}
              width={1920}
              height={960}
              className="opacity-90 bg-black object-cover md:rounded-md aspect-[1920/960]"
              priority={currentIndex === 0}
            />
          )}
        </div>

        {/* Title Overlay */}
        {currentBanner?.title && (
          <div className="flex absolute inset-0 w-full mx-auto flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8">
            <h1 className="mx-4 leading-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white md:max-w-7xl px-2 md:px-0 transform duration-500 hover:scale-105 hover:text-white/90 cursor-pointer drop-shadow-lg">
              {currentBanner.title}
            </h1>
          </div>
        )}
      </div>

      {/* Indicators */}
      {totalImages > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {content.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default NirvanaTopCarousel;
