"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { ContentInterface } from "@/types/landing-page.types";

import "swiper/css";
import "swiper/css/pagination";

interface GripTopCarouselProps {
  content: ContentInterface[] | null | undefined;
  onBuyNow?: (link: string | null) => void;
}

export function GripTopCarousel({ content, onBuyNow }: GripTopCarouselProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!content?.length || !mounted) {
    return null;
  }

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={content.length > 1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-white/50 !w-2 !h-2",
          bulletActiveClass: "!bg-white !w-8",
        }}
        className="w-full"
      >
        {content.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
              {/* Background Image */}
              {banner.image_url && (
                <FallbackImage
                  src={banner.image_url}
                  alt={banner.title || `Banner ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-2xl">
                    {/* Tag */}
                    {banner.tag && (
                      <span className="inline-block text-sm md:text-base font-medium text-landing-primary mb-3 md:mb-4">
                        {banner.tag}
                      </span>
                    )}

                    {/* Title */}
                    {banner.title && (
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
                        {banner.title}
                      </h1>
                    )}

                    {/* Subtitle */}
                    {banner.subtitle && (
                      <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8">
                        {banner.subtitle}
                      </p>
                    )}

                    {/* Description */}
                    {banner.description && (
                      <p className="text-base md:text-lg text-white/80 mb-6 md:mb-8 max-w-xl">
                        {banner.description}
                      </p>
                    )}

                    {/* CTA Button */}
                    {banner.button_text && banner.link && (
                      <button
                        onClick={() => onBuyNow?.(banner.link)}
                        className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-landing-primary hover:bg-landing-primary/90 text-white font-medium rounded-full transition-all duration-300 hover:shadow-xl cursor-pointer"
                      >
                        {banner.button_text}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default GripTopCarousel;
