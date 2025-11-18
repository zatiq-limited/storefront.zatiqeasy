import React, { useState } from "react";

const ProductCards4: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const product = {
    image:
      "assets/card/p-4.png",
    badge: "New",
    title: "Logitech F710 Wireless Gamepad",
    description: "Cut the cord and enjoy the freedom gaming without wires.",
    price: "500",
  };

  return (
    <div className="font-poppins flex gap-6 justify-center">
      <div
        className="w-[282px] h-[481px] bg-gray-100 rounded-lg overflow-hidden relative cursor-pointer transition-all duration-300 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top - Image Container (297px) */}
        <div className="w-[282px] h-[297px] relative bg-white">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {/* New Badge */}
          <div className="absolute top-6 right-6 w-12 h-12 bg-[#2EC1AC] rounded-full flex items-center justify-center z-10">
            <span className="text-white text-sm font-medium leading-[150%]">
              {product.badge}
            </span>
          </div>
        </div>

        {/* Bottom - Content Area (184px) */}
        <div className="p-4 h-[184px] flex flex-col bg-[#F4F5F7]">
          {/* Title */}
          <h3 className="text-xl font-semibold text-[#3A3A3A] leading-[120%] mb-2 line-clamp-2 overflow-hidden">
            {product.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-[#898989] leading-[150%] mb-3 line-clamp-2 overflow-hidden">
            {product.description}
          </p>

          {/* Price */}
          <p className="text-xl font-semibold text-[#F55157] leading-[150%]">
            BDT {product.price}
          </p>
        </div>

        {/* Full Card Hover Overlay with Buttons */}
        {isHovered && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-500/60 flex flex-col items-center justify-center gap-3 px-[18px] rounded-lg z-5">
            {/* Add to Cart Button */}
            <button className="w-full h-14 border border-[#3B82F6] rounded bg-white flex items-center justify-center cursor-pointer text-base font-medium text-[#3B82F6] transition-all duration-300 leading-6 hover:bg-blue-50">
              Add to Cart
            </button>

            {/* Buy Now Button */}
            <button className="w-full h-14 border border-[#3B82F6] rounded bg-white flex items-center justify-center cursor-pointer text-base font-medium text-[#3B82F6] transition-all duration-300 leading-6 hover:bg-gray-50">
              Buy Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCards4;
