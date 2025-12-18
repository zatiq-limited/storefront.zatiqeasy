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
  buttonBgColor?: string;
  buttonTextColor?: string;
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
  buttonBgColor = "#3B82F6",
  buttonTextColor = "#FFFFFF",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="font-poppins w-full h-full">
      <div
        className="w-full h-full bg-gray-100 rounded-lg overflow-hidden relative cursor-pointer transition-all duration-300 hover:shadow-lg flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top - Image Container */}
        <div className="w-full aspect-square relative bg-white overflow-hidden">
          <img
            src={isHovered && hoverImage ? hoverImage : image}
            alt={title}
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />
          {/* Badge */}
          {badge && (
            <div
              className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 w-10 h-10 lg:w-14 lg:h-14 p-0.5 rounded-full flex items-center justify-center z-10"
              style={{ backgroundColor: badgeColor }}
            >
              <span className="text-white text-[10px] sm:text-xs font-medium leading-[150%] text-center">
                {badge}
              </span>
            </div>
          )}
        </div>

        {/* Bottom - Content Area */}
        <div className="p-2.5 sm:p-3 lg:p-4 flex flex-col flex-1 bg-[#F4F5F7]">
          {/* Title */}
          <h3 className="text-sm sm:text-base lg:text-xl font-semibold text-[#3A3A3A] leading-[120%] mb-1 sm:mb-2 line-clamp-2 overflow-hidden">
            {title}
          </h3>

          {/* Description/Subtitle */}
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#898989] leading-[150%] mb-2 sm:mb-3 line-clamp-2 overflow-hidden">
              {subtitle}
            </p>
          )}

          {/* Price and Mobile Actions Row */}
          {price !== undefined && (
            <div className="mt-auto flex items-center justify-between gap-2">
              <div>
                <span className="text-sm sm:text-base lg:text-xl font-semibold text-[#F55157] leading-[150%]">
                  {currency} {price.toLocaleString()}
                </span>
                {comparePrice && (
                  <span className="text-[10px] sm:text-xs lg:text-sm text-[#9CA3AF] line-through ml-1 sm:ml-2 font-normal">
                    {currency} {comparePrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Mobile Icon Buttons - Always visible on mobile */}
              {(quickAddEnabled || buyNowEnabled) && (
                <div className="flex sm:hidden gap-1.5">
                  {quickAddEnabled && (
                    <button className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 shadow-md">
                      <svg
                        className="w-4 h-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
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
                  {buyNowEnabled && (
                    <button className="w-8 h-8 rounded-full bg-[#F55157] flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 shadow-md">
                      <svg
                        className="w-4 h-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
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
              )}
            </div>
          )}
        </div>

        {/* Desktop Hover Overlay with Buttons - Hidden on mobile */}
        <div
          className={`absolute top-0 left-0 w-full h-full bg-gray-500/60 hidden sm:flex flex-col items-center justify-center gap-3 px-4 lg:px-[18px] rounded-lg z-5 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Add to Cart Button */}
          {quickAddEnabled && (
            <button
              className="w-full h-14 border border-[#3B82F6] rounded flex items-center justify-center cursor-pointer text-base font-medium transition-all duration-300 leading-6 hover:opacity-90"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              Add to Cart
            </button>
          )}

          {/* Buy Now Button */}
          {buyNowEnabled && (
            <button className="w-full h-12 lg:h-14 border border-[#3B82F6] rounded bg-white flex items-center justify-center cursor-pointer text-sm lg:text-base font-medium text-[#3B82F6] transition-all duration-300 leading-6 hover:bg-gray-50">
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCards4;
