/**
 * ProductCard7 - Color Swatches Design
 * Desktop classes from merchant panel with responsive prefixes
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductCard7Props {
  id: number | string;
  handle: string;
  title: string;
  price: number;
  comparePrice?: number | null;
  currency?: string;
  image: string;
  hoverImage?: string;
  colors?: string[];
  quickAddEnabled?: boolean;
  buttonBgColor?: string;
  buttonTextColor?: string;
  priceColor?: string;
  oldPriceColor?: string;
  onAddToCart?: () => void;
  onColorSelect?: (colorIndex: number) => void;
  routePrefix?: string;
}

export default function ProductCard7({
  handle,
  title,
  price,
  comparePrice,
  currency = "BDT",
  image,
  hoverImage,
  colors = [],
  quickAddEnabled = true,
  buttonBgColor = "#3B82F6",
  buttonTextColor = "#FFFFFF",
  priceColor = "#181D25",
  oldPriceColor = "#9CA3AF",
  onAddToCart,
  onColorSelect,
  routePrefix = "",
}: ProductCard7Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  // Calculate discount percentage
  const discountPercent =
    comparePrice && price ? -Math.round(((comparePrice - price) / comparePrice) * 100) + "%" : null;

  const handleColorSelect = (index: number) => {
    setSelectedColor(index);
    onColorSelect?.(index);
  };

  return (
    <div className="font-sans w-full h-full">
      <Link
        href={`${routePrefix}/products/${handle}`}
        className="w-full overflow-visible relative cursor-pointer transition-all duration-300 block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="w-full aspect-[4/5] relative mb-2 sm:mb-3 lg:mb-4 overflow-hidden">
          <Image
            src={isHovered && hoverImage ? hoverImage : image}
            alt={title}
            fill
            className="object-cover object-top transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Discount Badge */}
          {discountPercent && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 lg:top-4 lg:left-4 text-white px-1.5 py-0.5 sm:px-2 sm:py-0.5 lg:px-2.5 lg:py-1 rounded text-[10px] sm:text-xs lg:text-xs font-medium leading-3 sm:leading-4 lg:leading-4 bg-red-500">
              {discountPercent}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex flex-col">
          {/* Color Options */}
          {colors.length > 0 && (
            <div className="flex gap-2 mb-2 sm:mb-3 lg:mb-4">
              {colors.map((color, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    handleColorSelect(index);
                  }}
                  className="relative w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <div
                    className={`rounded-full transition-all duration-200 ${
                      selectedColor === index
                        ? "w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4"
                        : "w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                  {selectedColor === index && (
                    <div className="absolute inset-0 rounded-full border border-[#6B7280]" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xs sm:text-sm lg:text-sm font-medium text-[#181D25] leading-4 sm:leading-5 lg:leading-5 mb-1 sm:mb-1.5 lg:mb-2 line-clamp-1">
            {title}
          </h3>

          {/* Prices */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3 lg:mb-4">
            <span
              className="text-sm sm:text-base lg:text-base font-semibold leading-5 sm:leading-6 lg:leading-6"
              style={{ color: priceColor }}
            >
              {currency} {price.toLocaleString()}
            </span>
            {comparePrice && (
              <span
                className="text-xs sm:text-sm lg:text-sm font-semibold line-through leading-4 sm:leading-5 lg:leading-5"
                style={{ color: oldPriceColor }}
              >
                {currency} {comparePrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          {quickAddEnabled && (
            <button
              className="w-full h-9 sm:h-10 lg:h-11 border-none rounded-3xl text-xs sm:text-sm lg:text-sm font-medium cursor-pointer transition-all duration-300 hover:opacity-90"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.();
              }}
            >
              Add to cart
            </button>
          )}
        </div>
      </Link>
    </div>
  );
}
