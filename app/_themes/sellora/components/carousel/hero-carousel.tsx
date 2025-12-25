"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useShopStore } from "@/stores/shopStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { cn } from "@/lib/utils";

interface Carousel {
  tag?: string;
  image_url: string;
  title?: string;
  sub_title?: string;
  button_text?: string;
  button_link?: string;
}

interface HeroCarouselProps {
  tag?: string;
}

export function HeroCarousel({ tag = "primary" }: HeroCarouselProps) {
  const { shopDetails } = useShopStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get carousels from shop theme
  const allCarousels = (shopDetails?.shop_theme as unknown as { carousels?: Carousel[] })?.carousels || [];
  const carousels = tag ? allCarousels.filter((c) => c.tag === tag) : allCarousels;
  const totalCarousels = carousels.length;

  // Auto-rotate carousel
  const handleNext = useCallback(() => {
    if (totalCarousels > 0) {
      setCurrentIndex((prev) => (prev + 1) % totalCarousels);
    }
  }, [totalCarousels]);

  useEffect(() => {
    if (totalCarousels <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(timer);
  }, [handleNext, totalCarousels]);

  if (totalCarousels === 0) return null;

  const currentCarousel = carousels[currentIndex];
  const isValidLink = currentCarousel?.button_link &&
    (currentCarousel.button_link.startsWith("http") || currentCarousel.button_link.startsWith("/"));

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
      <div
        className={cn(
          "relative w-full select-none",
          tag === "secondary"
            ? "h-[210px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[580px]"
            : "h-[210px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px]",
          isValidLink && "cursor-pointer"
        )}
        onClick={() => {
          if (isValidLink) {
            window.open(currentCarousel.button_link, "_blank");
          }
        }}
      >
        {/* Image */}
        <FallbackImage
          src={currentCarousel?.image_url || ""}
          alt={`Slide ${currentIndex + 1}`}
          width={1400}
          height={800}
          className="w-full h-full object-cover object-center"
          priority
        />

        {/* Title Overlay - Only for primary tag */}
        {tag === "primary" && currentCarousel?.title && (
          <>
            {/* Dark overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/40" />

            <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-8 absolute top-32 sm:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
              <h1 className="text-xl md:text-6xl font-semibold text-white max-w-64 md:max-w-5xl line-clamp-2 drop-shadow-2xl">
                {currentCarousel.title}
              </h1>
              {currentCarousel.sub_title && (
                <p className="text-sm md:text-xl lg:text-[22px] font-normal text-white/80 max-w-6xl line-clamp-2 drop-shadow-md">
                  {currentCarousel.sub_title}
                </p>
              )}
              {currentCarousel.button_link && currentCarousel.button_text && (
                <Link
                  href={currentCarousel.button_link}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="sm:h-14 sm:px-8 sm:py-5 px-4 py-2 bg-white text-[#212121] text-base font-semibold rounded-sm hover:bg-white/90 drop-shadow-lg cursor-pointer"
                >
                  {currentCarousel.button_text}
                </Link>
              )}
            </div>
          </>
        )}

        {/* Pagination Indicators */}
        {totalCarousels > 1 && (
          <div className="absolute bottom-1.5 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {Array.from({ length: totalCarousels }).map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={cn(
                  "transition-all duration-300 rounded-full",
                  index === currentIndex
                    ? "w-2 md:w-2.5 h-2 md:h-2.5 bg-white"
                    : "w-2 md:w-2.5 h-2 md:h-2.5 bg-white/50 hover:bg-white/75"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroCarousel;
