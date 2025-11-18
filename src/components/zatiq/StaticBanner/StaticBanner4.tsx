import React from "react";

const StaticBanner4: React.FC = () => {
  return (
    <div className="relative w-full h-[450px] md:h-[500px] lg:h-[550px] xl:h-[580px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="assets/banner/banner-4.png"
          alt="Coastal Landscape"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30"></div>

      {/* Content Container - Centered */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        {/* Small Label */}
        <div className="mb-4 sm:mb-6 md:mb-8 font-avenir">
          <span className="text-white font-normal tracking-[10%] uppercase text-xs sm:text-sm">
            OUR VISION
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-white font-caslon text-center font-medium mb-4 sm:mb-6 md:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[6%] leading-[1.3] font-serif max-w-[90%] sm:max-w-[85%] md:max-w-[900px] lg:max-w-[1000px] xl:max-w-[1100px] px-2">
          To empower women globally to
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>celebrate summer with
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>confidence.
        </h1>

        {/* Description */}
        <p className="text-white font-avenir text-center font-normal text-sm sm:text-base md:text-lg lg:text-xl leading-[1.6] tracking-[0.3px] max-w-[90%] sm:max-w-[80%] md:max-w-full px-2">
          Luxurious high quality pieces that are designed to last.
        </p>
      </div>
    </div>
  );
};

export default StaticBanner4;
