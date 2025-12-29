/**
 * ========================================
 * PRODUCT CARD 3 - DUAL BUTTON DESIGN
 * ========================================
 *
 * Card with both Add to Cart and Buy Now buttons
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductCard3Props {
  id: number | string;
  handle: string;
  title: string;
  vendor?: string;
  price: number;
  comparePrice?: number | null;
  currency?: string;
  image: string;
  hoverImage?: string;
  badge?: string | null;
  badgeColor?: string;
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

export default function ProductCard3({
  id,
  handle,
  title,
  vendor,
  price,
  comparePrice,
  currency = "৳",
  image,
  hoverImage,
  badge,
  badgeColor = "#F55157",
  quickAddEnabled = true,
  buyNowEnabled = true,
  buttonBgColor = "#3B82F6",
  buttonTextColor = "#FFFFFF",
  priceColor = "#F55157",
  oldPriceColor = "#9CA3AF",
  onAddToCart,
  onBuyNow,
  routePrefix = "",
}: ProductCard3Props) {
  const [isHovered, setIsHovered] = useState(false);

  const discount =
    comparePrice && comparePrice > price
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : null;

  const displayBadge = badge || (discount ? `${discount}% OFF` : null);

  return (
    <Link
      href={`${routePrefix}/products/${handle}`}
      className="block w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-full bg-white overflow-hidden relative cursor-pointer transition-all rounded duration-300 shadow-[0_0_0_1px_#E5E7EB] hover:shadow-lg flex flex-col">
        {/* Image Container */}
        <div className="w-full aspect-square relative bg-purple-50 overflow-hidden">
          <Image
            src={isHovered && hoverImage ? hoverImage : image}
            alt={title}
            fill
            className="object-cover object-top transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Badge */}
          {displayBadge && (
            <div
              className="absolute top-2 left-2 sm:top-3 sm:left-3 lg:top-4 lg:left-4 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 lg:px-3 rounded text-[10px] sm:text-xs lg:text-sm font-normal"
              style={{ backgroundColor: badgeColor }}
            >
              {displayBadge}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-2.5 sm:p-3 lg:p-4 flex flex-col flex-1 bg-white">
          {/* Vendor */}
          {vendor && (
            <div className="text-[10px] sm:text-xs lg:text-sm text-blue-600 font-normal mb-0.5 sm:mb-1">
              {vendor}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xs sm:text-sm lg:text-base font-medium text-gray-900 mb-0.5 sm:mb-1 line-clamp-2 overflow-hidden">
            {title}
          </h3>

          {/* Prices */}
          <div className="mb-2 sm:mb-4 lg:mb-6 mt-1 sm:mt-2">
            <span
              className="text-sm sm:text-base lg:text-lg font-medium leading-6"
              style={{ color: priceColor }}
            >
              {currency}{price.toLocaleString()}
            </span>
            {comparePrice && (
              <span
                className="text-[10px] sm:text-xs lg:text-sm line-through ml-1 sm:ml-2 font-normal leading-6"
                style={{ color: oldPriceColor }}
              >
                {currency}{comparePrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          {quickAddEnabled && (
            <button
              className="w-full h-10 sm:h-12 lg:h-14 border border-blue-600 rounded flex items-center justify-center cursor-pointer text-xs sm:text-sm lg:text-base font-medium gap-2 transition-all duration-300 leading-6 hover:opacity-90 mb-2 mt-auto"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.();
              }}
            >
              Add to Cart
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.54229 4.56394C3.53235 4.45393 3.54543 4.34304 3.58071 4.23836C3.61599 4.13368 3.67269 4.0375 3.74719 3.95594C3.82169 3.87438 3.91237 3.80924 4.01344 3.76466C4.11451 3.72008 4.22376 3.69705 4.33422 3.69702H13.976C14.0951 3.69707 14.2127 3.72386 14.32 3.77542C14.4274 3.82698 14.5218 3.90198 14.5962 3.99489C14.6707 4.08781 14.7234 4.19627 14.7504 4.31226C14.7773 4.42825 14.7779 4.54882 14.7521 4.66506L13.9374 8.33727C13.7972 8.96833 13.446 9.53272 12.9418 9.9372C12.4375 10.3417 11.8104 10.5621 11.1639 10.5619H6.67934C5.97022 10.562 5.28673 10.2968 4.76321 9.81848C4.2397 9.34016 3.91402 8.68333 3.8502 7.97709L3.54229 4.56394Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.19336 1.79015C1.19336 1.63948 1.25321 1.49498 1.35975 1.38844C1.46629 1.2819 1.61079 1.22205 1.76146 1.22205H3.75436C3.89332 1.22219 4.02741 1.27326 4.13126 1.36559C4.23511 1.45792 4.30151 1.58512 4.31791 1.72311L4.77466 5.58733C4.79229 5.7371 4.74971 5.88773 4.65627 6.0061C4.56283 6.12446 4.42621 6.20086 4.27644 6.21849C4.12668 6.23612 3.97604 6.19353 3.85768 6.1001C3.73931 6.00666 3.66291 5.87003 3.64528 5.72027L3.24875 2.35711H1.76146C1.61079 2.35711 1.46629 2.29726 1.35975 2.19072C1.25321 2.08418 1.19336 1.94082 1.19336 1.79015Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          )}

          {/* Buy Now Button */}
          {buyNowEnabled && (
            <button
              className="w-full h-10 sm:h-12 lg:h-14 border border-blue-600 rounded bg-white flex items-center justify-center cursor-pointer text-xs sm:text-sm lg:text-base font-medium text-blue-600 gap-1.5 sm:gap-2 transition-all duration-300 leading-6 hover:bg-gray-50"
              onClick={(e) => {
                e.preventDefault();
                onBuyNow?.();
              }}
            >
              Buy Now
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.6676 6.00004V4.00004C10.6676 2.52728 9.47366 1.33337 8.0009 1.33337C6.52814 1.33337 5.33423 2.52728 5.33423 4.00004V6.00004M2.39557 6.90135L1.99557 11.168C1.88183 12.3812 1.82497 12.9877 2.02626 13.4562C2.2031 13.8678 2.51298 14.2081 2.90624 14.4226C3.35391 14.6667 3.96314 14.6667 5.1816 14.6667H10.8202C12.0387 14.6667 12.6479 14.6667 13.0956 14.4226C13.4888 14.2081 13.7987 13.8678 13.9755 13.4562C14.1768 12.9877 14.12 12.3812 14.0062 11.168L13.6062 6.90135C13.5102 5.87694 13.4622 5.36473 13.2318 4.97748C13.0289 4.63643 12.7291 4.36345 12.3706 4.19327C11.9636 4.00004 11.4491 4.00004 10.4202 4.00004L5.5816 4.00004C4.55269 4.00004 4.03824 4.00004 3.63118 4.19327C3.27267 4.36345 2.9729 4.63643 2.77 4.97748C2.53962 5.36473 2.4916 5.87694 2.39557 6.90135Z"
                  stroke="#3465F0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
