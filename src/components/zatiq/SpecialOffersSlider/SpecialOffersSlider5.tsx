import React, { useState, useEffect } from 'react';

interface Slide {
  id: number;
  background: string;
  category: string;
  title: string;
  originalPrice: string;
  salePrice: string;
  altText: string;
}

const SpecialOffersSlider5: React.FC = () => {
  const slides: Slide[] = [
    {
      id: 1,
      background: '/assets/spOffer/Container.png',
      category: 'TABLET COLLECTION 2023',
      title: 'Galaxy Tab S6 Lite\nAndroid Tablet',
      originalPrice: '$320',
      salePrice: '$288',
      altText: 'Galaxy Tab S6 Lite Android Tablet'
    },
    {
      id: 2,
      background: '/assets/spOffer/image-left.jpg',
      category: 'SMARTPHONE DEALS 2023',
      title: 'Smartphone\nBLU G91 Pro 2022',
      originalPrice: '$299',
      salePrice: '$239',
      altText: 'Smartphone BLU G91 Pro 2022'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        handleNext();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isHovered]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex <= 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  // Touch handlers for vertical swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe up
      handleNext();
    }

    if (touchStart - touchEnd < -75) {
      // Swipe down
      handlePrev();
    }
  };

  return (
    <div className="w-full pb-8 md:pb-14 px-4 font-roboto">
      <div className="max-w-[1296px] mx-auto">
        {/* Vertical Carousel Container */}
        <div
          className="relative rounded-lg overflow-hidden h-[500px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slides Wrapper */}
          <div
            className="flex flex-col transition-transform duration-300 ease-in-out h-full"
            style={{
              transform: `translateY(-${currentIndex * 100}%)`
            }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="shrink-0 h-[500px] relative"
              >
                {/* Background Image */}
                <img
                  src={slide.background}
                  alt={slide.altText}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Content Overlay */}
                <div className="relative z-10 h-full flex items-center">
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 px-8 lg:px-16">
                    {/* Left Side - Text Content */}
                    <div className="flex flex-col justify-center">
                      <p className="text-base text-[#7E7E7E] uppercase leading-6 tracking-[0.8px]">
                        {slide.category}
                      </p>
                      <h2 className="text-3xl lg:text-6xl font-extrabold text-[#070707] mb-3 leading-tight lg:leading-16">
                        {slide.title.split('\n').map((line, index) => (
                          <React.Fragment key={index}>
                            {line}
                            {index < slide.title.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </h2>
                      <div className="flex flex-col items-baseline mb-10">
                        <span className="text-sm text-[#7E7E7E] leading-5 tracking-[-0.28px] line-through">
                          {slide.originalPrice}
                        </span>
                        <span className="text-4xl lg:text-4xl font-medium text-[#7E7E7E]">
                          {slide.salePrice}
                        </span>
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
            ))}
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === index
                    ? 'bg-[#010F1C] w-8'
                    : 'bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffersSlider5;
