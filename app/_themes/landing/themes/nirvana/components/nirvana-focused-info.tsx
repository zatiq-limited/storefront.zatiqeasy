"use client";

import React from "react";
import type { ContentInterface } from "@/types/landing-page.types";

interface NirvanaFocusedInfoProps {
  content: ContentInterface | null | undefined;
  onBuyNow?: (link: string | null) => void;
}

export function NirvanaFocusedInfo({ content, onBuyNow }: NirvanaFocusedInfoProps) {
  if (!content) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-landing-primary/5 via-landing-primary/10 to-landing-secondary/5" />

      <div className="relative py-16 md:py-20 xl:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 space-y-8 md:space-y-12 text-center">
            {/* Title Section */}
            {content.title && (
              <div className="relative inline-block group">
                <div className="absolute -inset-1 bg-gradient-to-r from-landing-primary/20 to-landing-secondary/20 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <h2 className="relative px-1 md:px-7 py-4 bg-white/50 backdrop-blur-sm rounded-lg text-4xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-landing-primary to-landing-secondary bg-clip-text text-transparent transition-all duration-300 ease-out hover:scale-[1.02]">
                  {content.title}
                </h2>
              </div>
            )}

            {/* Description Section */}
            {content.description && (
              <div className="relative max-w-4xl mx-auto px-6 py-8 rounded-xl">
                <p className="text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-semibold text-gray-800/90 leading-relaxed tracking-wide">
                  {content.description}
                </p>
              </div>
            )}

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-landing-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-landing-secondary/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NirvanaFocusedInfo;
