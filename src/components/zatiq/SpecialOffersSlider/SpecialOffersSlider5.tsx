import React, { useState, useEffect } from 'react';

interface Slide {
  background: string;
  category?: string;
  title: string;
  originalPrice?: string;
  salePrice?: string;
  buttonText?: string;
  altText?: string;
  categoryColor?: string;
  titleColor?: string;
  priceColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

interface SpecialOffersSlider5Props {
  slides?: Slide[];
  autoPlayInterval?: number;
  height?: string;
  bgColor?: string;
}

const SpecialOffersSlider5: React.FC<SpecialOffersSlider5Props> = ({
  slides = [],
  autoPlayInterval,
  height,
  bgColor
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!isHovered && slides.length > 1) {
      const interval = setInterval(() => {
        handleNext();
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isHovered, autoPlayInterval, slides.length]);

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

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div
      className="w-full pb-8 md:pb-14 px-4 font-roboto"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-[1296px] mx-auto">
        {/* Vertical Carousel Container */}
        <div
          className="relative rounded-lg overflow-hidden"
          style={{ height }}
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
            {slides.map((slide, index) => (
              <div
                key={index}
                className="shrink-0 relative"
                style={{ height }}
              >
                {/* Background Image */}
                {slide.background && (
                  <img
                    src={slide.background}
                    alt={slide.altText || slide.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {/* Content Overlay */}
                <div className="relative z-10 h-full flex items-center">
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 px-8 lg:px-16">
                    {/* Left Side - Text Content */}
                    <div className="flex flex-col justify-center">
                      {slide.category && (
                        <p
                          className="text-base uppercase leading-6 tracking-[0.8px] mb-2"
                          style={{ color: slide.categoryColor || '#7E7E7E' }}
                        >
                          {slide.category}
                        </p>
                      )}
                      {slide.title && (
                        <h2
                          className="text-3xl lg:text-6xl font-extrabold mb-3 leading-tight lg:leading-tight whitespace-pre-line"
                          style={{ color: slide.titleColor || '#070707' }}
                        >
                          {slide.title}
                        </h2>
                      )}
                      {(slide.originalPrice || slide.salePrice) && (
                        <div className="flex flex-col items-baseline mb-10">
                          {slide.originalPrice && (
                            <span
                              className="text-sm leading-5 tracking-[-0.28px] line-through"
                              style={{ color: slide.priceColor || '#7E7E7E' }}
                            >
                              {slide.originalPrice}
                            </span>
                          )}
                          {slide.salePrice && (
                            <span
                              className="text-4xl lg:text-4xl font-medium"
                              style={{ color: slide.priceColor || '#7E7E7E' }}
                            >
                              {slide.salePrice}
                            </span>
                          )}
                        </div>
                      )}
                      {slide.buttonText && (
                        <button
                          className="cursor-pointer h-11 px-8 rounded-lg font-medium text-sm leading-6 transition-opacity hover:opacity-90 w-fit"
                          style={{
                            backgroundColor: slide.buttonBgColor || '#010F1C',
                            color: slide.buttonTextColor || '#FFFFFF'
                          }}
                        >
                          {slide.buttonText}
                        </button>
                      )}
                    </div>

                    {/* Right Side - Product Image (handled by background) */}
                    <div className="hidden lg:block"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slide Indicators */}
          {slides.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === index
                      ? 'bg-[#010F1C] w-8'
                      : 'bg-gray-400 w-2'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialOffersSlider5;
