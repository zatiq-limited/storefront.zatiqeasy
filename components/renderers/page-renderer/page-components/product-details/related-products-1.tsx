/**
 * Related Products 1
 * Professional carousel layout with custom scroll
 * Matches merchant panel design - buttons in header
 * Fetches from store if API products not available (like static themes)
 * Limited to 10 products maximum
 * Supports 16 different card designs via cardDesign setting
 */

"use client";

import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import { convertSettingsKeys } from "@/lib/settings-utils";
import { useProductsStore, type Product } from "@/stores/productsStore";

// Import all 16 product card components
import ProductCard1 from "../products/product-cards/product-card-1";
import ProductCard2 from "../products/product-cards/product-card-2";
import ProductCard3 from "../products/product-cards/product-card-3";
import ProductCard4 from "../products/product-cards/product-card-4";
import ProductCard5 from "../products/product-cards/product-card-5";
import ProductCard6 from "../products/product-cards/product-card-6";
import ProductCard7 from "../products/product-cards/product-card-7";
import ProductCard8 from "../products/product-cards/product-card-8";
import ProductCard9 from "../products/product-cards/product-card-9";
import ProductCard10 from "../products/product-cards/product-card-10";
import ProductCard11 from "../products/product-cards/product-card-11";
import ProductCard12 from "../products/product-cards/product-card-12";
import ProductCard13 from "../products/product-cards/product-card-13";
import ProductCard14 from "../products/product-cards/product-card-14";
import ProductCard15 from "../products/product-cards/product-card-15";
import ProductCard16 from "../products/product-cards/product-card-16";

// ============================================
// TYPES & INTERFACES
// ============================================

interface RelatedProducts1Props {
  settings?: Record<string, unknown>;
  product: Product;
  apiProducts?: Product[];
}

interface RelatedProducts1Settings {
  title?: string;
  cardDesign?: string;
  showNavigation?: boolean;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  titleColor?: string;
  priceColor?: string;
  oldPriceColor?: string;
  badgeColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

// ============================================
// CONSTANTS
// ============================================

const MAX_RELATED_PRODUCTS = 10;
const DEFAULT_AUTOPLAY_DELAY = 3000;

// ============================================
// COMPONENT
// ============================================

export default function RelatedProducts1({
  settings = {},
  product,
  apiProducts = [],
}: RelatedProducts1Props) {
  const s = convertSettingsKeys<RelatedProducts1Settings>(settings);
  const carouselRef = useRef<HTMLDivElement>(null);
  const allProducts = useProductsStore((state) => state.products);
  
  // Carousel state
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================
  // SETTINGS WITH DEFAULTS
  // ============================================

  const title = s.title || "Related Products";
  const cardDesign = s.cardDesign || "card-1";
  const showNavigation = s.showNavigation !== false;
  const autoPlay = s.autoPlay !== false;

  // Colors
  const titleColor = s.titleColor || "#111827";
  const priceColor = s.priceColor || "#7C3AED";
  const oldPriceColor = s.oldPriceColor || "#9CA3AF";
  const badgeColor = s.badgeColor || "#DC2626";
  const buttonBgColor = s.buttonBgColor || "#111827";
  const buttonTextColor = s.buttonTextColor || "#FFFFFF";

  // ============================================
  // GET RELATED PRODUCTS (PROFESSIONAL LOGIC)
  // ============================================

  const relatedProducts = useMemo(() => {
    // Priority 1: Use API products if available
    if (apiProducts && apiProducts.length > 0) {
      return apiProducts.slice(0, MAX_RELATED_PRODUCTS);
    }

    // Priority 2: Compute from store based on categories
    const categoryIds = product.categories?.map((c) => c.id) || [];

    if (categoryIds.length === 0) {
      // No categories - return random products excluding current
      return allProducts
        .filter((p) => p.id !== product.id)
        .slice(0, MAX_RELATED_PRODUCTS);
    }

    // Find products with matching categories
    const matchingProducts = allProducts.filter(
      (p) =>
        p.id !== product.id &&
        p.categories?.some((c) => categoryIds.includes(c.id))
    );

    // Sort by number of matching categories (more matches = higher priority)
    matchingProducts.sort((a, b) => {
      const aMatches =
        a.categories?.filter((c) => categoryIds.includes(c.id)).length || 0;
      const bMatches =
        b.categories?.filter((c) => categoryIds.includes(c.id)).length || 0;
      return bMatches - aMatches;
    });

    // If we have enough matching products, return them
    if (matchingProducts.length >= MAX_RELATED_PRODUCTS) {
      return matchingProducts.slice(0, MAX_RELATED_PRODUCTS);
    }

    // Fill remaining slots with other products
    const remainingProducts = allProducts.filter(
      (p) =>
        p.id !== product.id && !matchingProducts.some((mp) => mp.id === p.id)
    );

    return [...matchingProducts, ...remainingProducts].slice(
      0,
      MAX_RELATED_PRODUCTS
    );
  }, [product, allProducts, apiProducts]);

  // ============================================
  // SCROLL HANDLING
  // ============================================

  const checkScroll = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      
      // Calculate current index
      const index = Math.round(scrollLeft / (clientWidth * 0.85));
      setCurrentIndex(index);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        carousel.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [checkScroll, relatedProducts]);

