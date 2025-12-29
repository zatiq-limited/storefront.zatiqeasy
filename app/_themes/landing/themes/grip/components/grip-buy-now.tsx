"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { ContentInterface } from "@/types/landing-page.types";

import "swiper/css";

interface GripBuyNowProps {
  content: ContentInterface[] | null | undefined;
  onBuyNow?: (link: string | null) => void;
}

export function GripBuyNow({ content, onBuyNow }: GripBuyNowProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!content?.length || !mounted) {
    return null;
  }

  return (
    <div className="py-10 md:py-16 lg:py-24">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        loop={content.length > 1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="w-full"
      >
        {content.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Content */}
              <div className="w-full lg:w-1/2 space-y-4 md:space-y-6 order-2 lg:order-1">
                {/* Tag */}
                {item.tag && (
                  <span className="inline-block text-sm font-semibold text-landing-primary uppercase tracking-wider">
                    {item.tag}
                  </span>
                )}

                {/* Title */}
                {item.title && (
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-landing-primary leading-tight">
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
                    className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-linear-to-r from-landing-primary to-landing-primary text-white font-medium rounded-full transition-all duration-300 hover:shadow-xl cursor-pointer mt-4"
                  >
                    {item.button_text}
                  </button>
                )}
              </div>

              {/* Image */}
              <div className="w-full lg:w-1/2 order-1 lg:order-2">
                {item.image_url && (
                  <div className="relative overflow-hidden group flex justify-center">
                    <FallbackImage
                      src={item.image_url}
                      alt={item.title || `Showcase ${index + 1}`}
                      width={628}
                      height={628}
                      className="w-full max-w-lg h-auto object-cover aspect-square transition-all duration-500 group-hover:scale-105 group-hover:rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Carousel Indicators */}
      {content.length > 1 && (
        <div className="flex justify-center gap-2 mt-6 md:mt-8">
          {content.map((_, index) => (
            <button
              key={index}
              className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 transition-all duration-300"
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default GripBuyNow;
