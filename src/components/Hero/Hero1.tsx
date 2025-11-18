import React, { useState } from "react";

const Hero1: React.FC = () => {
  const [currentSlide] = useState(0);
  const totalSlides = 3;

  return (
    <div className="w-full max-w-[1440px] h-[480px] md:h-[600px] mx-auto relative bg-linear-to-r from-[#DAD4EC] to-[#F3E7E9] rounded-2xl overflow-hidden">
      {/* Content Container */}
      <div className="absolute inset-0">
        {/* Left Content Section - Responsive padding: mobile(24px), md(64px), lg(112px) */}
        <div className="absolute left-6 bottom-24 md:left-16 md:bottom-32 lg:left-28 lg:bottom-40 max-w-[280px] md:max-w-[400px] lg:max-w-[500px] z-10">
          {/* Small Text - Responsive text sizes */}
          <p className="text-[#4E5562] text-sm md:text-lg lg:text-xl font-normal leading-relaxed md:leading-7 lg:leading-[30px] mb-3 md:mb-5 lg:mb-6">
            The new stylish collection
          </p>

          {/* Title - Responsive text sizes: mobile(32px), md(48px), lg(60px) */}
          <h1 className="text-[#181D25] text-[32px] md:text-5xl lg:text-6xl font-bold leading-tight md:leading-tight lg:leading-16 tracking-tight uppercase mb-6 md:mb-10 lg:mb-12">
            NEW FALL
            <br />
            SEASON 2025
          </h1>

          {/* Button - Responsive sizing */}
          <button className="inline-flex items-center gap-2 bg-[#F55266] hover:bg-[#E84258] text-white font-medium text-sm md:text-base leading-6 px-5 py-2.5 md:px-6 md:py-3 rounded-lg transition-all shadow-md hover:shadow-lg">
            <span>Shop now</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="md:w-[18px] md:h-[18px]"
            >
              <path
                d="M12.75 4.59375H5.25C4.88756 4.59375 4.59375 4.88756 4.59375 5.25C4.59375 5.61244 4.88756 5.90625 5.25 5.90625H11.1657L4.78596 12.286C4.52968 12.5422 4.52968 12.9578 4.78596 13.214C5.04224 13.4703 5.45776 13.4703 5.71404 13.214L12.0938 6.83433V12.75C12.0938 13.1124 12.3876 13.4062 12.75 13.4062C13.1124 13.4062 13.4062 13.1124 13.4062 12.75V5.25C13.4062 5.06949 13.3334 4.906 13.2154 4.78735L13.2126 4.78457C13.15 4.72234 13.078 4.67533 13.0012 4.64355C12.9238 4.61146 12.839 4.59375 12.75 4.59375Z"
                fill="white"
              />
            </svg>
          </button>
        </div>

        {/* Pagination Progress Bar - Responsive padding: mobile(24px), md(64px), lg(112px) */}
        <div className="absolute left-6 right-6 md:left-16 md:right-16 lg:left-28 lg:right-28 bottom-10 md:bottom-12 lg:bottom-14 z-20">
          <div className="relative h-0.5 md:h-0.5 lg:h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-white transition-all duration-500 ease-out rounded-full"
              style={{
                width: `${((currentSlide + 1) / totalSlides) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Right Image Section - Responsive positioning: mobile(right-0), md(right-8), lg(right-11) */}
        <div className="absolute -right-52 md:-right-60 lg:right-11 top-0 md:top-6 lg:top-8 bottom-0 flex items-end md:items-center">
          <img
            src="/assets/hero/young-girl.png"
            alt="Model wearing white hoodie"
            className="h-[80%] md:h-[95%] lg:h-full w-auto object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero1;
