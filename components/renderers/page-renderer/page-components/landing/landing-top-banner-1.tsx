/**
 * Landing Top Banner 1
 * Full-width carousel banner with CTA buttons for landing pages
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface LandingSlide {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

interface LandingTopBanner1Settings {
  slides?: LandingSlide[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  height?: "small" | "medium" | "large" | "full";
  fontFamily?: string;
  viewMode?: "desktop" | "tablet" | "mobile" | null;
}

interface LandingTopBanner1Props {
  settings: LandingTopBanner1Settings;
  onScrollToCheckout?: () => void;
}

const defaultSlides: LandingSlide[] = [
  {
    title: "Premium Quality Product",
    subtitle: "Limited Time Offer",
    description: "Get the best deal on our exclusive product. Order now!",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1440&h=600&fit=crop",
    buttonText: "Order Now",
    buttonLink: "checkout",
    backgroundColor: "#000000",
    textColor: "#FFFFFF",
    buttonBgColor: "#DC2626",
    buttonTextColor: "#FFFFFF",
  },
];

const heightMap = {
  small: "h-[300px]",
  medium: "h-[450px]",
  large: "h-[600px]",
  full: "min-h-screen",
};

export default function LandingTopBanner1({
  settings,
  onScrollToCheckout,
}: LandingTopBanner1Props) {
  const {
    slides = defaultSlides,
    autoPlay = true,
    interval = 5000,
    showDots = true,
    showArrows = true,
    height = "medium",
    fontFamily = "inherit",
  } = settings;

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, nextSlide, slides.length]);

  const handleButtonClick = (buttonLink?: string) => {
    if (buttonLink === "checkout" && onScrollToCheckout) {
      onScrollToCheckout();
    } else if (buttonLink && buttonLink.startsWith("http")) {
      window.open(buttonLink, "_blank");
    } else if (buttonLink) {
      const element = document.getElementById(buttonLink);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  if (!slides.length) return null;

  const heightClass = heightMap[height] || heightMap.medium;

  return (
    <div
      className={`relative w-full ${heightClass} overflow-hidden`}
      style={{ fontFamily }}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="min-w-full h-full relative flex items-center justify-center"
            style={{ backgroundColor: slide.backgroundColor || "#000000" }}
          >
            {/* Background Image */}
            {slide.image && (
              <Image
                src={slide.image}
                alt={slide.title || `Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div
              className="relative z-10 text-center px-4 max-w-4xl mx-auto"
              style={{ color: slide.textColor || "#FFFFFF" }}
            >
              {slide.subtitle && (
                <p className="text-sm md:text-lg mb-2 uppercase tracking-wider opacity-90">
                  {slide.subtitle}
                </p>
              )}
              {slide.title && (
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
                  {slide.title}
                </h1>
              )}
              {slide.description && (
                <p className="text-base md:text-xl mb-6 max-w-2xl mx-auto opacity-90">
                  {slide.description}
                </p>
              )}
              {slide.buttonText && (
                <button
                  onClick={() => handleButtonClick(slide.buttonLink)}
                  className="px-8 py-3 text-lg font-semibold rounded-lg transition-all hover:scale-105 hover:shadow-lg"
                  style={{
                    backgroundColor: slide.buttonBgColor || "#DC2626",
                    color: slide.buttonTextColor || "#FFFFFF",
                  }}
                >
                  {slide.buttonText}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors text-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors text-white"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
