import React from "react";

const Hero2: React.FC = () => {
  return (
    <div className="font-segoe relative w-full max-w-[1440px] mx-auto h-[580px]  sm:h-[716px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-[url('/assets/hero/hero-2.png')] bg-cover bg-center">
        {/* Dark Overlay - 20% opacity */}
        <div className="absolute inset-0 bg-black opacity-5"></div>
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-[1440px] mx-auto flex flex-col justify-between items-center px-4 py-20">
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-7 max-w-[1440px]">
          {/* Badge */}
          <p className="text-sm font-normal text-white uppercase tracking-[10%] leading-[100%]">
            New Arrival
          </p>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-semibold text-white tracking-[6%] leading-[100%] max-w-4xl">
            Maximum impact
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl font-normal text-white tracking-[0%] leading-[100%] max-w-2xl">
            Shop our collection of glamorous swimsuits and mix-and-match bikinis.
          </p>

          {/* CTA Button */}
          <button className="min-w-40 min-h-10 sm:min-w-48 sm:min-h-14 px-4 inline-flex items-center justify-center bg-white hover:bg-gray-100 text-[#212121] font-semibold text-base rounded transition-colors">
            <span>Shop New Arrivals</span>
          </button>
        </div>

        {/* Carousel Indicators - 32px from bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
          </div>
          <div className="w-5 h-5 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
          </div>
          <div className="w-5 h-5 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
          </div>
          <div className="w-5 h-5 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero2;
