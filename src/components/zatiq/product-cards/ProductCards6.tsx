import React, { useState } from "react";

const ProductCards6: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const product = {
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=282&h=350&fit=crop&q=80",
    title: "Office Executive chair- Swivel",
    salePrice: "6800.00",
    originalPrice: "7500.00",
    rating: 3,
    reviews: 12,
  };

  return (
    <div className="font-poppins flex gap-6 justify-center">
      <div
        className="w-[282px] h-[450px] overflow-hidden relative cursor-pointer transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top - Image Container (350px) */}
        <div className="w-[282px] h-[350px] relative bg-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bottom - Content Area (100px) */}
        <div className="pt-3 h-[100px] flex flex-col justify-between">
          {/* Title */}
          <h3 className="text-base font-semibold text-[#212121] leading-[147%] mb-2 overflow-hidden text-ellipsis whitespace-nowrap line-clamp-1">
            {product.title}
          </h3>

          {/* Prices */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-[#A2A2A2] line-through leading-5">
              BDT {product.originalPrice}
            </span>
            <span className="text-base font-bold text-[#212121] leading-[147%]">
              BDT {product.salePrice}
            </span>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-1.5">
            {/* Star Rating */}
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  width="18"
                  height="17"
                  viewBox="0 0 18 17"
                  fill={star <= product.rating ? "#FDB022" : "#E5E7EB"}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.55859 0L11.2036 5.35942L17.1181 6.21885L12.8383 10.3906L13.8487 16.2812L8.55859 13.5L3.26853 16.2812L4.27884 10.3906L-0.000914574 6.21885L5.91356 5.35942L8.55859 0Z"
                    
                  />
                </svg>
              ))}
            </div>
            {/* Reviews Count */}
            <span className="text-xs font-normal text-[#9CA3AF] underline">
              {product.reviews} reviews
            </span>
          </div>
        </div>

        {/* Full Card Hover Overlay with Buttons */}
        {isHovered && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-500/60 flex flex-col items-center justify-center gap-3 px-[18px] z-5">
            {/* Add to Cart Button */}
            <button className="w-full h-14 rounded bg-white flex items-center justify-center cursor-pointer text-sm font-medium text-[#3B82F6] transition-all duration-300 leading-5 hover:bg-blue-50">
              Add to Cart
            </button>

            {/* Buy Now Button */}
            <button className="w-full h-14 rounded bg-white flex items-center justify-center cursor-pointer text-sm font-medium text-[#3B82F6] transition-all duration-300 leading-5 hover:bg-gray-50">
              Buy Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCards6;
