"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { ContentInterface } from "@/types/landing-page.types";

import "swiper/css";

interface ArcadiaBuyNowProps {
  content: ContentInterface[] | null | undefined;
  onBuyNow?: (link: string | null) => void;
}

export function ArcadiaBuyNow({ content, onBuyNow }: ArcadiaBuyNowProps) {
  if (!content?.length) {
    return null;
  }

  return (
    <div className="w-full py-10 md:py-16">
      <Swiper
        className="w-full h-full relative"
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation={false}
        autoplay={{ delay: 3000 }}
        modules={[Autoplay]}
        autoHeight
        loop={content.length > 1}
      >
        {content.map((item, index) => (
          <SwiperSlide key={index} className="w-full h-full">
            {/* Product Showcase */}
            <section
              id="products"
              className="py-10 md:py-20 bg-linear-to-b from-white to-violet-50 min-h-[700px] sm:min-h-[920px] md:min-h-[650px] lg:min-h-[600px]"
            >
              <div className="container mx-auto px-4">
                <div className="lg:flex flex-col lg:flex-row gap-12 items-center">
                  {/* Image */}
                  <div className="flex-1">
                    <div className="group relative overflow-hidden rounded-2xl">
                      {item.image_url && (
                        <FallbackImage
                          src={item.image_url}
                          alt={item.title || "Product"}
                          width={628}
                          height={628}
                          className="w-full h-full rounded-2xl shadow-xl transition-all duration-500 group-hover:scale-110 cursor-pointer object-cover aspect-square"
                        />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-5 md:space-y-8 pt-10 lg:pt-0">
                    {/* Badge */}
                    <span className="inline-block bg-blue-100 text-landing-primary px-4 py-2 rounded-full text-sm font-medium">
                      New Release
                    </span>

                    {/* Tag */}
                    {item.tag && (
                      <h3 className="font-semibold text-gray-700">
                        {item.tag}
                      </h3>
                    )}

                    {/* Title */}
                    {item.title && (
                      <h2 className="text-landing-primary text-3xl md:text-4xl font-bold">
                        {item.title}
                      </h2>
                    )}

                    {/* Subtitle */}
                    {item.subtitle && (
                      <h4 className="text-[22px] text-gray-700 font-semibold mt-3">
                        {item.subtitle}
                      </h4>
                    )}

                    {/* Divider */}
                    <hr className="my-12 h-px border-0 bg-linear-to-r from-transparent via-landing-primary to-transparent opacity-50" />

                    {/* Description */}
                    {item.description && (
                      <p className="max-w-2xl text-gray-800 tracking-wider">
                        {item.description}
                      </p>
                    )}

                    {/* CTA Button */}
                    {item.link && (
                      <div className="flex items-center justify-center md:justify-start gap-6 pt-5 md:pt-12 lg:pt-16 xl:pt-20">
                        <button
                          onClick={() => onBuyNow?.(item.link)}
                          className="bg-linear-to-r from-landing-primary to-landing-primary text-white px-8 py-4 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                        >
                          {item.button_text || "Buy Now"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ArcadiaBuyNow;
