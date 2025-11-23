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
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  return (
    <div className="font-sans flex gap-6 justify-center p-1">
      <div
        className="w-[282px] h-[474px] overflow-visible relative cursor-pointer transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top - Image Container */}
        <div className="w-[282px] h-[306px] relative mb-4 overflow-hidden">
          <img
            src={isHovered && hoverImage ? hoverImage : image}
            alt={title}
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />
          {/* Badge */}
          {comparePrice && price && (
            <div
              className="absolute top-4 left-4 text-white px-2.5 py-1 rounded text-xs font-medium leading-4 bg-[#ef4444]"
            >
              {comparePrice && price ? - ((comparePrice - price) / comparePrice * 100).toFixed(0) + "%" : ""}
            </div>
          )}
        </div>

        {/* Bottom - Content Area */}
        <div className="flex flex-col">
          {/* Color Options */}
          {colors.length > 0 && (
            <div className="flex gap-2 mb-4">
              {colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(index)}
                  className={`relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                    selectedColor === index ? "" : ""
                  }`}
                >
                  <div
                    className={`rounded-full transition-all duration-200 ${
                      selectedColor === index ? "w-4 h-4" : "w-6 h-6"
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
          <h3 className="text-sm font-medium text-[#181D25] leading-5 mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Prices */}
          {price !== undefined && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base font-semibold text-[#181D25] leading-6">
                {currency} {price.toLocaleString()}
              </span>
              {comparePrice && (
                <span className="text-sm font-semibold text-[#9CA3AF] line-through leading-5">
                  {currency} {comparePrice.toLocaleString()}
                </span>
              )}
            </div>
          )}

          {/* Add to Cart Button */}
          {quickAddEnabled && (
            <button className="w-full h-11 border-none rounded-3xl bg-[#222934] text-white text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-[#1A202C]">
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCards7;
