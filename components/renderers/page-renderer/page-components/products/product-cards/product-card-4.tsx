/**
 * ========================================
 * PRODUCT CARD 4 - HOVER OVERLAY DESIGN
 * ========================================
 *
 * Card with hover overlay showing action buttons
 */

"use client";

import { useState, useEffect } from "react";
import { FallbackImage } from "@/components/ui/fallback-image";
import Link from "next/link";
import type { ProductCardProps } from "./index";

export default function ProductCard4({
  handle,
  title,
  subtitle,
  price,
  comparePrice,
  currency = "৳",
  image,
  hoverImage,
  badge,
  badgeColor = "#2EC1AC",
  quickAddEnabled = true,
  buyNowEnabled = true,
  buttonBgColor = "#3B82F6",
  buttonTextColor = "#FFFFFF",
  priceColor = "#F55157",
  oldPriceColor = "#9CA3AF",
  onAddToCart,
  onBuyNow,
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
    if (e.key === "Enter") e.currentTarget.blur();
  };

  const discount =
    comparePrice && comparePrice > price
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : null;

  const displayBadge = badge || (discount ? `-${discount}%` : null);

  return (
    <Link
      href={`/products/${handle}`}
      className="block w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden relative cursor-pointer transition-all duration-300 hover:shadow-lg flex flex-col">
        {/* Image Container */}
        <div className="w-full aspect-square relative bg-white overflow-hidden">
          <FallbackImage
            src={isHovered && hoverImage ? hoverImage : image}
            alt={title}
            fill
            className="object-cover object-top transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Badge - Show Out of Stock badge if product is out of stock, otherwise show regular badge */}
          {isOutOfStock ? (
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 p-0.5 rounded-full flex items-center justify-center z-10 bg-gray-600">
              <span className="text-white text-[10px] sm:text-xs font-medium leading-tight text-center">
                Out of Stock
              </span>
            </div>
          ) : (
            displayBadge && (
              <div
                className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 p-0.5 rounded-full flex items-center justify-center z-10"
                style={{ backgroundColor: badgeColor }}
              >
                <span className="text-white text-[10px] sm:text-xs font-medium leading-tight text-center">
                  {displayBadge}
                </span>
              </div>
            )
          )}

          {/* Hover Overlay with Buttons */}
          <div
            className={`absolute inset-0 bg-gray-500/60 flex flex-col items-center justify-center gap-3 px-4 rounded-lg z-20 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Add to Cart Button or Quantity Controls */}
            {quickAddEnabled && (
              <>
                {isOutOfStock ? (
                  <button
                    className="w-full h-11 lg:h-14 border border-blue-600 rounded flex items-center justify-center text-sm lg:text-base font-medium transition-all duration-300 leading-6 cursor-not-allowed opacity-60"
                    style={{ backgroundColor: "#E5E7EB", color: "#6B7280" }}
                    disabled
                  >
                    Out of Stock
                  </button>
                ) : isInCart ? (
                  <div
                    className="w-full h-11 lg:h-14 border rounded flex items-center justify-between overflow-hidden"
                    style={{ borderColor: buttonBgColor }}
                  >
                    <button
                      className="h-full px-3 sm:px-4 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      style={{ color: buttonBgColor }}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDecrement?.(); }}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /></svg>
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={inputValue}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      onKeyDown={handleInputKeyDown}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (hasVariants) onIncrement?.(); }}
                      className="w-12 sm:w-16 text-center text-sm sm:text-base font-medium bg-transparent focus:outline-none text-gray-900"
                      readOnly={hasVariants}
                    />
                    <button
                      className="h-full px-3 sm:px-4 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      style={{ color: buttonBgColor }}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onIncrement?.(); }}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                    </button>
                  </div>
                ) : (
                  <button
                    className="w-full h-11 lg:h-14 border border-blue-600 rounded flex items-center justify-center text-sm lg:text-base font-medium transition-all duration-300 leading-6 cursor-pointer hover:opacity-90"
                    style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                    onClick={(e) => {
                      e.preventDefault();
                      onAddToCart?.();
                    }}
                  >
                    Add to Cart
                  </button>
                )}
              </>
            )}

            {/* Buy Now Button */}
            {buyNowEnabled && !isOutOfStock && !isInCart && (
              <button
                className="w-full h-11 lg:h-14 border border-blue-600 rounded bg-white flex items-center justify-center cursor-pointer text-sm lg:text-base font-medium text-blue-600 transition-all duration-300 leading-6 hover:bg-gray-50"
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
        <div className="p-2.5 sm:p-3 lg:p-4 flex flex-col flex-1 bg-gray-100">
          {/* Title */}
          <h3 className="text-sm sm:text-base lg:text-xl font-semibold text-gray-800 leading-tight mb-1 sm:mb-2 line-clamp-2 overflow-hidden">
            {title}
          </h3>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-2 sm:mb-3 line-clamp-2 overflow-hidden">
              {subtitle}
            </p>
          )}

          {/* Price */}
          <div className="mt-auto">
            <span
              className="text-sm sm:text-base lg:text-xl font-semibold leading-relaxed"
              style={{ color: priceColor }}
            >
              {currency} {price.toLocaleString()}
            </span>
            {comparePrice && (
              <span
                className="text-[10px] sm:text-xs lg:text-sm line-through ml-1 sm:ml-2 font-normal"
                style={{ color: oldPriceColor }}
              >
                {currency} {comparePrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Mobile Icon Buttons */}
        <div className="absolute bottom-2 right-2 flex gap-1.5 z-10 sm:hidden">
          {quickAddEnabled && (
            <>
              {isOutOfStock ? (
                <button
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-not-allowed opacity-60"
                  style={{ backgroundColor: "#E5E7EB", color: "#6B7280" }}
                  disabled
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17M17 17C15.895 17 15 17.895 15 19C15 20.105 15.895 21 17 21C18.105 21 19 20.105 19 19C19 17.895 18.105 17 17 17ZM9 19C9 20.105 8.105 21 7 21C5.895 21 5 20.105 5 19C5 17.895 5.895 17 7 17C8.105 17 9 17.895 9 19Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ) : isInCart ? (
                <div className="flex gap-1">
                  <button
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer active:scale-95"
                    style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDecrement?.(); }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /></svg>
                  </button>
                  <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-xs font-medium text-gray-900 shadow-lg">
                    {cartQuantity}
                  </span>
                  <button
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer active:scale-95"
                    style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onIncrement?.(); }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                  </button>
                </div>
              ) : (
                <button
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer active:scale-95"
                  style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToCart?.();
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17M17 17C15.895 17 15 17.895 15 19C15 20.105 15.895 21 17 21C18.105 21 19 20.105 19 19C19 17.895 18.105 17 17 17ZM9 19C9 20.105 8.105 21 7 21C5.895 21 5 20.105 5 19C5 17.895 5.895 17 7 17C8.105 17 9 17.895 9 19Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </>
          )}
          {buyNowEnabled && !isOutOfStock && !isInCart && (
            <button
              className="w-7 h-7 rounded-full bg-white border border-blue-600 flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 shadow-lg"
              onClick={(e) => {
                e.preventDefault();
                onBuyNow?.();
              }}
            >
              <svg
                className="w-4 h-4 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M16 11V7C16 4.791 14.209 3 12 3C9.791 3 8 4.791 8 7V11M5 9H19L20 21H4L5 9Z"
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
    </Link>
  );
}
