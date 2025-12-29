"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FallbackImage } from "@/components/ui/fallback-image";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import { useLandingProduct } from "../../../context/landing-product-context";
import type { ContentInterface } from "@/types/landing-page.types";

interface GripTopCarouselProps {
  content: ContentInterface[] | null | undefined;
  onBuyNow?: (link: string | null) => void;
}

export function GripTopCarousel({ content, onBuyNow }: GripTopCarouselProps) {
  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  // Hooks
  const { product, scrollToCheckout } = useLandingProduct();

  // Computed values
  const totalImages = content?.length ?? 1;
  const currentSlide = content?.[currentIndex];

  // Carousel navigation
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-slide effect
  useEffect(() => {
    if (totalImages <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalImages);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalImages]);

  // Button action handler
  const handleButtonAction = (link: string | undefined | null) => {
    if (link === "buy-now") {
      // Handle products with variants
      if (product?.has_variant && product?.variant_types && product.variant_types.length > 1) {
        setIsVariantModalOpen(true);
        return;
      }

      // Scroll to checkout form
      scrollToCheckout();
    } else if (link) {
      // Handle external links
      onBuyNow?.(link);
    }
  };

  // Handle variant selection complete
  const handleVariantSelect = () => {
    setIsVariantModalOpen(false);
    scrollToCheckout();
  };

  // Early return
  if (!content || content.length === 0) return null;

  return (
    <div className="relative overflow-hidden pb-10 md:pb-16 lg:pb-24 xl:pb-28">
      {/* Product Modifier Modal */}
      {product && (
        <VariantSelectorModal
          isOpen={isVariantModalOpen}
          onClose={() => setIsVariantModalOpen(false)}
          product={product as unknown as Parameters<typeof VariantSelectorModal>[0]["product"]}
          onAddToCart={handleVariantSelect}
        />
      )}

      {/* Carousel Container */}
      <div className="relative h-[160px] sm:h-[240px] md:h-[287px] lg:h-[385px] xl:h-[500px] 2xl:h-[580px] overflow-hidden">
        {/* Current Slide Image */}
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          key={currentIndex}
        >
          {currentSlide?.image_url && (
            <FallbackImage
              src={currentSlide.image_url}
              alt={currentSlide?.title || "Carousel Image"}
              width={1920}
              height={717}
              className="h-full w-full object-cover"
              priority
            />
          )}
          {/* Text Readability Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-lg xl:max-w-xl 2xl:max-w-2xl">
              {/* Title */}
              {currentSlide?.title && (
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-[120px] font-bold text-blue-zatiq leading-tight mb-6">
                  {currentSlide.title}
                </h1>
              )}

              {/* Description */}
              {currentSlide?.description && (
                <p className="text-lg md:text-xl text-grip-gray dark:text-gray-300 mb-8 leading-relaxed">
                  {currentSlide.description}
                </p>
              )}

              {/* Call-to-Action Button */}
              {currentSlide?.button_text && (
                <button
                  onClick={() => handleButtonAction(currentSlide.link)}
                  className="inline-flex items-center bg-white text-grip-black px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-200 border border-gray-200 cursor-pointer text-sm md:text-base"
                >
                  {currentSlide.button_text}
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Controls (only show if multiple slides) */}
        {totalImages > 1 && (
          <>
            {/* Previous/Next Arrow Buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Slide Indicator Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {content.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GripTopCarousel;
