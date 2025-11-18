import React from "react";

const Hero3: React.FC = () => {
  return (
    <div className="relative w-full max-w-[1440px] min-h-[480px] sm:min-h-[558px] mx-auto bg-[#1F2937] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/assets/hero/hero-3.png)' }}
      ></div>

      <div className="relative px-4 md:px-6 xl:px-[200px] py-16 md:py-[136px]">
        {/* Content Section with Navigation Arrows */}
        <div className="flex items-center justify-center gap-6 md:gap-10 lg:gap-24">
          {/* Left Arrow */}
          <button className="hidden sm:flex items-center justify-center w-[60px] h-[60px] rounded-[30px] border border-[#EEEEEE] hover:bg-white/10 transition-colors shrink-0">
            <svg
              className="w-4 h-4 text-[#EEEEEE]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 16 16"
            >
              <path d="M10 12L6 8l4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Text Content */}
          <div className="flex-1 max-w-[728px] flex flex-col items-center space-y-8">
            {/* Title and Description */}
            <div className="w-full space-y-4">
              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-bold text-white text-center leading-[70px]">
                Best Discounts 2025
              </h1>

              {/* Description */}
              <p className="text-sm md:text-base font-normal text-[#F8F8F8] text-center leading-[25px]">
                Salla Store provides you with everything you need, from electronics
                to home furniture, along with the best discounts on products. Shop
                now and enjoy all the discounts on products.
              </p>
            </div>

            {/* CTA Button */}
            <button className="min-w-[200px] min-h-10 sm:min-h-14 px-4 bg-[#3465F0] hover:bg-[#2850D9] text-white font-medium text-base rounded transition-colors">
              Discover more
            </button>
          </div>

          {/* Right Arrow */}
          <button className="hidden sm:flex items-center justify-center w-[60px] h-[60px] rounded-[30px] border border-[#EEEEEE] hover:bg-white/10 transition-colors shrink-0">
            <svg
              className="w-4 h-4 text-[#EEEEEE]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 16 16"
            >
              <path d="M6 12l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-1.5">
        {/* Dot 1 - Outlined Circle */}
        <div className="w-3.5 h-3.5 rounded-full border border-[#EEEEEE]"></div>

        {/* Dot 2 - Outlined Circle */}
        <div className="w-3.5 h-3.5 rounded-full border border-[#EEEEEE]"></div>

        {/* Dot 3 - Active (Filled Rounded Rectangle) */}
        <div className="w-3.5 h-3.5 rounded-[10px] bg-[#3465F0]"></div>

        {/* Dot 4 - Outlined Circle */}
        <div className="w-3.5 h-3.5 rounded-full border border-[#EEEEEE]"></div>
      </div>
    </div>
  );
};

export default Hero3;
