import React, { useState } from "react";

interface ProductCards6Props {
  id?: string | number;
  handle?: string;
  title?: string;
  subtitle?: string;
  vendor?: string;
  price?: number;
  comparePrice?: number | null;
  currency?: string;
  image?: string;
  hoverImage?: string;
  badge?: string;
  badgeColor?: string;
  rating?: number;
  reviewCount?: number;
  colors?: string[];
  sizes?: string[];
  quickAddEnabled?: boolean;
  buyNowEnabled?: boolean;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

const ProductCards6: React.FC<ProductCards6Props> = ({
  title,
  price,
  comparePrice,
  currency,
  image,
  hoverImage,
  rating = 0,
  reviewCount = 0,
  quickAddEnabled = true,
  buyNowEnabled = true,
  buttonBgColor = "#3B82F6",
  buttonTextColor = "#FFFFFF",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="font-poppins w-full h-full">
      <div
        className="w-full h-full overflow-hidden relative cursor-pointer transition-all duration-300 flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top - Image Container */}
        <div className="w-full aspect-282/350 relative bg-gray-100 overflow-hidden">
          <img
            src={isHovered && hoverImage ? hoverImage : image}
            alt={title}
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />
        </div>

        {/* Bottom - Content Area */}
        <div className="pt-2 sm:pt-3 flex flex-col flex-1">
          {/* Title */}
          <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-[#212121] leading-[147%] mb-1 sm:mb-2 overflow-hidden text-ellipsis whitespace-nowrap line-clamp-1">
            {title}
          </h3>

          {/* Prices */}
          {price !== undefined && (
            <div className="flex items-center flex-wrap gap-1 sm:gap-2 mb-1 sm:mb-2">
              {comparePrice && (
                <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-[#A2A2A2] line-through leading-5">
                  {currency} {comparePrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs sm:text-sm lg:text-base font-bold text-[#212121] leading-[147%]">
                {currency} {price.toLocaleString()}
              </span>
            </div>
          )}

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
              <span className="text-[10px] sm:text-xs font-normal text-[#9CA3AF] underline">
                {reviewCount} reviews
              </span>
            )}
          </div>

          {/* Mobile Buttons - Always visible on mobile */}
          {(quickAddEnabled || buyNowEnabled) && (
            <div className="flex sm:hidden gap-2 mt-2">
              {quickAddEnabled && (
                <button className="flex-1 h-9 rounded bg-[#3B82F6] flex items-center justify-center cursor-pointer text-xs font-medium text-white transition-all duration-300 active:scale-95">
                  Add to Cart
                </button>
              )}
              {buyNowEnabled && (
                <button className="flex-1 h-9 rounded border border-[#3B82F6] bg-white flex items-center justify-center cursor-pointer text-xs font-medium text-[#3B82F6] transition-all duration-300 active:scale-95">
                  Buy Now
                </button>
              )}
            </div>
          )}
        </div>

        {/* Desktop Hover Overlay with Buttons - Hidden on mobile */}
        <div
          className={`absolute top-0 left-0 w-full h-full bg-gray-500/60 hidden sm:flex flex-col items-center justify-center gap-3 px-4 lg:px-[18px] z-5 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Add to Cart Button */}
          {quickAddEnabled && (
            <button
              className="w-full h-14 rounded flex items-center justify-center cursor-pointer text-sm font-medium transition-all duration-300 leading-5 hover:opacity-90"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              Add to Cart
            </button>
          )}

          {/* Buy Now Button */}
          {buyNowEnabled && (
            <button className="w-full h-12 lg:h-14 rounded bg-white flex items-center justify-center cursor-pointer text-sm font-medium text-[#3B82F6] transition-all duration-300 leading-5 hover:bg-gray-50">
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCards6;
