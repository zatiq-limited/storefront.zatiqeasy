import React from "react";

const ProductCards7: React.FC = () => {
  const product = {
    image: "assets/card/p-7.png",
    discount: "-13%",
    title: "Loft-style lamp 120×80 cm",
    salePrice: "1400.00",
    originalPrice: "1600.00",
    colors: ["#BDAB9E", "#D65C46", "#E0E5EB"],
  };

  return (
    <div className="font-sans flex gap-6 justify-center">
      <div className="w-[282px] h-[474px] overflow-visible relative cursor-pointer transition-all duration-300">
        {/* Top - Image Container (306px) */}
        <div className="w-[282px] h-[306px] relative mb-4">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {/* Discount Badge */}
          <div className="absolute top-4 left-4 bg-[#F03D3D] text-white px-2.5 py-1 rounded text-xs font-medium leading-4">
            {product.discount}
          </div>
        </div>

        {/* Bottom - Content Area */}
        <div className="flex flex-col">
          {/* Color Options */}
          <div className="flex gap-2 mb-4">
            {/* First color - selected with border ring */}
            <div className="relative w-6 h-6 flex items-center justify-center">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: product.colors[0] }}
              />
              <div className="absolute inset-0 rounded-full border border-[#6B7280]" />
            </div>

            {/* Second color - unselected */}
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: product.colors[1] }}
            />

            {/* Third color - unselected */}
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: product.colors[2] }}
            />
          </div>

          {/* Title */}
          <h3 className="text-sm font-medium text-[#181D25] leading-5 mb-2">
            {product.title}
          </h3>

          {/* Prices */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base font-semibold text-[#181D25] leading-6">
              BDT {product.salePrice}
            </span>
            <span className="text-sm font-semibold text-[#9CA3AF] line-through leading-5">
              BDT {product.originalPrice}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button className="w-full h-11 border-none rounded-3xl bg-[#222934] text-white text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-[#1A202C]">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCards7;
