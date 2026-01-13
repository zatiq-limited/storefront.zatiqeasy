"use client";

import React from "react";
import { useShopStore } from "@/stores/shopStore";
import type { ContentInterface } from "@/types/landing-page.types";

interface NirvanaStaticBannerProps {
  content: ContentInterface | null | undefined;
  onBuyNow?: (link: string | null) => void;
}

export function NirvanaStaticBanner({
  content,
  onBuyNow,
}: NirvanaStaticBannerProps) {
  const { shopDetails } = useShopStore();

  if (!content) {
    return null;
  }

  return (
    <div className="relative overflow-hidden group bg-landing-secondary/15">
      <div className="container mx-auto w-full py-20 md:py-24 lg:py-28 xl:py-32 2xl:py-44 transition-all duration-500">
        <div className="flex justify-center items-center">
          <div className="mx-auto transform transition-transform duration-500 group-hover:scale-[1.02]">
            {/* Title */}
            {content.title && (
              <h1 className="max-w-6xl mx-auto text-center text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-landing-primary to-landing-secondary leading-tight tracking-tight">
                {content.title}
              </h1>
            )}

            {/* Decorative Divider */}
            <div className="flex items-center my-6 md:my-14 w-full">
              <div className="grow border-t border-landing-primary" />
              {shopDetails?.shop_name && (
                <span className="mx-4 text-landing-primary font-thin text-xs tracking-[0.2em]">
                  {shopDetails.shop_name}
                </span>
              )}
              <div className="grow border-t border-landing-primary" />
            </div>

            {/* Description */}
            {content.description && (
              <p className="mx-4 lg:mx-36 2xl:mx-56 text-center text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-semibold text-gray-800/90 leading-relaxed tracking-wide">
                {content.description}
              </p>
            )}

            {/* CTA Button */}
            {content.button_text && content.link && (
              <div className="flex justify-center mt-8 md:mt-12">
                <button
                  onClick={() => onBuyNow?.(content.link)}
                  className="px-8 py-4 bg-linear-to-r from-landing-primary to-landing-secondary text-white font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  {content.button_text}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NirvanaStaticBanner;
