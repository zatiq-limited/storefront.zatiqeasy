"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FallbackImage } from "@/components/ui/fallback-image";
import { useShopStore } from "@/stores/shopStore";
import type { Carousel } from "@/types/shop.types";
import { cn } from "@/lib/utils";

interface PremiumCarouselSliderProps {
  className?: string;
  autoPlayInterval?: number;
}

export function PremiumCarouselSlider({
  className,
  autoPlayInterval = 4000,
}: PremiumCarouselSliderProps) {
  const { shopDetails } = useShopStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Get carousels from shop theme
  const carousels: Carousel[] =
    (shopDetails?.shop_theme as unknown as { carousels?: Carousel[] })?.carousels || [];

  const totalCarouselImages = carousels.length;

  // Handle next slide
  const handleNext = useCallback(() => {
    if (totalCarouselImages > 0) {
      setCurrentIndex((prev) => (prev + 1) % totalCarouselImages);
      setIsLoading(true);
    }
  }, [totalCarouselImages]);

  // Handle previous slide
  const handlePrev = useCallback(() => {
    if (totalCarouselImages > 0) {
      setCurrentIndex((prev) => (prev - 1 + totalCarouselImages) % totalCarouselImages);
      setIsLoading(true);
    }
  }, [totalCarouselImages]);

  // Auto-play carousel
  useEffect(() => {
    if (totalCarouselImages <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [handleNext, autoPlayInterval, totalCarouselImages]);

  // Don't render if no carousels
  if (totalCarouselImages === 0) {
    return null;
  }

  const currentCarousel = carousels[currentIndex];
  const buttonLink = currentCarousel?.button_link || currentCarousel?.link || "";

  // Check if link is valid
  const isValidUrl = (url: string) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return url.startsWith("/") || url.startsWith("#");
    }
  };

  const handleClick = () => {
    if (buttonLink && isValidUrl(buttonLink)) {
      if (buttonLink.startsWith("http")) {
        window.open(buttonLink, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = buttonLink;
      }
    }
  };

  return (
    <div
      className={cn(
        "relative select-none mt-8 md:mt-0 w-full",
        buttonLink && isValidUrl(buttonLink) && "cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      {/* Main Image */}
      <div className="w-full relative overflow-hidden">
        <FallbackImage
          src={currentCarousel?.image_url || ""}
          alt={currentCarousel?.title || `Slide ${currentIndex + 1}`}
          width={1920}
          height={526}
          className="w-full aspect-[335/150] md:aspect-[1920/526] object-cover rounded-lg md:rounded-none transition-opacity duration-300"
          priority={currentIndex === 0}
          onLoad={() => setIsLoading(false)}
        />

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}
      </div>

      {/* Button Text Overlay */}
      {currentCarousel?.button_text && (
        <div className="flex absolute bottom-[12%] md:bottom-[15.5%] w-full mx-auto justify-center">
          <div className="bg-gray-500/50 px-3 md:px-6 py-2 md:py-4 text-white border border-white text-[18px] md:text-[22px] leading-[18px] font-medium capitalize hover:bg-gray-600/60 transition-colors">
            {currentCarousel.button_text}
          </div>
        </div>
      )}

      {/* Navigation Arrows - Only show if more than 1 image */}
      {totalCarouselImages > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 rounded-full p-1 md:p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800 dark:text-white" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 rounded-full p-1 md:p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-800 dark:text-white" />
          </button>
        </>
      )}

      {/* Dots Indicator - Only show if more than 1 image */}
      {totalCarouselImages > 1 && (
        <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {carousels.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
                setIsLoading(true);
              }}
              className={cn(
                "w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all",
                index === currentIndex
                  ? "bg-white w-4 md:w-6"
                  : "bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PremiumCarouselSlider;
