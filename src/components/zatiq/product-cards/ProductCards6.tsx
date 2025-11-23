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
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="font-poppins flex gap-6 justify-center p-1">
      <div
        className="w-[282px] h-[450px] overflow-hidden relative cursor-pointer transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top - Image Container */}
        <div className="w-[282px] h-[350px] relative bg-gray-100 overflow-hidden">
          <img
            src={isHovered && hoverImage ? hoverImage : image}
            alt={title}
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />
        </div>

        {/* Bottom - Content Area */}
        <div className="pt-3 h-[100px] flex flex-col justify-between">
          {/* Title */}
          <h3 className="text-base font-semibold text-[#212121] leading-[147%] mb-2 overflow-hidden text-ellipsis whitespace-nowrap line-clamp-1">
            {title}
          </h3>

          {/* Prices */}
          {price !== undefined && (
            <div className="flex items-center gap-2 mb-2">
              {comparePrice && (
                <span className="text-sm font-semibold text-[#A2A2A2] line-through leading-5">
                  {currency} {comparePrice.toLocaleString()}
                </span>
              )}
              <span className="text-base font-bold text-[#212121] leading-[147%]">
                {currency} {price.toLocaleString()}
              </span>
            </div>
          )}

          {/* Rating and Reviews */}
          <div className="flex items-center gap-1.5">
            {/* Star Rating */}
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  width="18"
                  height="17"
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
              <span className="text-xs font-normal text-[#9CA3AF] underline">
                {reviewCount} reviews
              </span>
            )}
          </div>
        </div>

        {/* Full Card Hover Overlay with Buttons */}
        <div
          className={`absolute top-0 left-0 w-full h-full bg-gray-500/60 flex flex-col items-center justify-center gap-3 px-[18px] z-5 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Add to Cart Button */}
          {quickAddEnabled && (
            <button className="w-full h-14 rounded bg-white flex items-center justify-center cursor-pointer text-sm font-medium text-[#3B82F6] transition-all duration-300 leading-5 hover:bg-blue-50">
              Add to Cart
            </button>
          )}

          {/* Buy Now Button */}
          {buyNowEnabled && (
            <button className="w-full h-14 rounded bg-white flex items-center justify-center cursor-pointer text-sm font-medium text-[#3B82F6] transition-all duration-300 leading-5 hover:bg-gray-50">
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCards6;
