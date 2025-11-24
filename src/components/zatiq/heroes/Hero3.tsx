import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

// Carousel slide data structure (internal)
interface HeroSlide {
  id: string | number;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  imageAlt?: string;
}

// Slide from homepage.json (snake_case)
interface SlideInput {
  title?: string;
  heading?: string;
  description?: string;
  button_text?: string;
  button_link?: string;
  image?: string;
  // Also support camelCase
  buttonText?: string;
  buttonLink?: string;
  imageUrl?: string;
}

// Component props interface
interface Hero3Props {
  settings?: {
    autoPlay?: boolean;
    autoPlaySpeed?: number;
    auto_advance?: boolean;
    advance_interval?: number;
    showArrows?: boolean;
    showIndicators?: boolean;
    slides?: SlideInput[];
  };
  blocks?: HeroSlide[];
  // Direct props spread from ComponentRenderer
  slides?: SlideInput[];
  auto_advance?: boolean;
  advance_interval?: number;
  height?: string;
}

const Hero3: React.FC<Hero3Props> = ({
  settings = {},
  blocks = [],
  slides: directSlides,
  auto_advance,
  advance_interval,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get slides from: blocks > direct slides prop > settings.slides
  const rawSlides =
    blocks.length > 0 ? blocks : directSlides || settings?.slides || [];

  // Transform slides to expected format (handle snake_case from theme builder)
  const heroSlides: HeroSlide[] = rawSlides.map(
    (slide: SlideInput, index: number) => ({
      id: index,
      title: slide.title || slide.heading || "",
      description: slide.description || "",
      buttonText: slide.button_text || slide.buttonText || "Shop now",
      buttonLink: slide.button_link || slide.buttonLink || "#",
      imageUrl: slide.image || slide.imageUrl || "",
      imageAlt: slide.title || slide.heading || "Hero image",
    })
  );

  const totalSlides = heroSlides.length;

  // Settings with defaults (support both camelCase and snake_case)
  const autoPlay =
    settings?.autoPlay !== false &&
    (settings?.auto_advance ?? auto_advance) !== false;
  const autoPlaySpeed = Number(
    settings?.advance_interval || advance_interval || settings?.autoPlaySpeed || 5000
  );
  const showArrows = settings?.showArrows !== false;
  const showIndicators = settings?.showIndicators !== false;

  // Autoplay plugin
  const autoplayPlugin = useMemo(
    () =>
      Autoplay({
        delay: autoPlaySpeed,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    [autoPlaySpeed]
  );

  // Handle carousel API
  useEffect(() => {
    if (!api) return;

    setCurrentSlide(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  // Handle next slide
  const handleNext = useCallback(() => {
    if (!api) return;
    api.scrollNext();
  }, [api]);

  // Handle previous slide
  const handlePrev = useCallback(() => {
    if (!api) return;
    api.scrollPrev();
  }, [api]);

  // Handle dot click
  const handleDotClick = useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
    },
    [api]
  );

  // Return null if no slides
  if (totalSlides === 0) {
    return null;
  }

  return (
    <div className="w-full pb-8 sm:pb-14 py-0">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          align: "start",
        }}
        plugins={autoPlay ? [autoplayPlugin] : []}
        className="relative w-full min-h-[480px] sm:min-h-[558px] bg-[#1F2937] overflow-hidden group"
      >
        <CarouselContent className="ml-0 h-full">
          {heroSlides.map((slide, index) => (
            <CarouselItem key={slide.id} className="pl-0 h-full">
              <div className="relative w-full min-h-[480px] sm:min-h-[558px]">
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
                        className="hidden sm:flex items-center justify-center w-[60px] h-[60px] rounded-[30px] border border-[#EEEEEE] hover:bg-[#3465F0] transition-all shrink-0 lg:opacity-0 lg:group-hover:opacity-100"
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
                        className="hidden sm:flex items-center justify-center w-[60px] h-[60px] rounded-[30px] border border-[#EEEEEE] hover:bg-[#3465F0] transition-all shrink-0 lg:opacity-0 lg:group-hover:opacity-100"
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
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Slider Indicators */}
        {showIndicators && totalSlides > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-1.5 z-20">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => handleDotClick(index)}
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
      </Carousel>
    </div>
  );
};

export default Hero3;
