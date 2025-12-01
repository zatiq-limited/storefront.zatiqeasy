import React, { useState } from "react";
import { Plus, ShoppingBag, Zap } from "lucide-react";

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
  quickAddEnabled = true,
  buyNowEnabled = true,
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
            <div className="pt-1 sm:pt-1.5 flex items-center justify-between gap-1 sm:gap-1.5">
              <div className="flex items-center flex-wrap gap-1 sm:gap-1.5">
                <span className="text-xs sm:text-sm lg:text-base font-bold text-[#212121]">
                  {currency} {price.toLocaleString()}
                </span>
                {comparePrice && (
                  <span className="text-[10px] sm:text-xs lg:text-sm text-[#9C9B9B] line-through font-normal">
                    {comparePrice.toLocaleString()} {currency}
                  </span>
                )}
              </div>

              {/* Mobile Icon Buttons - Always visible on mobile */}
              {(quickAddEnabled || buyNowEnabled) && (
                <div className="flex sm:hidden gap-1.5">
                  {quickAddEnabled && (
                    <button className="group/btn w-8 h-8 rounded-lg bg-muted-foreground/10 flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 hover:bg-black">
                      <Plus className="w-4 h-4 text-foreground transition-transform duration-200 group-hover/btn:scale-110" strokeWidth={1.75} />
                    </button>
                  )}
                  {buyNowEnabled && (
                    <button className="group/btn w-8 h-8 rounded-lg bg-[#ef4444]/90 flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 hover:bg-[#dc2626]">
                      <ShoppingBag className="w-4 h-4 text-white transition-transform duration-200 group-hover/btn:scale-110" strokeWidth={1.75} />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Hover Overlay with Buttons - Hidden on mobile */}
        <div
          className={`absolute top-0 left-0 w-full h-full bg-black/40 hidden sm:flex flex-col items-center justify-center gap-3 px-4 lg:px-[18px] z-5 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Add to Cart Button */}
          {quickAddEnabled && (
            <button className="w-full h-11 lg:h-12 rounded bg-white flex items-center justify-center cursor-pointer text-sm font-medium text-[#212121] transition-all duration-300 leading-5 hover:bg-gray-100">
              Add to Cart
            </button>
          )}

          {/* Buy Now Button */}
          {buyNowEnabled && (
            <button className="w-full h-11 lg:h-12 rounded bg-[#ef4444] flex items-center justify-center cursor-pointer text-sm font-medium text-white transition-all duration-300 leading-5 hover:bg-[#dc2626]">
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCards5;
