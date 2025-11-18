import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SpecialOffersSlider4Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

const defaultSettings = {
  leftCard: {
    image: '/assets/spOffer/image-left.jpg',
    saleText: 'Sale 20% off all store',
    title: 'Smartphone\nBLU G91 Pro 2022',
    buttonText: 'Shop Now',
  },
  rightCard: {
    image: '/assets/spOffer/image-right.jpg',
    title: 'HyperX Cloud II\nWireless',
    saleText: 'Sale 35% off',
    buttonText: 'Shop Now',
  },
};

export default function SpecialOffersSlider4({ settings, blocks, pageData }: SpecialOffersSlider4Props) {
  const config = { ...defaultSettings, ...settings };
  const { leftCard, rightCard } = config;

  return (
    <div className="w-full py-8 px-4 font-roboto">
      <div className="max-w-[1296px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Card - Smartphone - 2/3 width (856px) */}
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden h-[260px] flex items-center">
            {/* Background Image */}
            <img
              src={leftCard.image}
              alt={leftCard.title.replace('\n', ' ')}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay Content */}
            <div className="relative z-10 p-8 lg:p-12">
              <p className="text-sm text-gray-700 mb-2">{leftCard.saleText}</p>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 leading-tight whitespace-pre-line">
                {leftCard.title}
              </h2>
              <button className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all">
                {leftCard.buttonText}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Card - Headphones - 1/3 width (416px) */}
          <div className="lg:col-span-1 relative rounded-2xl overflow-hidden h-[260px] flex items-center">
            {/* Background Image */}
            <img
              src={rightCard.image}
              alt={rightCard.title.replace('\n', ' ')}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay Content */}
            <div className="relative z-10 p-6 lg:p-8">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 leading-tight whitespace-pre-line">
                {rightCard.title}
              </h2>
              <p className="text-sm text-gray-800 font-semibold mb-4">{rightCard.saleText}</p>
              <button className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all">
                {rightCard.buttonText}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
