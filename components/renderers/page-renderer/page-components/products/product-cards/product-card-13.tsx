/**
 * ProductCard13 - Large Image with Gradient Overlay
 * Desktop classes from merchant panel with responsive prefixes
 */

"use client";

import { FallbackImage } from "@/components/ui/fallback-image";
import Link from "next/link";
import type { ProductCardProps } from "./index";

export default function ProductCard13({
  handle,
  title,
  price,
  currency = "BDT",
  image,
  quickAddEnabled = true,
  buyNowEnabled = true,
  buttonBgColor = "#3B82F6",
  buttonTextColor = "#FFFFFF",
  priceColor = "#FFFFFF",
  onAddToCart,
  onBuyNow,
  isOutOfStock = false,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
      <Link href={`/products/${handle}`} className="block">
        {/* Image Container with Gradient Overlay */}
        <div className="relative h-[200px] sm:h-60 lg:h-[280px]">
          <FallbackImage
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs bg-gray-600 text-white rounded font-medium">
              Out of Stock
            </div>
          )}
          {/* Gradient Overlay with Content */}
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-2 sm:p-4">
            {/* Title */}
            <h3 className="text-white font-semibold line-clamp-1 text-sm sm:text-base mb-1 sm:mb-2">
              {title}
            </h3>

            {/* Price */}
            <span
              className="text-white/90 text-xs sm:text-sm block mb-2"
              style={{ color: priceColor }}
            >
              {currency} {price.toLocaleString()}
            </span>

            {/* Buttons for all viewModes */}
            <div className="flex gap-2">
              {quickAddEnabled && (
                <button
                  className={`flex-1 h-7 sm:h-8 lg:h-9 text-[10px] sm:text-xs lg:text-sm rounded font-medium transition-opacity ${
                    isOutOfStock
                      ? "cursor-not-allowed opacity-60"
                      : "hover:opacity-90"
                  }`}
                  style={{
                    backgroundColor: isOutOfStock ? "#E5E7EB" : buttonBgColor,
                    color: isOutOfStock ? "#6B7280" : buttonTextColor,
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
                  className="flex-1 h-7 sm:h-8 lg:h-9 text-[10px] sm:text-xs lg:text-sm rounded font-medium bg-white/20 border border-white/50 text-white backdrop-blur-sm transition-all hover:bg-white/30"
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
        </div>
      </Link>
    </div>
  );
}
