import React from 'react';
const containerBg = '/assets/spOffer/container.png';

const SpecialOffersSlider5: React.FC = () => {
  return (
    <div className="w-full py-8 px-4 font-roboto">
      <div className="max-w-[1296px] mx-auto">
        {/* Single Full-Width Banner */}
        <div className="relative rounded-lg overflow-hidden h-[500px]">
          {/* Background Image */}
          <img
            src={containerBg}
            alt="Galaxy Tab S6 Lite Android Tablet"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Content Overlay */}
          <div className="relative z-10 h-full flex items-center">
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 px-8 lg:px-16">
              {/* Left Side - Text Content */}
              <div className="flex flex-col justify-center">
                <p className="text-base text-[#7E7E7E] uppercase leading-6 tracking-[0.8px]">
                  TABLET COLLECTION 2023
                </p>
                <h2 className="text-3xl lg:text-6xl font-extrabold text-[#070707] mb-3 leading-16">
                  Galaxy Tab S6 Lite<br />
                  Android Tablet
                </h2>
                <div className="flex flex-col items-baseline mb-10">
                  <span className="text-sm text-[#7E7E7E] leading-5 tracking-[-0.28PX] line-through">$320</span>
                  <span className="text-4xl lg:text-4xl font-medium text-[#7E7E7E]">$288</span>
                </div>
                <button className="bg-[#010F1C] cursor-pointer text-white h-11 px-8 rounded-lg font-medium text-sm leading-6 hover:bg-gray-800 transition-colors w-fit">
                  Shop now
                </button>
              </div>

              {/* Right Side - Product Image (handled by background) */}
              <div className="hidden lg:block"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffersSlider5;
