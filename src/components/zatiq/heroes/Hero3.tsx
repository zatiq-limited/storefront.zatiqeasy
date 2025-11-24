import React, { useState, useEffect, useCallback } from "react";

// Carousel slide data structure
interface HeroSlide {
  id: string | number;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  imageAlt?: string;
}

// Component props interface
interface Hero3Props {
  settings?: {
    autoPlay?: boolean;
    autoPlaySpeed?: number;
    showArrows?: boolean;
    showIndicators?: boolean;
  };
  blocks?: HeroSlide[];
}

const Hero3: React.FC<Hero3Props> = ({ settings = {}, blocks = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Use blocks from props or fallback to empty array
  const heroSlides = blocks.length > 0 ? blocks : [];
  const totalSlides = heroSlides.length;

  // Settings with defaults
  const autoPlay = settings.autoPlay !== false; // Default: true
  const autoPlaySpeed = settings.autoPlaySpeed || 5000; // Default: 5s
  const showArrows = settings.showArrows !== false; // Default: true
  const showIndicators = settings.showIndicators !== false; // Default: true

  // Handle next slide
  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, totalSlides]);

  // Handle previous slide
  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, totalSlides]);

  // Handle dot click
  const handleDotClick = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentSlide) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning, currentSlide]
  );

  // Auto-advance carousel
  useEffect(() => {
    if (!autoPlay || isPaused || totalSlides === 0) return;

    const interval = setInterval(() => {
      handleNext();
    }, autoPlaySpeed);

    return () => clearInterval(interval);
  }, [isPaused, handleNext, autoPlay, autoPlaySpeed, totalSlides]);

  // Return null if no slides
  if (totalSlides === 0) {
    return null;
  }

  return (
    <div className="w-full pb-8 sm:pb-14 py-0">
      <div
        className="relative w-full min-h-[480px] sm:min-h-[558px] bg-[#1F2937] overflow-hidden group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides Container */}
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.imageUrl}
                alt={slide.imageAlt || slide.title}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>

            <div className="relative px-4 md:px-6 xl:px-[200px] py-16 md:py-[136px]">
              {/* Content Section with Navigation Arrows */}
              <div className="flex items-center justify-center gap-6 md:gap-10 lg:gap-24">
                {/* Left Arrow */}
                {showArrows && totalSlides > 1 && (
                <button
                  onClick={handlePrev}
                  disabled={isTransitioning}
                  className="hidden sm:flex items-center justify-center w-[60px] h-[60px] rounded-[30px] border border-[#EEEEEE] hover:bg-[#3465F0] transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed lg:opacity-0 lg:group-hover:opacity-100"
                  aria-label="Previous slide"
                >
                  <svg
                    className="w-4 h-4 text-[#EEEEEE]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10 12L6 8l4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                )}

                {/* Text Content */}
                <div className="flex-1 max-w-[728px] flex flex-col items-center space-y-8">
                  {/* Title and Description */}
                  <div className="w-full space-y-4">
                    {/* Title */}
                    <h1
                      className={`text-3xl md:text-5xl font-bold text-white text-center leading-[70px] transition-all duration-700 ${
                        index === currentSlide
                          ? "translate-y-0 opacity-100 delay-100"
                          : "translate-y-8 opacity-0"
                      }`}
                    >
                      {slide.title}
                    </h1>

                    {/* Description */}
                    <p
                      className={`text-sm md:text-base font-normal text-[#F8F8F8] text-center leading-[25px] transition-all duration-700 ${
                        index === currentSlide
                          ? "translate-y-0 opacity-100 delay-200"
                          : "translate-y-8 opacity-0"
                      }`}
                    >
                      {slide.description}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => (window.location.href = slide.buttonLink)}
                    className={`min-w-[200px] min-h-10 sm:min-h-14 px-4 bg-[#3465F0] hover:bg-[#2850D9] text-white font-medium text-base rounded transition-all hover:scale-105 active:scale-95 ${
                      index === currentSlide
                        ? "translate-y-0 opacity-100 delay-300"
                        : "translate-y-8 opacity-0"
                    }`}
                  >
                    {slide.buttonText}
                  </button>
                </div>

                {/* Right Arrow */}
                {showArrows && totalSlides > 1 && (
                <button
                  onClick={handleNext}
                  disabled={isTransitioning}
                  className="hidden sm:flex items-center justify-center w-[60px] h-[60px] rounded-[30px] border border-[#EEEEEE] hover:bg-[#3465F0] transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed lg:opacity-0 lg:group-hover:opacity-100"
                  aria-label="Next slide"
                >
                  <svg
                    className="w-4 h-4 text-[#EEEEEE]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 12l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Slider Indicators */}
        {showIndicators && totalSlides > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-1.5 z-20">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => handleDotClick(index)}
              disabled={isTransitioning}
              className="disabled:cursor-not-allowed"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className={`w-3.5 h-3.5 transition-all duration-300 ${
                  index === currentSlide
                    ? "rounded-[10px] bg-[#3465F0]"
                    : "rounded-full border border-[#EEEEEE] hover:bg-white/20"
                }`}
              ></div>
            </button>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default Hero3;
