/**
 * ProductCard9 - Classic with Badge and Dual Buttons
 * Desktop classes from merchant panel with responsive prefixes
 */

"use client";

import { useState, useEffect } from "react";
import { FallbackImage } from "@/components/ui/fallback-image";
import Link from "next/link";
import type { ProductCardProps } from "./index";

export default function ProductCard9({
  handle,
  title,
  vendor,
  price,
  comparePrice,
  currency = "BDT",
  image,
  badge,
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

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
      <Link href={`/products/${handle}`} className="block">
        {/* Image Container */}
        <div className="relative h-[140px] sm:h-[200px] lg:h-[228px]">
          <FallbackImage
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Badge - Show Out of Stock badge if product is out of stock, otherwise show regular badge */}
          {isOutOfStock ? (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs bg-gray-600 text-white rounded font-medium">
              Out of Stock
            </div>
          ) : (
            badge && (
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs bg-[#F55157] text-white rounded font-medium">
                {badge}
              </div>
            )
          )}
          {/* Mobile Icon Buttons */}
          <div className="absolute bottom-2 right-2 flex gap-1.5 sm:hidden">
            {quickAddEnabled && (
              <button
                className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-opacity ${
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
                <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14 1.72667H2.47333V1.54C2.41111 1.10444 2.21667 0.738889 1.89 0.443334C1.56333 0.147778 1.16667 0 0.7 0H0V1.16667H0.7C0.855556 1.16667 0.987778 1.21333 1.09667 1.30667C1.20556 1.4 1.27556 1.52444 1.30667 1.68L2.24 9.52C2.27111 9.98667 2.45 10.36 2.77667 10.64C3.10333 10.92 3.5 11.0756 3.96667 11.1067H11.6667V9.89333H3.96667C3.81111 9.89333 3.67889 9.84667 3.57 9.75333C3.46111 9.66 3.39111 9.53556 3.36 9.38L3.31333 8.72667H12.74L14 1.72667ZM11.76 7.56H3.17333L2.61333 2.89333H12.6L11.76 7.56ZM2.94 12.8333C2.90889 13.1444 3.01 13.4167 3.24333 13.65C3.47667 13.8833 3.75667 14 4.08333 14C4.41 14 4.68222 13.8833 4.9 13.65C5.11778 13.4167 5.23444 13.1444 5.25 12.8333C5.26556 12.5222 5.15667 12.25 4.92333 12.0167C4.69 11.7833 4.41 11.6667 4.08333 11.6667C3.75667 11.6667 3.48444 11.7833 3.26667 12.0167C3.04889 12.25 2.94 12.5222 2.94 12.8333ZM8.77333 12.8333C8.74222 13.1444 8.84333 13.4167 9.07667 13.65C9.31 13.8833 9.59 14 9.91667 14C10.2433 14 10.5156 13.8833 10.7333 13.65C10.9511 13.4167 11.0678 13.1444 11.0833 12.8333C11.0989 12.5222 10.99 12.25 10.7567 12.0167C10.5233 11.7833 10.2433 11.6667 9.91667 11.6667C9.59 11.6667 9.31778 11.7833 9.1 12.0167C8.88222 12.25 8.77333 12.5222 8.77333 12.8333Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            )}
            {buyNowEnabled && !isOutOfStock && (
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart?.();
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
          {/* Vendor */}
          {vendor && (
            <div className="text-[10px] sm:text-xs text-[#3465F0] font-medium mb-1">
              {vendor}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-medium text-[#181D25] mb-1 line-clamp-2">
            {title}
          </h3>

          {/* Prices */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-sm sm:text-base font-semibold"
              style={{ color: priceColor }}
            >
              {currency} {price.toLocaleString()}
            </span>
            {comparePrice && (
              <span
                className="text-[10px] sm:text-xs line-through"
                style={{ color: oldPriceColor }}
              >
                {currency} {comparePrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden sm:flex gap-2">
            {quickAddEnabled && (
              <>
                {isOutOfStock ? (
                  <button
                    className="flex-1 h-9 lg:h-10 text-xs lg:text-sm rounded font-medium cursor-not-allowed opacity-60"
                    style={{ backgroundColor: "#E5E7EB", color: "#6B7280" }}
                    disabled
                  >
                    Out of Stock
                  </button>
                ) : isInCart ? (
                  <div
                    className="flex-1 h-9 lg:h-10 border rounded flex items-center justify-between overflow-hidden"
                    style={{ borderColor: buttonBgColor }}
                  >
                    <button
                      className="h-full px-3 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      style={{ color: buttonBgColor }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDecrement?.();
                      }}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                      className="w-12 text-center text-sm font-medium bg-transparent focus:outline-none text-gray-900"
                      readOnly={hasVariants}
                    />
                    <button
                      className="h-full px-3 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      style={{ color: buttonBgColor }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onIncrement?.();
                      }}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    className="flex-1 h-9 lg:h-10 text-xs lg:text-sm rounded font-medium transition-opacity hover:opacity-90"
                    style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                    onClick={(e) => {
                      e.preventDefault();
                      onAddToCart?.();
                    }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M14 1.72667H2.47333V1.54C2.41111 1.10444 2.21667 0.738889 1.89 0.443334C1.56333 0.147778 1.16667 0 0.7 0H0V1.16667H0.7C0.855556 1.16667 0.987778 1.21333 1.09667 1.30667C1.20556 1.4 1.27556 1.52444 1.30667 1.68L2.24 9.52C2.27111 9.98667 2.45 10.36 2.77667 10.64C3.10333 10.92 3.5 11.0756 3.96667 11.1067H11.6667V9.89333H3.96667C3.81111 9.89333 3.67889 9.84667 3.57 9.75333C3.46111 9.66 3.39111 9.53556 3.36 9.38L3.31333 8.72667H12.74L14 1.72667ZM11.76 7.56H3.17333L2.61333 2.89333H12.6L11.76 7.56ZM2.94 12.8333C2.90889 13.1444 3.01 13.4167 3.24333 13.65C3.47667 13.8833 3.75667 14 4.08333 14C4.41 14 4.68222 13.8833 4.9 13.65C5.11778 13.4167 5.23444 13.1444 5.25 12.8333C5.26556 12.5222 5.15667 12.25 4.92333 12.0167C4.69 11.7833 4.41 11.6667 4.08333 11.6667C3.75667 11.6667 3.48444 11.7833 3.26667 12.0167C3.04889 12.25 2.94 12.5222 2.94 12.8333ZM8.77333 12.8333C8.74222 13.1444 8.84333 13.4167 9.07667 13.65C9.31 13.8833 9.59 14 9.91667 14C10.2433 14 10.5156 13.8833 10.7333 13.65C10.9511 13.4167 11.0678 13.1444 11.0833 12.8333C11.0989 12.5222 10.99 12.25 10.7567 12.0167C10.5233 11.7833 10.2433 11.6667 9.91667 11.6667C9.59 11.6667 9.31778 11.7833 9.1 12.0167C8.88222 12.25 8.77333 12.5222 8.77333 12.8333Z"
                          fill="currentColor"
                        />
                      </svg>
                      Add to Cart
                    </span>
                  </button>
                )}
              </>
            )}
            {buyNowEnabled && !isOutOfStock && !isInCart && (
              <button
                className="flex-1 h-9 lg:h-10 text-xs lg:text-sm rounded font-medium border-2 transition-all hover:opacity-80"
                style={{ borderColor: buttonBgColor, color: buttonBgColor }}
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart?.();
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
