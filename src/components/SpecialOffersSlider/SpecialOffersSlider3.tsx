import React from 'react';

interface SpecialOffersSlider3Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

const defaultSettings = {
  title: 'Buy Bottle now',
  highlightText: '25% off',
  buttonText: 'Buy Now',
  images: [
    '/assets/spOffer/sp1.png',
    '/assets/spOffer/sp2.png',
    '/assets/spOffer/sp3.png',
    '/assets/spOffer/sp4.png',
  ],
};

export default function SpecialOffersSlider3({ settings, blocks, pageData }: SpecialOffersSlider3Props) {
  const config = { ...defaultSettings, ...settings };
  const { title, highlightText, buttonText, images } = config;

  return (
    <div className="w-full bg-white py-12 px-4 font-sans">
      <div className="max-w-[1296px] mx-auto">
        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col items-center gap-6">
          {/* Top Images */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <img src={images[0]} alt="Bottle 1" className="w-full aspect-square object-cover rounded-xl" />
            <img src={images[1]} alt="Bottle 2" className="w-full aspect-square object-cover rounded-xl" />
          </div>

          {/* Text + CTA */}
          <div className="text-center px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {title}<br />and get <span className="text-blue-600">{highlightText}</span>
            </h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-3xl transition-colors text-base">
              {buttonText}
            </button>
          </div>

          {/* Bottom Images */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <img src={images[2]} alt="Bottle 3" className="w-full aspect-square object-cover rounded-xl" />
            <img src={images[3]} alt="Bottle 4" className="w-full aspect-square object-cover rounded-xl" />
          </div>
        </div>

        {/* Desktop Layout - Artistic Positioning */}
        <div className="hidden lg:block relative h-[580px]">
          {/* Top Left Bottle */}
          <img
            src={images[0]}
            alt="Bottle 1"
            className="absolute top-0 left-[5%] w-[196px] h-[196px] object-cover rounded-xl shadow-lg"
          />

          {/* Top Right Bottle */}
          <img
            src={images[1]}
            alt="Bottle 2"
            className="absolute top-[60px] right-[8%] w-[196px] h-[196px] object-cover rounded-xl shadow-lg"
          />

          {/* Center Content */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <h2 className="text-[56px] font-bold text-gray-900 leading-tight mb-8">
              {title}<br />and get <span className="text-blue-600">{highlightText}</span>
            </h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-3xl transition-colors text-base shadow-lg">
              {buttonText}
            </button>
          </div>

          {/* Bottom Left Bottle */}
          <img
            src={images[2]}
            alt="Bottle 3"
            className="absolute bottom-28 left-[20%] w-[196px] h-[196px] object-cover rounded-xl shadow-lg"
          />

          {/* Bottom Right Bottle */}
          <img
            src={images[3]}
            alt="Bottle 4"
            className="absolute bottom-0 right-[25%] w-[196px] h-[196px] object-cover rounded-xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
