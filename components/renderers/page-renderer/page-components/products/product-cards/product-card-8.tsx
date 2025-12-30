/**
 * ProductCard8 - Compact Design with Rating and Small Add Button
 * Desktop classes from merchant panel with responsive prefixes
 */

"use client";

import { useState } from "react";
import { FallbackImage } from "@/components/ui/fallback-image";
import Link from "next/link";

interface ProductCard8Props {
  id: number | string;
  handle: string;
  title: string;
  vendor?: string;
  price: number;
  currency?: string;
  image: string;
  hoverImage?: string;
  rating?: number;
  quickAddEnabled?: boolean;
  buttonBgColor?: string;
  buttonTextColor?: string;
  priceColor?: string;
  onAddToCart?: () => void;
}

export default function ProductCard8({
  handle,
  title,
  vendor,
  price,
  currency = "BDT",
  image,
  hoverImage,
  rating = 0,
  quickAddEnabled = true,
  buttonBgColor = "#3B82F6",
  buttonTextColor = "#FFFFFF",
  priceColor = "#10B981",
  onAddToCart,
}: ProductCard8Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="font-poppins w-full h-full">
      <Link
        href={`/products/${handle}`}
        className="w-full h-full bg-white rounded-lg overflow-hidden relative cursor-pointer transition-all duration-300 border border-gray-100 hover:shadow-lg flex flex-col block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="w-full aspect-[298/246] relative bg-[#FAFAFA] overflow-hidden">
          <FallbackImage
            src={isHovered && hoverImage ? hoverImage : image}
            alt={title}
            fill
            className="object-cover object-top transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>

        {/* Content Area */}
        <div className="px-3 pt-2 pb-3 sm:px-4 sm:pt-3 sm:pb-4 lg:px-5 lg:pt-3 lg:pb-6 flex flex-col flex-1 bg-white">
          {/* Vendor */}
          {vendor && (
            <div className="text-[10px] sm:text-xs lg:text-xs text-[#ADADAD] font-normal leading-6 mb-1.5 sm:mb-2 lg:mb-3">
              {vendor}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xs sm:text-sm lg:text-base font-medium text-[#2B2B2D] leading-5 sm:leading-6 lg:leading-6 mb-1.5 sm:mb-2 lg:mb-3 overflow-hidden line-clamp-2">
            {title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 sm:gap-1.5 mb-3 sm:mb-5 lg:mb-8">
            {/* Star Rating */}
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-3 h-3 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[17px]"
                  viewBox="0 0 18 17"
                  fill={star <= Math.round(rating) ? "#FFA500" : "#E5E7EB"}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.55859 0L11.2036 5.35942L17.1181 6.21885L12.8383 10.3906L13.8487 16.2812L8.55859 13.5L3.26853 16.2812L4.27884 10.3906L-0.000914574 6.21885L5.91356 5.35942L8.55859 0Z" />
                </svg>
              ))}
            </div>
            {/* Rating Count */}
            {rating > 0 && (
              <span className="text-[10px] sm:text-xs lg:text-sm font-normal text-[#B6B6B6] leading-6 underline">
                ({rating.toFixed(1)})
              </span>
            )}
          </div>

          {/* Price and Button Row */}
          <div className="flex items-center justify-between mt-auto gap-2">
            {/* Price */}
            <span
              className="text-sm sm:text-base lg:text-xl font-bold leading-7"
              style={{ color: priceColor }}
            >
              {currency} {price.toLocaleString()}
            </span>

            {/* Add Button */}
            {quickAddEnabled && (
              <button
                className="w-16 h-8 sm:w-18 sm:h-9 lg:w-20 lg:h-10 border-none rounded text-xs sm:text-xs lg:text-sm font-bold leading-6 cursor-pointer transition-all duration-300 flex items-center justify-center gap-1 hover:opacity-90"
                style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart?.();
                }}
              >
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-3.5 lg:h-3.5"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 1.72667H2.47333V1.54C2.41111 1.10444 2.21667 0.738889 1.89 0.443334C1.56333 0.147778 1.16667 0 0.7 0H0V1.16667H0.7C0.855556 1.16667 0.987778 1.21333 1.09667 1.30667C1.20556 1.4 1.27556 1.52444 1.30667 1.68L2.24 9.52C2.27111 9.98667 2.45 10.36 2.77667 10.64C3.10333 10.92 3.5 11.0756 3.96667 11.1067H11.6667V9.89333H3.96667C3.81111 9.89333 3.67889 9.84667 3.57 9.75333C3.46111 9.66 3.39111 9.53556 3.36 9.38L3.31333 8.72667H12.74L14 1.72667ZM11.76 7.56H3.17333L2.61333 2.89333H12.6L11.76 7.56ZM2.94 12.8333C2.90889 13.1444 3.01 13.4167 3.24333 13.65C3.47667 13.8833 3.75667 14 4.08333 14C4.41 14 4.68222 13.8833 4.9 13.65C5.11778 13.4167 5.23444 13.1444 5.25 12.8333C5.26556 12.5222 5.15667 12.25 4.92333 12.0167C4.69 11.7833 4.41 11.6667 4.08333 11.6667C3.75667 11.6667 3.48444 11.7833 3.26667 12.0167C3.04889 12.25 2.94 12.5222 2.94 12.8333ZM8.77333 12.8333C8.74222 13.1444 8.84333 13.4167 9.07667 13.65C9.31 13.8833 9.59 14 9.91667 14C10.2433 14 10.5156 13.8833 10.7333 13.65C10.9511 13.4167 11.0678 13.1444 11.0833 12.8333C11.0989 12.5222 10.99 12.25 10.7567 12.0167C10.5233 11.7833 10.2433 11.6667 9.91667 11.6667C9.59 11.6667 9.31778 11.7833 9.1 12.0167C8.88222 12.25 8.77333 12.5222 8.77333 12.8333Z"
                    fill="currentColor"
                  />
                </svg>
                Add
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
