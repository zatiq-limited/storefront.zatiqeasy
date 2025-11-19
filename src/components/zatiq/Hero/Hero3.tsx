import React, { useState, useEffect, useCallback } from "react";

// Carousel slide data structure
interface HeroSlide {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  imageAlt: string;
}

// Hero slides data with online images (1440x558px)
const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Best Discounts 2025",
    description:
      "Salla Store provides you with everything you need, from electronics to home furniture, along with the best discounts on products. Shop now and enjoy all the discounts on products.",
    buttonText: "Discover more",
    buttonLink: "/collections/discounts",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1440&h=558&fit=crop&q=80",
    imageAlt: "Shopping store with best discounts",
  },
  {
    id: 2,
    title: "Electronics Mega Sale",
    description:
      "Upgrade your tech with our exclusive electronics collection. From smartphones to laptops, find cutting-edge technology at unbeatable prices. Limited time offers available.",
    buttonText: "Shop Electronics",
    buttonLink: "/collections/electronics",
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1440&h=558&fit=crop&q=80",
    imageAlt: "Electronics collection on sale",
  },
  {
    id: 3,
    title: "Home Furniture Deals",
    description:
      "Transform your living space with our premium furniture collection. Discover stylish and comfortable pieces that perfectly blend functionality with modern design aesthetics.",
    buttonText: "Browse Furniture",
    buttonLink: "/collections/furniture",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1440&h=558&fit=crop&q=80",
    imageAlt: "Modern home furniture collection",
  },
  {
    id: 4,
    title: "Fashion Essentials",
    description:
      "Elevate your wardrobe with our curated fashion collection. From casual wear to elegant outfits, find everything you need to express your unique style at amazing prices.",
    buttonText: "Explore Fashion",
    buttonLink: "/collections/fashion",
    imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1440&h=558&fit=crop&q=80",
    imageAlt: "Fashion clothing collection",
  },
];

const Hero3: React.FC = () => {
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
        className="relative w-full max-w-[1440px] min-h-[480px] sm:min-h-[558px] mx-auto bg-[#1F2937] overflow-hidden group"
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
                alt={slide.imageAlt}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>

            <div className="relative px-4 md:px-6 xl:px-[200px] py-16 md:py-[136px]">
              {/* Content Section with Navigation Arrows */}
              <div className="flex items-center justify-center gap-6 md:gap-10 lg:gap-24">
                {/* Left Arrow */}
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
              </div>
            </div>
          </div>
        ))}

        {/* Slider Indicators */}
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
      </div>
    </div>
  );
};

export default Hero3;
