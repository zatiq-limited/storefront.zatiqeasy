import React, { useState } from "react";

interface ProductCards5Props {
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

const ProductCards5: React.FC<ProductCards5Props> = ({
  title,
  price,
  comparePrice,
  currency,
  image,
  hoverImage,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="font-roboto w-full h-full">
      <div
        className="w-full h-full overflow-hidden relative cursor-pointer transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top - Image Container */}
        <div className="w-full aspect-282/450 relative overflow-hidden">
          <img
            src={isHovered && hoverImage ? hoverImage : image}
            alt={title}
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />
          {/* Badge */}
          {comparePrice && price && (
            <div
              className="absolute top-2 right-2 sm:top-3 sm:right-3 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center bg-[#ef4444]"
            >
              <span className="text-white text-[10px] sm:text-xs lg:text-base font-normal leading-[150%]">
                {comparePrice && price ? - ((comparePrice - price) / comparePrice * 100).toFixed(0) + "%" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Bottom - Content Area */}
        <div className="pt-2 sm:pt-3 flex flex-col justify-center">
          {/* Title */}
          <h3 className="text-[10px] sm:text-xs lg:text-sm font-normal text-[#212121] mb-0.5 sm:mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {title}
          </h3>

          {/* Prices */}
          {price !== undefined && (
            <div className="pt-1 sm:pt-1.5 flex items-center flex-wrap gap-1 sm:gap-1.5">
              <span className="text-xs sm:text-sm lg:text-base font-bold text-[#212121]">
                {currency} {price.toLocaleString()}
              </span>
              {comparePrice && (
                <span className="text-[10px] sm:text-xs lg:text-sm text-[#9C9B9B] line-through font-normal">
                  {comparePrice.toLocaleString()} {currency}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCards5;
