import React, { useState, useEffect, useCallback } from "react";

// Carousel slide data structure
interface HeroSlide {
  id: number;
  tagline: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  imageAlt: string;
  bgGradient: string;
  textColor: string;
  taglineColor: string;
}

// Hero slides data with online images
const heroSlides: HeroSlide[] = [
  {
    id: 1,
    tagline: "The new stylish collection",
    title: "NEW FALL",
    subtitle: "SEASON 2025",
    buttonText: "Shop now",
    buttonLink: "/collections/fall-2025",
    imageUrl: "/assets/hero/hero-11.png",
    imageAlt: "Fashion model in fall collection",
    bgGradient: "from-[#DAD4EC] to-[#F3E7E9]",
    textColor: "#181D25",
    taglineColor: "#4E5562",
  },
  {
    id: 2,
    tagline: "Trending this winter",
    title: "COZY",
    subtitle: "WINTER VIBES",
    buttonText: "Explore collection",
    buttonLink: "/collections/winter-2025",
    imageUrl: "/assets/hero/hero-12.png",
    imageAlt: "Model in winter fashion collection",
    bgGradient: "from-[#E5DDD5] to-[#E8DFE0]",
    textColor: "#1A1A1A",
    taglineColor: "#5A5A5A",
  },
  {
    id: 3,
    tagline: "Limited edition arrivals",
    title: "EXCLUSIVE",
    subtitle: "DESIGNER PICKS",
    buttonText: "Shop exclusive",
    buttonLink: "/collections/exclusive",
    imageUrl: "/assets/hero/hero-13.png",
    imageAlt: "Exclusive designer fashion collection",
    bgGradient: "from-[#F5E6D3] to-[#E9DDD4]",
    textColor: "#2C2C2C",
    taglineColor: "#6B6B6B",
  },
];

const Hero1: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = heroSlides.length;

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 500); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentSlide, isPaused]);

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

  return (
    <div className="w-full px-4 pb-8 sm:pb-14 py-0 2xl:px-0">
      <div
        className="w-full max-w-[1440px] h-[480px] md:h-[600px] mx-auto relative rounded-2xl overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
      {/* Slides Container */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-105 z-0"
            }`}
          >
            {/* Left Content Section */}
            <div className="absolute left-6 bottom-24 md:left-16 md:bottom-32 lg:left-28 lg:bottom-40 max-w-[280px] md:max-w-[400px] lg:max-w-[500px] z-10">
              {/* Tagline */}
              <p
                className={`text-sm md:text-lg lg:text-xl font-normal leading-relaxed md:leading-7 lg:leading-[30px] mb-3 md:mb-5 lg:mb-6 transition-all duration-700 ${
                  index === currentSlide
                    ? "translate-y-0 opacity-100 delay-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ color: slide.taglineColor }}
              >
                {slide.tagline}
              </p>

              {/* Title */}
              <h1
                className={`text-[32px] md:text-5xl lg:text-6xl font-bold leading-tight md:leading-tight lg:leading-[1.1] tracking-tight uppercase mb-6 md:mb-10 lg:mb-12 transition-all duration-700 ${
                  index === currentSlide
                    ? "translate-y-0 opacity-100 delay-200"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ color: slide.textColor }}
              >
                {slide.title}
                {slide.subtitle && (
                  <>
                    <br />
                    {slide.subtitle}
                  </>
                )}
              </h1>

              {/* CTA Button */}
              <button
                onClick={() => (window.location.href = slide.buttonLink)}
                className={`inline-flex items-center gap-2 bg-[#F55266] hover:bg-[#E84258] text-white font-medium text-sm md:text-base leading-6 px-5 py-2.5 md:px-6 md:py-3 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 ${
                  index === currentSlide
                    ? "translate-y-0 opacity-100 delay-300"
                    : "translate-y-8 opacity-0"
                }`}
              >
                <span>{slide.buttonText}</span>
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

            {/* Right Image Section */}
            <div className="absolute right-4 md:right-8 lg:right-11 top-0 md:top-6 lg:top-8 bottom-0 flex items-end md:items-center">
              <img
                src={slide.imageUrl}
                alt={slide.imageAlt}
                className={`h-[80%] md:h-[95%] lg:h-full w-auto object-cover object-center transition-all duration-700 ${
                  index === currentSlide
                    ? "translate-x-0 opacity-100 scale-100 delay-100"
                    : "translate-x-16 opacity-0 scale-95"
                }`}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8 lg:px-12 z-20 pointer-events-none">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          disabled={isTransitioning}
          className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
          aria-label="Previous slide"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-800 group-hover:text-[#F55266] transition-colors"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={isTransitioning}
          className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
          aria-label="Next slide"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-800 group-hover:text-[#F55266] transition-colors"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Pagination Dots & Progress Bar */}
      <div className="absolute left-6 right-6 md:left-16 md:right-16 lg:left-28 lg:right-28 bottom-10 md:bottom-12 lg:bottom-14 z-20">
        
        {/* Progress Bar */}
        <div className="relative h-0.5 md:h-0.5 lg:h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-white/60 transition-all duration-700 ease-out rounded-full"
            style={{
              width: `${((currentSlide + 1) / totalSlides) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
    </div>
  );
};

export default Hero1;
