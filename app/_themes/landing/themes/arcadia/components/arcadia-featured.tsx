"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { ContentInterface } from "@/types/landing-page.types";

interface ArcadiaFeaturedProps {
  content: ContentInterface[] | null | undefined;
  onBuyNow?: (link: string | null) => void;
}

export function ArcadiaFeatured({ content, onBuyNow }: ArcadiaFeaturedProps) {
  if (!content?.length) {
    return null;
  }

  return (
    <div className="mx-auto w-full py-7 md:py-10 xl:py-12 2xl:py-14 px-0">
      {content.map((banner, index) => (
        <section
          key={index}
          className="pt-12 pb-10 md:pt-24 md:pb-20 bg-gradient-to-br from-violet-50 via-indigo-50 to-white"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row md:items-center gap-12">
              {/* Text Content */}
              <div
                className={`flex-1 space-y-5 md:space-y-8 ${
                  index % 2 === 0 ? "order-2 md:order-1" : "order-2"
                }`}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="animate-pulse w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-gray-600">
                    {banner.type || "FEATURED"}
                  </span>
                </div>

                {/* Title & Subtitle */}
                {banner.title && (
                  <h1 className="pt-2 text-3xl md:text-4xl font-bold bg-gradient-to-r from-landing-primary to-gray-700 bg-clip-text text-transparent">
                    {banner.title}
                    {banner.subtitle && (
                      <>
                        <br /><br />
                        <span className="pt-1 text-[22px] bg-gradient-to-r from-gray-700 to-gray-700 bg-clip-text text-transparent font-semibold mt-3 text-2xl">
                          {banner.subtitle}
                        </span>
                      </>
                    )}
                  </h1>
                )}

                {/* Description */}
                {banner.description && (
                  <p className="text-lg max-w-xl text-gray-800 tracking-wider">
                    {banner.description}
                  </p>
                )}

                {/* CTA Button */}
                {banner.link && (
                  <div className="flex flex-row gap-2 md:gap-4 pt-10 md:pt-12 lg:pt-16 xl:pt-20">
                    {banner.link === "buy-now" ? (
                      <button
                        onClick={() => onBuyNow?.(banner.link)}
                        className="bg-gradient-to-r from-landing-primary to-landing-primary text-white px-5 py-2 md:px-8 md:py-4 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {banner.button_text || "SHOP NOW"}
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    ) : (
                      <Link
                        href={banner.link}
                        className="bg-gradient-to-r from-landing-primary to-landing-primary text-white px-5 py-2 md:px-8 md:py-4 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {banner.button_text || "SHOP NOW"}
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Image */}
              <div
                className={`flex-1 relative ${
                  index % 2 === 0 ? "order-1 md:order-2" : "order-1"
                }`}
              >
                <div className="relative group cursor-pointer">
                  {banner.image_url && (
                    <FallbackImage
                      src={banner.image_url}
                      alt={banner.title || "Featured image"}
                      width={832}
                      height={512}
                      className="w-full h-full object-cover rounded-2xl transition-all duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export default ArcadiaFeatured;
