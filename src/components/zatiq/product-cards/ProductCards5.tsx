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
    <div className="font-roboto flex gap-6 justify-center p-1">
      <div
        className="w-[282px] h-[513px] overflow-hidden relative cursor-pointer transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top - Image Container */}
        <div className="w-[282px] h-[450px] relative overflow-hidden">
          <img
            src={isHovered && hoverImage ? hoverImage : image}
            alt={title}
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />
          {/* Badge */}
          {comparePrice && price && (
            <div
              className="absolute top-3 right-3 w-12 h-12 rounded-full flex items-center justify-center bg-[#ef4444]"
            >
              <span className="text-white text-base font-normal leading-[150%]">
                {comparePrice && price ? - ((comparePrice - price) / comparePrice * 100).toFixed(0) + "%" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Bottom - Content Area */}
        <div className="pt-3 flex flex-col justify-center">
          {/* Title */}
          <h3 className="text-xs font-normal text-[#212121] mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {title}
          </h3>

          {/* Prices */}
          {price !== undefined && (
            <div className="pt-1.5 flex items-center gap-1.5">
              <span className="text-sm font-bold text-[#212121]">
                {currency} {price.toLocaleString()}
              </span>
              {comparePrice && (
                <span className="text-sm text-[#9C9B9B] line-through font-normal">
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
