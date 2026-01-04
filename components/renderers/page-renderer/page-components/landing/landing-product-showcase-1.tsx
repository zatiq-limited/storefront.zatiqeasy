/**
 * Landing Product Showcase 1
 * Gallery of product images with zoom
 */

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";

interface LandingProductShowcase1Settings {
  title?: string;
  showTitle?: boolean;
  layout?: "grid" | "masonry" | "carousel";
  columns?: number;
  gap?: "sm" | "md" | "lg";
  enableZoom?: boolean;
  enableLightbox?: boolean;
  backgroundColor?: string;
  titleColor?: string;
  fontFamily?: string;
  viewMode?: "desktop" | "tablet" | "mobile" | null;
}

interface LandingProductShowcase1Props {
  settings: LandingProductShowcase1Settings;
  productImages?: string[];
}

const gapMap = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

export default function LandingProductShowcase1({
  settings,
  productImages = [],
}: LandingProductShowcase1Props) {
  const {
    title = "Product Gallery",
    showTitle = true,
    layout = "grid",
    columns = 3,
    gap = "md",
    enableZoom = true,
    enableLightbox = true,
    backgroundColor = "#FFFFFF",
    titleColor = "#111827",
    fontFamily = "inherit",
  } = settings;

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Use placeholder images if no product images provided
  const images =
    productImages.length > 0
      ? productImages
      : [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
        ];

  const gridColsClass =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
      ? "md:grid-cols-4"
      : "md:grid-cols-3";

  const gapClass = gapMap[gap] || gapMap.md;

  const handleImageClick = (image: string) => {
    if (enableLightbox) {
      setLightboxImage(image);
    }
  };

  return (
    <section
      className="py-16 px-4"
      style={{ backgroundColor, fontFamily }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {showTitle && title && (
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: titleColor }}
            >
              {title}
            </h2>
          </div>
        )}

        {/* Grid Layout */}
        {layout === "grid" && (
          <div className={`grid grid-cols-2 ${gridColsClass} ${gapClass}`}>
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer group ${
                  enableZoom ? "hover:shadow-xl transition-shadow" : ""
                }`}
                onClick={() => handleImageClick(image)}
              >
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  fill
                  className={`object-cover transition-transform ${
                    enableZoom ? "group-hover:scale-110" : ""
                  }`}
                />
                {enableLightbox && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Carousel Layout */}
        {layout === "carousel" && (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="flex-none w-80 aspect-square relative rounded-lg overflow-hidden cursor-pointer snap-center"
                onClick={() => handleImageClick(image)}
              >
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Masonry Layout */}
        {layout === "masonry" && (
          <div className={`columns-2 md:columns-3 ${gapClass}`}>
            {images.map((image, index) => (
              <div
                key={index}
                className="break-inside-avoid mb-4 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => handleImageClick(image)}
              >
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  width={400}
                  height={index % 2 === 0 ? 400 : 500}
                  className="w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {enableLightbox && lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
            <Image
              src={lightboxImage}
              alt="Product image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
