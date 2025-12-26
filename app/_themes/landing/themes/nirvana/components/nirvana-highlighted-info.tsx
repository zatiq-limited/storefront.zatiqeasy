"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import type { ContentInterface } from "@/types/landing-page.types";

interface NirvanaHighlightedInfoProps {
  content: ContentInterface | null | undefined;
  onBuyNow?: (link: string | null) => void;
}

export function NirvanaHighlightedInfo({
  content,
  onBuyNow,
}: NirvanaHighlightedInfoProps) {
  if (!content) {
    return null;
  }

  const isBuyNow = content.link === "buy-now";

  return (
    <div className="py-10 md:py-16 mt-8 md:mt-10 2xl:mt-14">
      <div className="w-[90%] mx-auto max-w-7xl">
        {/* Title */}
        {content.title && (
          <h2 className="text-4xl md:text-6xl font-extrabold text-center md:pb-5 bg-linear-to-r from-landing-primary to-landing-secondary bg-clip-text text-transparent leading-tight">
            {content.title}
          </h2>
        )}

        {/* Description */}
        {content.description && (
          <p className="pt-6 md:pt-12 mx-4 lg:mx-36 2xl:mx-40 text-center text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-semibold text-gray-800/90 leading-relaxed tracking-wide">
            {content.description}
          </p>
        )}

        {/* CTA Button */}
        {content.button_text && (
          <div className="flex justify-center mt-6 md:mt-8 xl:mt-12">
            <button
              onClick={() => onBuyNow?.(content.link)}
              className="flex items-center gap-4 lg:gap-6 py-4 md:py-5 xl:py-6 px-10 md:px-14 xl:px-16 bg-landing-secondary rounded-full hover:bg-landing-secondary/80 transform transition duration-500 hover:scale-105 cursor-pointer"
            >
              {isBuyNow && (
                <ShoppingCart className="h-8 w-8 md:h-10 md:w-10 xl:h-12 xl:w-12 text-white" />
              )}
              <span className="text-lg lg:text-2xl 2xl:text-3xl font-bold text-white leading-none">
                {content.button_text}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NirvanaHighlightedInfo;
