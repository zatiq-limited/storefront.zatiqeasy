"use client";

import React from "react";
import { useShopStore } from "@/stores/shopStore";
import type { ContentInterface } from "@/types/landing-page.types";

interface ArcadiaStandaloneProps {
  content: ContentInterface | null | undefined;
  onBuyNow?: (link: string | null) => void;
}

// Decorative star components
function StarLeft() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-20"
    >
      <path
        d="M60 0L72.4 47.6L120 60L72.4 72.4L60 120L47.6 72.4L0 60L47.6 47.6L60 0Z"
        className="fill-landing-primary"
      />
    </svg>
  );
}

function StarRight() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-20"
    >
      <path
        d="M40 0L48.3 31.7L80 40L48.3 48.3L40 80L31.7 48.3L0 40L31.7 31.7L40 0Z"
        className="fill-landing-primary"
      />
    </svg>
  );
}

export function ArcadiaStandalone({ content, onBuyNow }: ArcadiaStandaloneProps) {
  const { shopDetails } = useShopStore();

  if (!content) {
    return null;
  }

  return (
    <div className="relative overflow-hidden group cursor-pointer">
      <div className="w-full bg-gradient-to-b from-white to-violet-50 py-10 md:py-24 lg:py-28 xl:py-32 2xl:py-40 transition-all duration-500">
        <div className="w-[90%] mx-auto flex justify-center items-center">
          <div className="max-w-[720px] xl:max-w-none mx-auto text-white transform transition-transform duration-500 group-hover:scale-[1.02]">
            {/* Title */}
            {content.title && (
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-4xl text-landing-primary text-center transition-colors duration-300 font-semibold">
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
              <p className="text-gray-700 text-center text-lg xl:text-xl 2xl:text-2xl mt-5 md:mt-8 2xl:mt-11 leading-relaxed mx-3 md:mx-10">
                {content.description}
              </p>
            )}

            {/* CTA Button */}
            {content.button_text && content.link && (
              <div className="flex justify-center mt-8 md:mt-12">
                <button
                  onClick={() => onBuyNow?.(content.link)}
                  className="bg-landing-primary hover:bg-landing-primary/90 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-xl cursor-pointer"
                >
                  {content.button_text}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Stars */}
      <div className="absolute left-0 bottom-0">
        <StarLeft />
      </div>
      <div className="absolute right-0 top-0">
        <StarRight />
      </div>
    </div>
  );
}

export default ArcadiaStandalone;
