"use client";

import React from "react";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { ProductImageInterface } from "@/types/landing-page.types";

interface ProductImagesGridProps {
  productImages: ProductImageInterface | null | undefined;
  className?: string;
}

export function ProductImagesGrid({
  productImages,
  className = "",
}: ProductImagesGridProps) {
  if (!productImages?.content?.length) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 lg:pt-24 xl:pt-28">
        {/* Title */}
        {productImages.title && (
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-foreground text-center font-bold leading-snug mb-8 md:mb-12">
            {productImages.title}
          </h2>
        )}

        {/* Images Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {productImages.content.map((imageUrl, index) => (
            <div
              key={index}
              className="relative overflow-hidden group rounded-lg bg-gray-100 dark:bg-gray-800"
            >
              <FallbackImage
                src={imageUrl}
                alt={productImages.title || `Product image ${index + 1}`}
                width={500}
                height={500}
                className="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-105 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductImagesGrid;
