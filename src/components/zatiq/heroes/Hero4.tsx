import React, { useState, useEffect, useCallback } from "react";

// Carousel slide data structure
interface HeroSlide {
  id: string | number;
  tag: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  imageAlt?: string;
}

// Component props interface
interface Hero4Props {
  settings?: {
    autoPlay?: boolean;
    autoPlaySpeed?: number;
    showArrows?: boolean;
    showIndicators?: boolean;
  };
  blocks?: HeroSlide[];
}

const Hero4: React.FC<Hero4Props> = ({ settings = {}, blocks = [] }) => {
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

  // Handle indicator click
  const handleIndicatorClick = useCallback(
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
        className="relative font-montserrat w-full min-h-[500px] sm:min-h-[600px] lg:h-[716px] bg-[#7FC5D9] overflow-hidden group"
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
                alt={slide.imageAlt || slide.heading}
                className="w-full h-full object-cover object-center"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-[1440px] mx-auto h-full flex items-center mt-0">
              <div className="pl-4 sm:pl-6 md:pl-20 lg:pl-40 2xl:px-0 pt-8 lg:pt-8 w-full lg:w-auto">
                {/* Tag */}
                <div className="mb-6 lg:mb-9">
                  <span
                    className={`text-white font-bold tracking-widest uppercase text-sm sm:text-base leading-5 sm:leading-6 transition-all duration-700 ${
                      index === currentSlide
                        ? "translate-y-0 opacity-100 delay-100"
                        : "translate-y-8 opacity-0"
                    }`}
                  >
                    {slide.tag}
                  </span>
                </div>

                {/* Main Heading */}
                <h1
                  className={`text-white max-w-[600px] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 lg:mb-9 leading-tight sm:leading-[60px] lg:leading-20 tracking-[0.2px] transition-all duration-700 ${
                    index === currentSlide
                      ? "translate-y-0 opacity-100 delay-200"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  {slide.heading}
                </h1>

                {/* Description */}
                <p
                  className={`text-white mb-6 lg:mb-9 leading-normal text-base sm:text-lg lg:text-xl max-w-full sm:max-w-[376px] font-normal transition-all duration-700 ${
                    index === currentSlide
                      ? "translate-y-0 opacity-100 delay-300"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  {slide.description.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < slide.description.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>

                {/* CTA Button */}
                <button
                  onClick={() => (window.location.href = slide.buttonLink)}
                  className={`bg-[#01B7DF] min-w-[180px] sm:min-w-56 min-h-12 sm:min-h-16 text-white font-semibold sm:font-bold uppercase hover:bg-[#01B7DF]/90 transition-all rounded text-lg sm:text-xl lg:text-2xl tracking-[0.1px] px-4 sm:px-6 leading-7 sm:leading-8 hover:scale-105 active:scale-95 ${
                    index === currentSlide
                      ? "translate-y-0 opacity-100 delay-400"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Left Arrow */}
        {showArrows && totalSlides > 1 && (
        <button
          onClick={handlePrev}
          disabled={isTransitioning}
          className="hidden md:flex absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 items-center justify-center transition-all z-20 disabled:opacity-50 disabled:cursor-not-allowed lg:opacity-0 lg:group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <svg
            width="24"
            height="45"
            viewBox="0 0 24 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_804_32118)">
              <g clipPath="url(#clip1_804_32118)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M23.4992 43.7724C23.3409 43.9302 23.1528 44.0554 22.9457 44.1408C22.7386 44.2263 22.5166 44.2703 22.2924 44.2703C22.0682 44.2703 21.8462 44.2263 21.6391 44.1408C21.432 44.0554 21.2439 43.9302 21.0856 43.7724L0.631046 23.4352C0.472307 23.2778 0.346367 23.0908 0.260435 22.8849C0.174505 22.679 0.130272 22.4582 0.130272 22.2353C0.130272 22.0124 0.174505 21.7917 0.260435 21.5858C0.346367 21.3799 0.472307 21.1928 0.631046 21.0354L21.0856 0.698261C21.4057 0.380028 21.8398 0.201248 22.2924 0.201248C22.7451 0.201248 23.1792 0.380028 23.4992 0.698261C23.8193 1.01649 23.9991 1.4481 23.9991 1.89815C23.9991 2.3482 23.8193 2.77981 23.4992 3.09805L4.24809 22.2353L23.4992 41.3726C23.658 41.53 23.7839 41.717 23.8698 41.9229C23.9558 42.1288 24 42.3496 24 42.5725C24 42.7954 23.9558 43.0161 23.8698 43.222C23.7839 43.4279 23.658 43.6149 23.4992 43.7724Z"
                  fill="white"
                />
              </g>
            </g>
            <defs>
              <clipPath id="clip0_804_32118">
                <rect width="24" height="44.4706" fill="white" />
              </clipPath>
              <clipPath id="clip1_804_32118">
                <rect
                  width="24"
                  height="44.4706"
                  fill="white"
                  transform="translate(24 44.4707) rotate(-180)"
                />
              </clipPath>
            </defs>
          </svg>
        </button>
        )}

        {/* Right Arrow */}
        {showArrows && totalSlides > 1 && (
        <button
          onClick={handleNext}
          disabled={isTransitioning}
          className="hidden md:flex absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 items-center justify-center transition-all z-20 disabled:opacity-50 disabled:cursor-not-allowed lg:opacity-0 lg:group-hover:opacity-100"
          aria-label="Next slide"
        >
          <svg
            width="24"
            height="45"
            viewBox="0 0 24 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_804_32115)">
              <g clipPath="url(#clip1_804_32115)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.565226 0.69834C0.723564 0.540513 0.911663 0.415294 1.11875 0.329856C1.32583 0.244418 1.54784 0.200439 1.77205 0.200439C1.99625 0.200439 2.21826 0.244418 2.42534 0.329856C2.63243 0.415294 2.82053 0.540513 2.97886 0.69834L23.4334 21.0355C23.5921 21.1929 23.7181 21.3799 23.804 21.5858C23.8899 21.7917 23.9342 22.0125 23.9342 22.2354C23.9342 22.4583 23.8899 22.679 23.804 22.8849C23.7181 23.0908 23.5921 23.2779 23.4334 23.4353L2.97886 43.7724C2.6588 44.0907 2.22469 44.2695 1.77205 44.2695C1.3194 44.2695 0.885294 44.0907 0.565226 43.7724C0.245158 43.4542 0.0653456 43.0226 0.0653456 42.5726C0.0653456 42.1225 0.245158 41.6909 0.565226 41.3727L19.8164 22.2354L0.565226 3.09813C0.406488 2.9407 0.280546 2.75368 0.194615 2.54778C0.108684 2.34188 0.0644531 2.12115 0.0644531 1.89823C0.0644531 1.67531 0.108684 1.45458 0.194615 1.24869C0.280546 1.04279 0.406488 0.855769 0.565226 0.69834Z"
                  fill="white"
                />
              </g>
            </g>
            <defs>
              <clipPath id="clip0_804_32115">
                <rect width="24" height="44.4706" fill="white" />
              </clipPath>
              <clipPath id="clip1_804_32115">
                <rect width="24" height="44.4706" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
        )}

        {/* Carousel Indicators */}
        {showIndicators && totalSlides > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex z-20">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => handleIndicatorClick(index)}
              disabled={isTransitioning}
              className="disabled:cursor-not-allowed"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className={`w-[62px] h-2.5 transition-all duration-300 ${
                  index === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white/70"
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

export default Hero4;
