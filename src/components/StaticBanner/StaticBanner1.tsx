import React from "react";

interface StaticBanner1Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

export default function StaticBanner1({ settings, blocks, pageData }: StaticBanner1Props) {
  return (
    <div className="relative w-full h-[450px] lg:h-[500px] xl:h-[524px] bg-black overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={settings?.backgroundImage || "/assets/banner/banner-1.png"}
          alt={settings?.backgroundImageAlt || "Laptop Background"}
          className="w-full h-full object-cover opacity-70"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/5"></div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center justify-center md:justify-end px-4 sm:px-8 md:px-12 lg:px-20 xl:pr-52">
        <div className="text-center md:text-right max-w-[90%] sm:max-w-[500px] md:max-w-[550px] lg:max-w-[600px]">
          {/* Heading */}
          <h1 className="text-white font-bold mb-4 sm:mb-5 md:mb-6 text-3xl sm:text-4xl md:text-5xl leading-tight sm:leading-[50px] md:leading-[60px] lg:leading-[70px]">
            {settings?.heading || "Best Discounts"}
            <br />
            {settings?.headingLine2 || "2025"}
          </h1>

          {/* Description */}
          <p className="text-white/90 mb-6 sm:mb-8 md:mb-10 text-sm sm:text-base leading-6 font-normal">
            {settings?.description || "Salla Store provides you with everything you need, from electronics to home furniture, along with the best discounts on products. Shop now and enjoy all the discounts on products."}
          </p>

          {/* CTA Button */}
          <button 
            className="bg-[#4169E1] min-w-[160px] sm:min-w-[180px] md:min-w-[200px] min-h-12 sm:min-h-13 md:min-h-14 text-white font-semibold hover:bg-[#3758CC] transition-colors text-sm sm:text-base px-4 rounded leading-6"
            style={settings?.buttonColor ? { backgroundColor: settings.buttonColor } : {}}
          >
            {settings?.buttonText || "Discover more"}
          </button>
        </div>
      </div>
    </div>
  );
}
