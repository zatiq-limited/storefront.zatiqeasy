/**
 * ProductCard6 - Rating Stars Design
 * Desktop classes from merchant panel with responsive prefixes
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductCard6Props {
  id: number | string;
  handle: string;
  title: string;
  price: number;
  comparePrice?: number | null;
  currency?: string;
  image: string;
  hoverImage?: string;
  rating?: number;
  reviewCount?: number;
  quickAddEnabled?: boolean;
  buyNowEnabled?: boolean;
  buttonBgColor?: string;
  buttonTextColor?: string;
  priceColor?: string;
  oldPriceColor?: string;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  routePrefix?: string;
}

export default function ProductCard6({
  handle,
  title,
  price,
  comparePrice,
  currency = "BDT",
  image,
  hoverImage,
  rating = 0,
  reviewCount = 0,
  quickAddEnabled = true,
  buyNowEnabled = true,
  buttonBgColor = "#3B82F6",
  buttonTextColor = "#FFFFFF",
  priceColor = "#181D25",
  oldPriceColor = "#A2A2A2",
  onAddToCart,
  onBuyNow,
  routePrefix = "",
}: ProductCard6Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="font-poppins w-full h-full">
      <Link
        href={`${routePrefix}/products/${handle}`}
        className="w-full h-full overflow-hidden relative cursor-pointer transition-all duration-300 flex flex-col block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="w-full aspect-[282/350] relative bg-gray-100 overflow-hidden">
          <Image
            src={isHovered && hoverImage ? hoverImage : image}
            alt={title}
            fill
            className="object-cover object-top transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>

        {/* Content Area */}
        <div className="pt-2 sm:pt-3 lg:pt-3 flex flex-col flex-1">
          {/* Title */}
          <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-[#212121] leading-[147%] mb-1 sm:mb-2 overflow-hidden text-ellipsis whitespace-nowrap line-clamp-1">
            {title}
          </h3>

          {/* Prices */}
          <div className="flex items-center flex-wrap gap-1 sm:gap-2 lg:gap-2 mb-1 sm:mb-2">
            {comparePrice && (
              <span
                className="text-[10px] sm:text-xs lg:text-sm font-semibold line-through leading-5"
                style={{ color: oldPriceColor }}
              >
                {currency} {comparePrice.toLocaleString()}
              </span>
            )}
            <span
              className="text-xs sm:text-sm lg:text-base font-bold leading-[147%]"
              style={{ color: priceColor }}
            >
              {currency} {price.toLocaleString()}
            </span>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Star Rating */}
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-3 h-3 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[17px]"
                  viewBox="0 0 18 17"
                  fill={star <= Math.round(rating) ? "#FDB022" : "#E5E7EB"}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.55859 0L11.2036 5.35942L17.1181 6.21885L12.8383 10.3906L13.8487 16.2812L8.55859 13.5L3.26853 16.2812L4.27884 10.3906L-0.000914574 6.21885L5.91356 5.35942L8.55859 0Z" />
                </svg>
              ))}
            </div>
            {/* Reviews Count */}
            {reviewCount > 0 && (
              <span className="text-[10px] sm:text-xs lg:text-xs font-normal text-[#9CA3AF] underline">
                {reviewCount} reviews
              </span>
            )}
          </div>

          {/* Mobile Buttons */}
          {(quickAddEnabled || buyNowEnabled) && (
            <div className="flex gap-2 mt-2 sm:hidden">
              {quickAddEnabled && (
                <button
                  className="flex-1 h-9 rounded flex items-center justify-center cursor-pointer text-xs font-medium transition-all duration-300 active:scale-95"
                  style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToCart?.();
                  }}
                >
                  Add to Cart
                </button>
              )}
              {buyNowEnabled && (
                <button
                  className="flex-1 h-9 rounded border border-[#3B82F6] bg-white flex items-center justify-center cursor-pointer text-xs font-medium text-[#3B82F6] transition-all duration-300 active:scale-95"
                  onClick={(e) => {
                    e.preventDefault();
                    onBuyNow?.();
                  }}
                >
                  Buy Now
                </button>
              )}
            </div>
          )}
        </div>

        {/* Desktop/Tablet Hover Overlay with Buttons */}
        <div
          className={`hidden sm:flex absolute top-0 left-0 w-full h-full bg-gray-500/60 flex-col items-center justify-center gap-3 px-4 lg:px-[18px] z-5 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Add to Cart Button */}
          {quickAddEnabled && (
            <button
              className="w-full h-11 lg:h-14 rounded flex items-center justify-center cursor-pointer text-sm font-medium transition-all duration-300 leading-5 hover:opacity-90"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.();
              }}
            >
              Add to Cart
            </button>
          )}

          {/* Buy Now Button */}
          {buyNowEnabled && (
            <button
              className="w-full h-11 lg:h-14 rounded bg-white flex items-center justify-center cursor-pointer text-sm font-medium text-[#3B82F6] transition-all duration-300 leading-5 hover:bg-gray-50"
              onClick={(e) => {
                e.preventDefault();
                onBuyNow?.();
              }}
            >
              Buy Now
            </button>
          )}
        </div>
      </Link>
    </div>
  );
}
