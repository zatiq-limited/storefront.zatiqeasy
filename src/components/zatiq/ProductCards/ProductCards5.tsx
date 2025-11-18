import React from "react";

const ProductCards5: React.FC = () => {
  const product = {
    image: "assets/card/p-5.png",
    discount: "-5%",
    title: "Chamarel Cross Front Multilit Singlet Top",
    salePrice: "630",
    originalPrice: "830",
  };

  return (
    <div className="font-roboto flex gap-6 justify-center">
      <div className="w-[282px] h-[513px] overflow-hidden relative cursor-pointer transition-all duration-300">
        {/* Top - Image Container (462px) */}
        <div className="w-[282px] h-[450px] relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {/* Discount Badge */}
          <div className="absolute top-3 right-3 w-11 h-11 bg-[#E97171] rounded-full flex items-center justify-center">
            <span className="text-white text-base font-normal leading-[150%]">
              {product.discount}
            </span>
          </div>
        </div>

        {/* Bottom - Content Area (51px) */}
        <div className="pt-3 flex flex-col justify-center">
          {/* Title */}
          <h3 className="text-xs font-normal text-[#212121] mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {product.title}
          </h3>

          {/* Prices */}
          <div className="pt-1.5 flex items-center gap-1.5">
            <span className="text-sm font-bold text-[#212121]">
              BDT {product.salePrice}
            </span>
            <span className="text-sm text-[#9C9B9B] line-through font-normal">
              {product.originalPrice} tk
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCards5;
