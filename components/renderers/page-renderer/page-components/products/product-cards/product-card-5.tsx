/**
 * ========================================
 * PRODUCT CARD 5 - MINIMAL DESIGN
 * ========================================
 *
 * Minimal card with hover overlay and discount badge
 */

"use client";

import { useState } from "react";
import { FallbackImage } from "@/components/ui/fallback-image";
import Link from "next/link";
import type { ProductCardProps } from "./index";

export default function ProductCard5({
  handle,
  title,
  price,
  comparePrice,
  currency = "৳",
  image,
  hoverImage,
  priceColor = "#181D25",
  oldPriceColor = "#9C9B9B",
  quickAddEnabled = true,
  buyNowEnabled = true,
  onAddToCart,
  onBuyNow,
  isOutOfStock = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const discountPercent =
    comparePrice && price
      ? `-${Math.round(((comparePrice - price) / comparePrice) * 100)}%`
      : null;

  return (
    <Link
      href={`/products/${handle}`}
      className="block w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-full overflow-hidden relative cursor-pointer transition-all duration-300">
        {/* Image Container - taller aspect ratio */}
        <div className="w-full aspect-[282/450] relative overflow-hidden">
          <FallbackImage
            src={isHovered && hoverImage ? hoverImage : image}
            alt={title}
            fill
            className="object-cover object-top transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Badge - Show Out of Stock badge if product is out of stock, otherwise show discount badge */}
          {isOutOfStock ? (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center bg-gray-600">
              <span className="text-white text-[8px] sm:text-[10px] lg:text-xs font-normal leading-tight text-center">
                Out of Stock
              </span>
            </div>
          ) : (
            discountPercent && (
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center bg-red-500">
                <span className="text-white text-[10px] sm:text-xs lg:text-base font-normal leading-tight">
                  {discountPercent}
                </span>
              </div>
            )
          )}

          {/* Hover Overlay with Buttons - Desktop */}
          <div
            className={`absolute inset-0 bg-black/40 flex-col items-center justify-center gap-3 px-4 z-10 transition-opacity duration-300 hidden sm:flex ${
              isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {quickAddEnabled && (
              <button
                className={`w-full h-11 lg:h-12 rounded flex items-center justify-center text-sm font-medium transition-all duration-300 leading-5 ${
                  isOutOfStock
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:bg-gray-100"
                }`}
                style={{
                  backgroundColor: isOutOfStock ? "#E5E7EB" : "#FFFFFF",
                  color: isOutOfStock ? "#6B7280" : "#111827",
                }}
                disabled={isOutOfStock}
                onClick={(e) => {
                  e.preventDefault();
                  if (!isOutOfStock) {
                    onAddToCart?.();
                  }
                }}
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            )}
            {buyNowEnabled && !isOutOfStock && (
              <button
                className="w-full h-11 lg:h-12 rounded bg-red-500 flex items-center justify-center cursor-pointer text-sm font-medium text-white transition-all duration-300 leading-5 hover:bg-red-600"
                onClick={(e) => {
                  e.preventDefault();
                  onBuyNow?.();
                }}
              >
                Buy Now
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="pt-2 sm:pt-3 flex flex-col justify-center">
          {/* Title */}
          <h3 className="text-[10px] sm:text-xs lg:text-sm font-normal text-gray-900 mb-0.5 sm:mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {title}
          </h3>

          {/* Prices */}
          <div className="pt-1 sm:pt-1.5 flex items-center justify-between gap-1 sm:gap-1.5">
            <div className="flex items-center flex-wrap gap-1 sm:gap-1.5">
              <span
                className="text-xs sm:text-sm lg:text-base font-bold"
                style={{ color: priceColor }}
              >
                {currency} {price.toLocaleString()}
              </span>
              {comparePrice && (
                <span
                  className="text-[10px] sm:text-xs lg:text-sm line-through font-normal"
                  style={{ color: oldPriceColor }}
                >
                  {comparePrice.toLocaleString()} {currency}
                </span>
              )}
            </div>

            {/* Mobile Icon Buttons */}
            <div className="flex gap-1.5 sm:hidden">
              {quickAddEnabled && (
                <button
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    isOutOfStock
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer active:scale-95"
                  }`}
                  style={{
                    backgroundColor: isOutOfStock ? "#E5E7EB" : "#E5E7EB",
                    color: isOutOfStock ? "#6B7280" : "#111827",
                  }}
                  disabled={isOutOfStock}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isOutOfStock) {
                      onAddToCart?.();
                    }
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5V19M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
              {buyNowEnabled && !isOutOfStock && (
                <button
                  className="w-8 h-8 rounded-lg bg-red-500/90 flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95"
                  onClick={(e) => {
                    e.preventDefault();
                    onBuyNow?.();
                  }}
                >
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
