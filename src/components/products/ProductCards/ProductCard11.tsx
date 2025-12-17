/**
 * ProductCard11 - Hover Scale Effect with Rounded Badge
 * Desktop classes from merchant panel with responsive prefixes
 */

"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCard11Props {
  id: number | string;
  handle: string;
  title: string;
  price: number;
  currency?: string;
  image: string;
  badge?: string | null;
  quickAddEnabled?: boolean;
  buyNowEnabled?: boolean;
  buttonBgColor?: string;
  buttonTextColor?: string;
  priceColor?: string;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
}

export default function ProductCard11({
  handle,
  title,
  price,
  currency = "BDT",
  image,
  badge,
  quickAddEnabled = true,
  buyNowEnabled = true,
  buttonBgColor = "#3B82F6",
  buttonTextColor = "#FFFFFF",
  priceColor = "#3465F0",
  onAddToCart,
  onBuyNow,
}: ProductCard11Props) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer">
      <Link href={`/products/${handle}`} className="block">
        {/* Image Container */}
        <div className="relative h-40 sm:h-[190px] lg:h-[220px] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          {/* Rounded Badge */}
          {badge && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs bg-red-500 text-white rounded-full font-bold">
              {badge}
            </div>
          )}
          {/* Mobile Icon Buttons */}
          <div className="absolute bottom-2 right-2 flex gap-1.5 sm:hidden">
            {quickAddEnabled && (
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart?.();
                }}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14 1.72667H2.47333V1.54C2.41111 1.10444 2.21667 0.738889 1.89 0.443334C1.56333 0.147778 1.16667 0 0.7 0H0V1.16667H0.7C0.855556 1.16667 0.987778 1.21333 1.09667 1.30667C1.20556 1.4 1.27556 1.52444 1.30667 1.68L2.24 9.52C2.27111 9.98667 2.45 10.36 2.77667 10.64C3.10333 10.92 3.5 11.0756 3.96667 11.1067H11.6667V9.89333H3.96667C3.81111 9.89333 3.67889 9.84667 3.57 9.75333C3.46111 9.66 3.39111 9.53556 3.36 9.38L3.31333 8.72667H12.74L14 1.72667ZM11.76 7.56H3.17333L2.61333 2.89333H12.6L11.76 7.56ZM2.94 12.8333C2.90889 13.1444 3.01 13.4167 3.24333 13.65C3.47667 13.8833 3.75667 14 4.08333 14C4.41 14 4.68222 13.8833 4.9 13.65C5.11778 13.4167 5.23444 13.1444 5.25 12.8333C5.26556 12.5222 5.15667 12.25 4.92333 12.0167C4.69 11.7833 4.41 11.6667 4.08333 11.6667C3.75667 11.6667 3.48444 11.7833 3.26667 12.0167C3.04889 12.25 2.94 12.5222 2.94 12.8333ZM8.77333 12.8333C8.74222 13.1444 8.84333 13.4167 9.07667 13.65C9.31 13.8833 9.59 14 9.91667 14C10.2433 14 10.5156 13.8833 10.7333 13.65C10.9511 13.4167 11.0678 13.1444 11.0833 12.8333C11.0989 12.5222 10.99 12.25 10.7567 12.0167C10.5233 11.7833 10.2433 11.6667 9.91667 11.6667C9.59 11.6667 9.31778 11.7833 9.1 12.0167C8.88222 12.25 8.77333 12.5222 8.77333 12.8333Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            )}
            {buyNowEnabled && (
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                onClick={(e) => {
                  e.preventDefault();
                  onBuyNow?.();
                }}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-2 sm:p-4">
          {/* Title */}
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Price */}
          <div className="mb-0 sm:mb-2">
            <span
              className="text-sm sm:text-lg font-bold"
              style={{ color: priceColor }}
            >
              {currency} {price.toLocaleString()}
            </span>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden sm:flex gap-2">
            {quickAddEnabled && (
              <button
                className="flex-1 h-9 lg:h-10 text-xs lg:text-sm rounded-lg font-medium transition-opacity hover:opacity-90"
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
                className="flex-1 h-9 lg:h-10 text-xs lg:text-sm rounded-lg font-medium border-2 transition-all hover:opacity-80"
                style={{ borderColor: buttonBgColor, color: buttonBgColor }}
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
      </Link>
    </div>
  );
}
