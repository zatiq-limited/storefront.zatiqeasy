import React, { useState } from "react";

interface ProductCards7Props {
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

const ProductCards7: React.FC<ProductCards7Props> = ({
  title,
  price,
  comparePrice,
  currency,
  image,
  hoverImage,
  colors = [],
  quickAddEnabled = true,
  buttonBgColor = "#3B82F6",
  buttonTextColor = "#FFFFFF",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  return (
    <div className="font-sans w-full h-full">
      <div
        className="w-full h-full overflow-visible relative cursor-pointer transition-all duration-300 flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top - Image Container */}
        <div className="w-full aspect-282/306 relative mb-2 sm:mb-3 lg:mb-4 overflow-hidden">
          <img
            src={isHovered && hoverImage ? hoverImage : image}
            alt={title}
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />
          {/* Badge */}
          {comparePrice && price && (
            <div
              className="absolute top-2 left-2 sm:top-3 sm:left-3 lg:top-4 lg:left-4 text-white px-1.5 py-0.5 sm:px-2 sm:py-0.5 lg:px-2.5 lg:py-1 rounded text-[10px] sm:text-xs font-medium leading-4 bg-[#ef4444]"
            >
              {comparePrice && price ? - ((comparePrice - price) / comparePrice * 100).toFixed(0) + "%" : ""}
            </div>
          )}
        </div>

        {/* Bottom - Content Area */}
        <div className="flex flex-col flex-1">
          {/* Color Options */}
          {colors.length > 0 && (
            <div className="flex gap-1.5 sm:gap-2 mb-2 sm:mb-3 lg:mb-4">
              {colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(index)}
                  className={`relative w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                    selectedColor === index ? "" : ""
                  }`}
                >
                  <div
                    className={`rounded-full transition-all duration-200 ${
                      selectedColor === index ? "w-3 h-3 sm:w-4 sm:h-4" : "w-5 h-5 sm:w-6 sm:h-6"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                  {selectedColor === index && (
                    <div className="absolute inset-0 rounded-full border border-[#6B7280]" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-medium text-[#181D25] leading-5 mb-1 sm:mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Prices */}
          {price !== undefined && (
            <div className="flex items-center flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3 lg:mb-4">
              <span className="text-xs sm:text-sm lg:text-base font-semibold text-[#181D25] leading-6">
                {currency} {price.toLocaleString()}
              </span>
              {comparePrice && (
                <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-[#9CA3AF] line-through leading-5">
                  {currency} {comparePrice.toLocaleString()}
                </span>
              )}
            </div>
          )}

          {/* Add to Cart Button */}
          {quickAddEnabled && (
            <button
              className="w-full h-11 border-none rounded-3xl text-sm font-medium cursor-pointer transition-all duration-300 hover:opacity-90"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCards7;
