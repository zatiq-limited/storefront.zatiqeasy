"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useShopStore } from "@/stores/shopStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { getSliderImage, isValidURL } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AuroraCarouselSliderProps {
  tag: "primary" | "secondary" | string;
  autoPlay?: boolean;
  interval?: number;
  showTitle?: boolean;
  className?: string;
}

interface CarouselItem {
  image_url?: string;
  title?: string;
  button_link?: string;
  tag?: string;
}

const AuroraCarouselSlider: React.FC<AuroraCarouselSliderProps> = ({
  tag,
  autoPlay = true,
  interval = 4000,
  showTitle = true,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { shopDetails } = useShopStore();

  // Filter carousels by tag
  const carousels: CarouselItem[] = (
    shopDetails?.shop_theme?.carousels || []
  ).filter((carousel: CarouselItem) => carousel?.tag === tag);
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
      setCurrentIndex(
        (prev) => (prev - 1 + totalCarouselImages) % totalCarouselImages
      );
      setIsLoading(true);
    }
  }, [totalCarouselImages]);

  // Go to specific slide
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsLoading(true);
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (!autoPlay || totalCarouselImages <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, handleNext, totalCarouselImages]);

  // Handle click on carousel (navigate to button link)
  const handleCarouselClick = useCallback(() => {
    const currentCarousel = carousels[currentIndex];
    const url = currentCarousel?.button_link ?? "";
    if (isValidURL(url)) {
      window.open(url, "_blank");
    }
  }, [carousels, currentIndex]);

  // Return null if no carousels
  if (totalCarouselImages === 0) {
    return null;
  }

  const currentCarousel = carousels[currentIndex];
  const hasValidLink = isValidURL(currentCarousel?.button_link ?? "");
  const isPrimary = tag === "primary";

  return (
    <div className={cn("aurora-carousel", className)}>
      {/* Carousel Container */}
      <div
        className={cn(
          "relative aspect-335/151 md:aspect-1920/720 w-full rounded-lg md:rounded-none shadow-sm select-none",
          hasValidLink && "cursor-pointer"
        )}
        id="home"
        onClick={handleCarouselClick}
      >
        {/* Image Container */}
        <div className="w-full h-full relative overflow-hidden">
          <FallbackImage
            src={getSliderImage(currentCarousel?.image_url || "")}
            alt={`Slide ${currentIndex + 1}`}
            fill
            className="aspect-335/151 md:aspect-1920/720 object-cover"
            priority={currentIndex === 0}
            onLoad={() => setIsLoading(false)}
          />

          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
        </div>

        {/* Title Overlay (Primary carousel only) */}
        {isPrimary && showTitle && currentCarousel?.title && (
          <>
            {/* Gradient Overlay */}
            <div className="bg-linear-to-r from-black/60 to-transparent w-1/2 h-full absolute top-0 rounded-lg md:rounded-none" />

            {/* Title */}
            <div className="flex flex-col items-start gap-5 md:gap-8 absolute bottom-[40.5%] left-[8%]">
              <h1 className="text-xl md:text-6xl font-normal text-white leading-[125%] w-64 md:w-121 line-clamp-3">
                {currentCarousel.title}
              </h1>
            </div>
          </>
        )}

        {/* Navigation Dots (if more than 1 slide) */}
        {totalCarouselImages > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {carousels.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(index);
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300 slide-indicator",
                  currentIndex === index
                    ? "bg-blue-zatiq w-6 active"
                    : "bg-white/50 hover:bg-white/70"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuroraCarouselSlider;
