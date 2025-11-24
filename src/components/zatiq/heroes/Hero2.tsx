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
  badge: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  imageAlt?: string;
  overlayOpacity: number;
}

// Slide from homepage.json (snake_case)
interface SlideInput {
  badge?: string;
  heading?: string;
  title?: string;
  description?: string;
  button_text?: string;
  button_link?: string;
  image?: string;
  overlay_opacity?: number;
  // Also support camelCase
  buttonText?: string;
  buttonLink?: string;
  imageUrl?: string;
  overlayOpacity?: string;
}

// Component props interface
interface Hero2Props {
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

const Hero2: React.FC<Hero2Props> = ({
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
      badge: slide.badge || "",
      heading: slide.heading || slide.title || "",
      description: slide.description || "",
      buttonText: slide.button_text || slide.buttonText || "Shop now",
      buttonLink: slide.button_link || slide.buttonLink || "#",
      imageUrl: slide.image || slide.imageUrl || "",
      imageAlt: slide.heading || slide.title || "Hero image",
      overlayOpacity: slide.overlay_opacity ?? 20,
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
        className="font-segoe relative w-full h-[580px] sm:h-[716px] overflow-hidden group"
      >
        <CarouselContent className="ml-0 h-full">
          {heroSlides.map((slide, index) => (
            <CarouselItem key={slide.id} className="pl-0 h-full">
              <div className="relative w-full h-[580px] sm:h-[716px]">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                  <img
                    src={slide.imageUrl}
                    alt={slide.imageAlt || slide.heading}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  {/* Dark Overlay */}
                  <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: slide.overlayOpacity / 100 }}
                  ></div>
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
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        {showArrows && totalSlides > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8 lg:px-12 z-20 pointer-events-none">
            {/* Previous Button */}
            <button
              onClick={handlePrev}
              className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 lg:opacity-0 lg:group-hover:opacity-100"
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
              className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 lg:opacity-0 lg:group-hover:opacity-100"
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
        )}

        {/* Carousel Indicators - 32px from bottom */}
        {showIndicators && totalSlides > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => handleDotClick(index)}
                className="w-5 h-5 flex items-center justify-center group"
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
        )}
      </Carousel>
    </div>
  );
};

export default Hero2;
