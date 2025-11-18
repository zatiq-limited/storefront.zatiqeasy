import React from "react";

const StaticBanner3: React.FC = () => {
  return (
    <div className="relative w-full h-[410px] lg:h-[440px] xl:h-[463px] bg-black overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="assets/banner/banner-3.png"
          alt="Product Background"
          className="w-full h-full object-cover opacity-70"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content Container - Centered */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 md:px-8">
        <div className="text-center">
          {/* Heading */}
          <h1 className="text-white font-bold leading-none mb-4 sm:mb-5 md:mb-6 lg:mb-7 text-3xl sm:text-4xl md:text-5xl lg:text-[60px] tracking-tight">
            Best Discounts 2025
          </h1>

          {/* Description */}
          <p className="text-white/95 leading-relaxed mb-6 sm:mb-7 md:mb-8 lg:mb-9 text-sm sm:text-[15px] md:text-base leading-6 sm:leading-[26px] max-w-[90%] sm:max-w-[500px] md:max-w-[580px] lg:max-w-[640px] mx-auto px-2">
            Salla Store provides you with everything you need, from electronics
            to home furniture, along with the best discounts on products. Shop
            now and enjoy all the discounts on products.
          </p>

          {/* CTA Button */}
          <button className="bg-[#4169E1] text-white font-medium hover:bg-[#3758CC] transition-colors text-sm sm:text-[15px] py-3 sm:py-[14px] px-8 sm:px-10 md:px-11 rounded-[3px] tracking-[0.2px]">
            Discover more
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaticBanner3;