  const scrollTo = useCallback((direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.85;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  // ============================================
  // AUTOPLAY HANDLING
  // ============================================

  const startAutoPlay = useCallback(() => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
    }

    autoPlayIntervalRef.current = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 10;

        if (isAtEnd) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          const scrollAmount = clientWidth * 0.85;
          carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }
    }, DEFAULT_AUTOPLAY_DELAY);
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }
  }, []);

  const toggleAutoPlay = useCallback(() => {
    if (isAutoPlaying) {
      stopAutoPlay();
      setIsAutoPlaying(false);
    } else {
      startAutoPlay();
      setIsAutoPlaying(true);
    }
  }, [isAutoPlaying, startAutoPlay, stopAutoPlay]);

  // Start autoplay on mount
  useEffect(() => {
    if (autoPlay && isAutoPlaying) {
      startAutoPlay();
    }
    return () => {
      stopAutoPlay();
    };
  }, [autoPlay, isAutoPlaying, startAutoPlay, stopAutoPlay]);

  // Pause autoplay on hover
  const handleMouseEnter = () => {
    if (isAutoPlaying) {
      stopAutoPlay();
    }
  };

  const handleMouseLeave = () => {
    if (isAutoPlaying) {
      startAutoPlay();
    }
  };

  // ============================================
  // RENDER HELPERS
  // ============================================

  const renderProductCard = (relatedProduct: Product) => {
    const discount =
      relatedProduct.old_price && relatedProduct.old_price > relatedProduct.price
        ? Math.round(
            ((relatedProduct.old_price - relatedProduct.price) /
              relatedProduct.old_price) *
              100
          )
        : null;

    // Use image_url or images array, with proper fallback
    const productImage = relatedProduct.image_url || 
      (relatedProduct.images && relatedProduct.images.length > 0 ? relatedProduct.images[0] : "") || 
      "/placeholder.jpg";

    const cardProps = {
      id: relatedProduct.id,
      handle: String(relatedProduct.id),
      title: relatedProduct.name,
      subtitle: relatedProduct.categories?.[0]?.name,
      vendor: relatedProduct.categories?.[0]?.name,
      price: relatedProduct.price,
      comparePrice: relatedProduct.old_price,
      currency: "BDT",
      image: productImage,
      badge: discount ? `-${discount}%` : null,
      rating: relatedProduct.review_summary?.average_rating || 0,
      reviewCount: relatedProduct.review_summary?.total_reviews || 0,
      buttonBgColor,
      buttonTextColor,
      priceColor,
      oldPriceColor,
      badgeColor,
    };

    switch (cardDesign) {
      case "card-1":
      default:
        return <ProductCard1 {...cardProps} />;
      case "card-2":
        return <ProductCard2 {...cardProps} />;
      case "card-3":
        return <ProductCard3 {...cardProps} />;
      case "card-4":
        return <ProductCard4 {...cardProps} />;
      case "card-5":
        return <ProductCard5 {...cardProps} />;
      case "card-6":
        return <ProductCard6 {...cardProps} />;
      case "card-7":
        return <ProductCard7 {...cardProps} />;
      case "card-8":
        return <ProductCard8 {...cardProps} />;
      case "card-9":
        return <ProductCard9 {...cardProps} />;
      case "card-10":
        return <ProductCard10 {...cardProps} />;
      case "card-11":
        return <ProductCard11 {...cardProps} />;
      case "card-12":
        return <ProductCard12 {...cardProps} />;
      case "card-13":
        return <ProductCard13 {...cardProps} />;
      case "card-14":
        return <ProductCard14 {...cardProps} />;
      case "card-15":
        return <ProductCard15 {...cardProps} />;
      case "card-16":
        return <ProductCard16 {...cardProps} />;
    }
  };

  // Calculate total slides
  const totalSlides = Math.ceil(relatedProducts.length / 4);

  // ============================================
  // EARLY RETURN IF NO PRODUCTS
  // ============================================

  if (relatedProducts.length === 0) {
    return null;
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <section className="py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4 2xl:px-0">
        {/* Section Header with Navigation in header (like merchant panel) */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-bold"
            style={{ color: titleColor }}
          >
            {title}
          </h2>

          {/* Navigation Buttons - in header like merchant panel */}
          {showNavigation && relatedProducts.length > 4 && (
            <div className="hidden md:flex items-center gap-3">
              {/* Pause/Play Button */}
              {autoPlay && (
                <button
                  onClick={toggleAutoPlay}
                  className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-full text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-all"
                  aria-label={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
                >
                  {isAutoPlaying ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              )}
              {/* Previous Button */}
              <button
                onClick={() => scrollTo("left")}
                disabled={!canScrollLeft}
                className={`w-10 h-10 flex items-center justify-center border-2 rounded-full transition-all ${
                  canScrollLeft
                    ? "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                    : "border-gray-200 text-gray-300 cursor-not-allowed"
                }`}
                aria-label="Previous products"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {/* Next Button */}
              <button
                onClick={() => scrollTo("right")}
                disabled={!canScrollRight}
                className={`w-10 h-10 flex items-center justify-center border-2 rounded-full transition-all ${
                  canScrollRight
                    ? "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                    : "border-gray-200 text-gray-300 cursor-not-allowed"
                }`}
                aria-label="Next products"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Products Carousel */}
        <div
          ref={carouselRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="flex overflow-x-auto gap-4 sm:gap-5 md:gap-6 snap-x snap-mandatory pb-2 cursor-grab active:cursor-grabbing select-none scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {relatedProducts.map((relatedProduct) => (
            <div
              key={relatedProduct.id}
              className="shrink-0 w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-13px)] min-w-[140px] sm:min-w-[180px] md:min-w-[200px] snap-start"
            >
              {renderProductCard(relatedProduct)}
            </div>
          ))}
        </div>

        {/* Progress Dots */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-5 md:mt-6">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (carouselRef.current) {
                    const scrollAmount = carouselRef.current.clientWidth * 0.85 * index;
                    carouselRef.current.scrollTo({
                      left: scrollAmount,
                      behavior: "smooth",
                    });
                  }
                }}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === index ? "w-6 bg-gray-900" : "w-1.5 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
