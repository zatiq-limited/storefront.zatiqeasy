import React from 'react';

interface SpecialOffersSlider5Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

const defaultSettings = {
  collectionText: 'TABLET COLLECTION 2023',
  title: 'Galaxy Tab S6 Lite\nAndroid Tablet',
  originalPrice: 320,
  salePrice: 288,
  buttonText: 'Shop now',
  backgroundImage: '/assets/spOffer/container.png',
};

export default function SpecialOffersSlider5({ settings, blocks, pageData }: SpecialOffersSlider5Props) {
  const config = { ...defaultSettings, ...settings };
  const { collectionText, title, originalPrice, salePrice, buttonText, backgroundImage } = config;

  return (
    <div className="w-full py-8 px-4 font-roboto">
      <div className="max-w-[1296px] mx-auto">
        {/* Single Full-Width Banner */}
        <div className="relative rounded-lg overflow-hidden h-[500px]">
          {/* Background Image */}
          <img
            src={backgroundImage}
            alt={title.replace('\n', ' ')}
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Content Overlay */}
          <div className="relative z-10 h-full flex items-center">
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 px-8 lg:px-16">
              {/* Left Side - Text Content */}
              <div className="flex flex-col justify-center">
                <p className="text-sm text-gray-600 uppercase tracking-wide mb-3">
                  {collectionText}
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight whitespace-pre-line">
                  {title}
                </h2>
                <div className="flex flex-col items-baseline mb-6">
                  <span className="text-lg text-gray-500 line-through">${originalPrice}</span>
                  <span className="text-4xl lg:text-4xl font-bold text-gray-600">${salePrice}</span>
                </div>
                <button className="bg-black cursor-pointer text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors w-fit">
                  {buttonText}
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
}
