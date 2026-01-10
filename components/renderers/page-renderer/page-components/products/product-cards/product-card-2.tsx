/**
 * ========================================
 * PRODUCT CARD 2 - FILLED BUTTON DESIGN
 * ========================================
 *
 * Card with filled colored add to cart button
 */

"use client";

import { useState, useEffect } from "react";
import { FallbackImage } from "@/components/ui/fallback-image";
import Link from "next/link";
import type { ProductCardProps } from "./index";

export default function ProductCard2({
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
  buttonBgColor = "#3B82F6",
  buttonTextColor = "#FFFFFF",
  priceColor = "#F55157",
  oldPriceColor = "#A5A5A5",
  onAddToCart,
  isOutOfStock = false,
  cartQuantity = 0,
  hasVariants = false,
  onIncrement,
  onDecrement,
  onQuantityChange,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState(cartQuantity.toString());

  useEffect(() => {
    setInputValue(cartQuantity.toString());
  }, [cartQuantity]);

  const isInCart = cartQuantity > 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const newQty = parseInt(inputValue, 10);
    if (!isNaN(newQty) && newQty !== cartQuantity) {
      if (hasVariants) {
        onIncrement?.();
      } else {
        onQuantityChange?.(newQty);
      }
    }
    setInputValue(cartQuantity.toString());
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const discount =
    comparePrice && comparePrice > price
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : null;

  const displayBadge = badge || (discount ? `${discount}% OFF` : null);

  return (
    <Link
      href={`/products/${handle}`}
      className="block w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-full bg-white overflow-hidden relative cursor-pointer transition-all duration-300 rounded shadow-[0_0_0_1px_#E5E7EB] hover:shadow-lg flex flex-col">
        {/* Image Container */}
        <div className="w-full aspect-square relative bg-purple-50 overflow-hidden">
          <FallbackImage
            src={isHovered && hoverImage ? hoverImage : image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Badge - Show Out of Stock badge if product is out of stock, otherwise show regular badge */}
          {isOutOfStock ? (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 lg:top-4 lg:left-4 bg-gray-600 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 lg:px-3 rounded text-[10px] sm:text-xs lg:text-sm font-normal">
              Out of Stock
            </div>
          ) : (
            displayBadge && (
              <div
                className="absolute top-2 left-2 sm:top-3 sm:left-3 lg:top-4 lg:left-4 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 lg:px-3 rounded text-[10px] sm:text-xs lg:text-sm font-normal"
                style={{ backgroundColor: badgeColor }}
              >
                {displayBadge}
              </div>
            )
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
          <h3 className="text-xs sm:text-sm lg:text-base font-medium text-gray-800 mb-0.5 sm:mb-1 line-clamp-2 overflow-hidden leading-tight">
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

          {/* Add to Cart Button or Quantity Controls */}
          {quickAddEnabled && (
            <>
              {isOutOfStock ? (
                <button
                  className="w-full h-9 sm:h-11 lg:h-14 border-none rounded flex items-center justify-center text-xs sm:text-sm lg:text-base font-medium gap-2 transition-all duration-300 leading-6 mt-auto cursor-not-allowed opacity-60"
                  style={{ backgroundColor: "#E5E7EB", color: "#6B7280" }}
                  disabled
                >
                  Out of Stock
                </button>
              ) : isInCart ? (
                <div
                  className="w-full h-9 sm:h-11 lg:h-14 border rounded flex items-center justify-between mt-auto overflow-hidden"
                  style={{ borderColor: buttonBgColor }}
                >
                  <button
                    className="h-full px-3 sm:px-4 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    style={{ color: buttonBgColor }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDecrement?.();
                    }}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={handleInputKeyDown}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (hasVariants) onIncrement?.();
                    }}
                    className="w-12 sm:w-16 text-center text-sm sm:text-base font-medium bg-transparent focus:outline-none text-gray-900"
                    readOnly={hasVariants}
                  />
                  <button
                    className="h-full px-3 sm:px-4 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    style={{ color: buttonBgColor }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onIncrement?.();
                    }}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  className="w-full h-9 sm:h-11 lg:h-14 border-none rounded flex items-center justify-center text-xs sm:text-sm lg:text-base font-medium gap-2 transition-all duration-300 leading-6 mt-auto cursor-pointer hover:opacity-90"
                  style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToCart?.();
                  }}
                >
                  Add to Cart
                  <svg
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2.34893 3.34184C2.33899 3.23182 2.35207 3.12094 2.38735 3.01626C2.42263 2.91158 2.47933 2.81539 2.55383 2.73384C2.62833 2.65228 2.71901 2.58713 2.82008 2.54255C2.92115 2.49798 3.0304 2.47494 3.14086 2.47491H12.7827C12.9018 2.47497 13.0193 2.50176 13.1267 2.55331C13.234 2.60487 13.3284 2.67987 13.4029 2.77279C13.4774 2.8657 13.53 2.97416 13.557 3.09015C13.584 3.20615 13.5845 3.32671 13.5587 3.44296L12.744 7.11516C12.6039 7.74622 12.2527 8.31061 11.7484 8.71509C11.2442 9.11958 10.617 9.33996 9.97057 9.33984H5.48598C4.77686 9.33988 4.09337 9.07468 3.56985 8.59637C3.04634 8.11806 2.72066 7.46123 2.65684 6.75498L2.34893 3.34184Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 0.568101C0 0.417431 0.0598533 0.272932 0.166393 0.166393C0.272932 0.0598534 0.417431 0 0.568101 0H2.561C2.69996 0.00014086 2.83405 0.0512097 2.9379 0.143544C3.04175 0.235878 3.10816 0.363074 3.12455 0.501065L3.58131 4.36528C3.59893 4.51505 3.55635 4.66568 3.46291 4.78405C3.36948 4.90242 3.23285 4.97882 3.08308 4.99644C2.93332 5.01407 2.78268 4.97148 2.66432 4.87805C2.54595 4.78461 2.46955 4.64799 2.45192 4.49822L2.05539 1.13506H0.568101C0.417431 1.13506 0.272932 1.07521 0.166393 0.968672C0.0598533 0.862132 0 0.71877 0 0.568101ZM5.1129 12.3085C5.26357 12.3085 5.40807 12.2486 5.51461 12.1421C5.62115 12.0355 5.68101 11.891 5.68101 11.7404C5.68101 11.5897 5.62115 11.4452 5.51461 11.3387C5.40807 11.2321 5.26357 11.1723 5.1129 11.1723C4.96223 11.1723 4.81774 11.2321 4.7112 11.3387C4.60466 11.4452 4.5448 11.5897 4.5448 11.7404C4.5448 11.891 4.60466 12.0355 4.7112 12.1421C4.81774 12.2486 4.96223 12.3085 5.1129 12.3085ZM10.2963 12.3085C10.4469 12.3085 10.5914 12.2486 10.698 12.1421C10.8045 12.0355 10.8644 11.891 10.8644 11.7404C10.8644 11.5897 10.8045 11.4452 10.698 11.3387C10.5914 11.2321 10.4469 11.1723 10.2963 11.1723C10.1456 11.1723 10.0011 11.2321 9.89455 11.3387C9.78801 11.4452 9.72815 11.5897 9.72815 11.7404C9.72815 11.891 9.78801 12.0355 9.89455 12.1421C10.0011 12.2486 10.1456 12.3085 10.2963 12.3085Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
