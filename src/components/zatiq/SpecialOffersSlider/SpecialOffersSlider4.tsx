import React from 'react';
import { ArrowRight } from 'lucide-react';
const imageLeft = '/assets/spOffer/image-left.jpg';
const imageRight = '/assets/spOffer/image-right.jpg';

const SpecialOffersSlider4: React.FC = () => {
  return (
    <div className="w-full py-8 px-4 font-roboto">
      <div className="w-full max-w-[1296px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Card - Smartphone - 856px on desktop, full width on mobile */}
          <div className="w-full lg:w-[856px] h-[260px] relative rounded-lg overflow-hidden flex items-center">
            {/* Background Image */}
            <img
              src={imageLeft}
              alt="Smartphone BLU G91 Pro 2022"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay Content */}
            <div className="relative z-10 p-6 md:p-8 lg:p-14">
              <p className="text-sm md:text-base text-[#010F1C] mb-1 font-normal leading-6">Sale 20% off all store</p>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-[#010F1C] mb-2 leading-tight md:leading-9">
                Smartphone<br />BLU G91 Pro 2022
              </h2>
              <button className="inline-flex items-center gap-2 text-[#010F1C] font-medium text-sm leading-6 hover:gap-3 transition-all">
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Card - Headphones - 416px on desktop, full width on mobile */}
          <div className="w-full lg:w-[416px] h-[260px] relative rounded-lg overflow-hidden flex items-center">
            {/* Background Image */}
            <img
              src={imageRight}
              alt="HyperX Cloud II Wireless"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay Content */}
            <div className="relative z-10 p-6 md:p-8 lg:p-10">
              <h2 className="text-lg md:text-xl font-medium text-[#010F1C] mb-1 leading-6">
                HyperX Cloud II<br />Wireless
              </h2>
              <p className="text-sm md:text-base text-[#010F1C] font-medium leading-6 mb-1">Sale 35% off</p>
              <button className="inline-flex items-center gap-2 text-[#010F1C] font-medium text-sm leading-6 hover:gap-3 transition-all">
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffersSlider4;