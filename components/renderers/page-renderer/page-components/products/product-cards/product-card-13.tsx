/**
 * ProductCard13 - Large Image with Gradient Overlay
 * Desktop classes from merchant panel with responsive prefixes
 */

"use client";

import { FallbackImage } from "@/components/ui/fallback-image";
import Link from "next/link";

interface ProductCard13Props {
  id: number | string;
  handle: string;
  title: string;
  price: number;
  currency?: string;
  image: string;
  quickAddEnabled?: boolean;
  buyNowEnabled?: boolean;
  buttonBgColor?: string;
  buttonTextColor?: string;
  priceColor?: string;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
}

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
}: ProductCard13Props) {
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
                  className="flex-1 h-7 sm:h-8 lg:h-9 text-[10px] sm:text-xs lg:text-sm rounded font-medium transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: buttonBgColor,
                    color: buttonTextColor,
                  }}
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
