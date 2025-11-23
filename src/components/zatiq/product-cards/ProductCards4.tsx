import React, { useState } from "react";

interface ProductCards4Props {
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

const ProductCards4: React.FC<ProductCards4Props> = ({
  title = "Product Title",
  subtitle,
  price,
  comparePrice,
  currency = "BDT",
  image = "assets/card/p-4.png",
  hoverImage,
  badge,
  badgeColor = "#2EC1AC",
  quickAddEnabled = true,
  buyNowEnabled = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="font-poppins flex gap-6 justify-center p-1">
      <div
        className="w-[282px] h-[481px] bg-gray-100 rounded-lg overflow-hidden relative cursor-pointer transition-all duration-300 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top - Image Container */}
        <div className="w-[282px] h-[297px] relative bg-white overflow-hidden">
          <img
            src={isHovered && hoverImage ? hoverImage : image}
            alt={title}
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />
          {/* Badge */}
          {badge && (
            <div
              className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center z-10"
              style={{ backgroundColor: badgeColor }}
            >
              <span className="text-white text-xs font-medium leading-[150%] text-center">
                {badge}
              </span>
            </div>
          )}
        </div>

        {/* Bottom - Content Area */}
        <div className="p-4 h-[184px] flex flex-col bg-[#F4F5F7]">
          {/* Title */}
          <h3 className="text-xl font-semibold text-[#3A3A3A] leading-[120%] mb-2 line-clamp-2 overflow-hidden">
            {title}
          </h3>

          {/* Description/Subtitle */}
          {subtitle && (
            <p className="text-sm text-[#898989] leading-[150%] mb-3 line-clamp-2 overflow-hidden">
              {subtitle}
            </p>
          )}

          {/* Price */}
          {price !== undefined && (
            <div className="mt-auto">
              <span className="text-xl font-semibold text-[#F55157] leading-[150%]">
                {currency} {price.toLocaleString()}
              </span>
              {comparePrice && (
                <span className="text-sm text-[#9CA3AF] line-through ml-2 font-normal">
                  {currency} {comparePrice.toLocaleString()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Full Card Hover Overlay with Buttons */}
        <div
          className={`absolute top-0 left-0 w-full h-full bg-gray-500/60 flex flex-col items-center justify-center gap-3 px-[18px] rounded-lg z-5 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Add to Cart Button */}
          {quickAddEnabled && (
            <button className="w-full h-14 border border-[#3B82F6] rounded bg-white flex items-center justify-center cursor-pointer text-base font-medium text-[#3B82F6] transition-all duration-300 leading-6 hover:bg-blue-50">
              Add to Cart
            </button>
          )}

          {/* Buy Now Button */}
          {buyNowEnabled && (
            <button className="w-full h-14 border border-[#3B82F6] rounded bg-white flex items-center justify-center cursor-pointer text-base font-medium text-[#3B82F6] transition-all duration-300 leading-6 hover:bg-gray-50">
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCards4;
