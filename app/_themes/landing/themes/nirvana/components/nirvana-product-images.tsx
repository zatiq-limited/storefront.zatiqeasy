"use client";

import React from "react";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { ProductImageInterface } from "@/types/landing-page.types";

interface NirvanaProductImagesProps {
  content: ProductImageInterface | null | undefined;
}

export function NirvanaProductImages({ content }: NirvanaProductImagesProps) {
  if (!content || !content.content?.length) {
    return null;
  }

  return (
    <div className="w-full container mx-auto">
      <div className="w-[90%] max-w-[1840px] mx-auto">
        {/* Title */}
        {content.title && (
          <h2 className="pt-10 md:pt-20 pb-5 md:pb-10 text-4xl md:text-6xl font-extrabold text-center bg-linear-to-r from-landing-primary to-landing-secondary bg-clip-text text-transparent leading-tight">
            {content.title}
          </h2>
        )}

        {/* Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 mt-7 md:mt-9 lg:mt-10 2xl:mt-11">
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
                className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105 cursor-pointer aspect-square rounded-2xl"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NirvanaProductImages;
