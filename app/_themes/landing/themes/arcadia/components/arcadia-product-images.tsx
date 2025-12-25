"use client";

import React from "react";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { ProductImageInterface } from "@/types/landing-page.types";

interface ArcadiaProductImagesProps {
  content: ProductImageInterface | null | undefined;
}

export function ArcadiaProductImages({ content }: ArcadiaProductImagesProps) {
  if (!content?.title && !content?.content?.length) {
    return null;
  }

  return (
    <div className="w-full py-10 md:py-16 lg:py-20">
      <div className="w-[90%] max-w-[1840px] mx-auto">
        {/* Title */}
        {content.title && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-slate-950 text-center font-bold leading-snug">
            {content.title}
          </h2>
        )}

        {/* Image Grid */}
        {content.content && content.content.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-7 md:mt-9 lg:mt-10 2xl:mt-11">
            {content.content.map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden group rounded-md"
              >
                <FallbackImage
                  src={image}
                  alt={`${content.title || "Product"} ${index + 1}`}
                  width={442}
                  height={526}
                  className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105 cursor-pointer aspect-[442/526]"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ArcadiaProductImages;
