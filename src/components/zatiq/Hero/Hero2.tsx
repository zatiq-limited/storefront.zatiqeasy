import React, { useState, useEffect, useCallback } from "react";

// Carousel slide data structure
interface HeroSlide {
  id: number;
  badge: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  imageAlt: string;
  overlayOpacity: string;
}

// Hero slides data with online images (1440x716px)
const heroSlides: HeroSlide[] = [
  {
    id: 1,
    badge: "New Arrival",
    heading: "Maximum impact",
    description: "Shop our collection of glamorous swimsuits and mix-and-match bikinis.",
    buttonText: "Shop New Arrivals",
    buttonLink: "/collections/new-arrivals",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1440&h=716&fit=crop&q=80",
    imageAlt: "Fashion collection showcase",
    overlayOpacity: "opacity-20",
  },
  {
    id: 2,
    badge: "Summer Collection",
    heading: "Beach Ready Vibes",
    description: "Discover the perfect pieces for your summer getaway and beachside adventures.",
    buttonText: "Explore Collection",
    buttonLink: "/collections/summer",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1440&h=716&fit=crop&q=80",
    imageAlt: "Summer fashion collection",
    overlayOpacity: "opacity-30",
  },
  {
    id: 3,
    badge: "Limited Edition",
    heading: "Exclusive Designer Wear",
    description: "Luxury fashion pieces curated for those who appreciate timeless elegance.",
    buttonText: "Shop Exclusive",
    buttonLink: "/collections/exclusive",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1440&h=716&fit=crop&q=80",
    imageAlt: "Exclusive designer fashion",
    overlayOpacity: "opacity-25",
  }
];

const Hero2: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = heroSlides.length;

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
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  return (
    <div className="w-full px-4 pb-8 sm:pb-14 py-0 2xl:px-0">
      <div
        className="font-segoe relative w-full max-w-[1440px] mx-auto h-[580px] sm:h-[716px] overflow-hidden group"
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
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img
                src={slide.imageUrl}
                alt={slide.imageAlt}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
              {/* Dark Overlay */}
              <div className={`absolute inset-0 bg-black ${slide.overlayOpacity}`}></div>
            </div>

            {/* Content Container */}
            <div className="relative h-full max-w-[1440px] mx-auto flex flex-col justify-between items-center px-4 py-20">
              {/* Main Content */}
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-7 max-w-[1440px]">
                {/* Badge */}
                <p
                  className={`text-sm font-normal text-white uppercase tracking-[10%] leading-[100%] transition-all duration-700 ${
                    index === currentSlide
                      ? "translate-y-0 opacity-100 delay-100"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  {slide.badge}
                </p>

                {/* Heading */}
                <h1
                  className={`text-5xl md:text-6xl font-semibold text-white tracking-[6%] leading-[100%] max-w-4xl transition-all duration-700 ${
                    index === currentSlide
                      ? "translate-y-0 opacity-100 delay-200"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  {slide.heading}
                </h1>

                {/* Description */}
                <p
                  className={`text-lg md:text-xl font-normal text-white tracking-[0%] leading-[100%] max-w-2xl transition-all duration-700 ${
                    index === currentSlide
                      ? "translate-y-0 opacity-100 delay-300"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  {slide.description}
                </p>

                {/* CTA Button */}
                <button
                  onClick={() => (window.location.href = slide.buttonLink)}
                  className={`min-w-40 min-h-10 sm:min-w-48 sm:min-h-14 px-4 inline-flex items-center justify-center bg-white hover:bg-gray-100 text-[#212121] font-semibold text-base rounded transition-all hover:scale-105 active:scale-95 ${
                    index === currentSlide
                      ? "translate-y-0 opacity-100 delay-400"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  <span>{slide.buttonText}</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8 lg:px-12 z-20 pointer-events-none">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={isTransitioning}
            className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed lg:opacity-0 lg:group-hover:opacity-100"
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
            className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed lg:opacity-0 lg:group-hover:opacity-100"
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

        {/* Carousel Indicators - 32px from bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => handleDotClick(index)}
              disabled={isTransitioning}
              className="w-5 h-5 flex items-center justify-center group disabled:cursor-not-allowed"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className={`rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-2.5 h-2.5 bg-white"
                    : "w-2 h-2 bg-white/60 group-hover:bg-white/80 group-hover:w-2.5 group-hover:h-2.5"
                }`}
              ></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero2;
