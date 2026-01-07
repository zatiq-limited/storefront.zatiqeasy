/**
 * Related Products 2
 * Professional carousel with subtitle and enhanced styling
 * Matches merchant panel design exactly - hover to show controls
 * Fetches from store if API products not available (like static themes)
 * Limited to 10 products maximum
 * Supports 16 different card designs via cardDesign setting
 */

"use client";

import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { convertSettingsKeys } from "@/lib/settings-utils";
import { useProductsStore, type Product } from "@/stores/productsStore";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";

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

interface RelatedProducts2Props {
  settings?: Record<string, unknown>;
  product: Product;
  apiProducts?: Product[];
}

interface RelatedProducts2Settings {
  title?: string;
  subtitle?: string;
  cardDesign?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  showNavigation?: boolean;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  accentColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  priceColor?: string;
  oldPriceColor?: string;
  badgeColor?: string;
  sectionBgColor?: string;
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

export default function RelatedProducts2({
  settings = {},
  product,
  apiProducts = [],
}: RelatedProducts2Props) {
  const s = convertSettingsKeys<RelatedProducts2Settings>(settings);
  const carouselRef = useRef<HTMLDivElement>(null);
  const allProducts = useProductsStore((state) => state.products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Carousel state
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================
  // SETTINGS WITH DEFAULTS
  // ============================================

  const title = s.title || "You May Also Like";
  const subtitle = s.subtitle || "Discover more products you'll love";
  const cardDesign = s.cardDesign || "card-1";
  const showViewAll = s.showViewAll !== false;
  const viewAllLink = s.viewAllLink || "/products";
  const autoPlay = s.autoPlay !== false;

  // Colors
  const accentColor = s.accentColor || "#7C3AED";
  const titleColor = s.titleColor || "#111827";
  const subtitleColor = s.subtitleColor || "#6B7280";
  const priceColor = s.priceColor || "#7C3AED";
  const oldPriceColor = s.oldPriceColor || "#9CA3AF";
  const badgeColor = s.badgeColor || "#DC2626";
  const sectionBgColor = s.sectionBgColor || "#F9FAFB";
  const buttonBgColor = s.buttonBgColor || "#7C3AED";
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
      
      // Calculate active slide
      const slideIndex = Math.round(scrollLeft / (clientWidth * 0.9));
      setActiveSlide(slideIndex);
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
      const scrollAmount = carouselRef.current.clientWidth * 0.9;
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
          const scrollAmount = clientWidth * 0.9;
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
    <section
      className="py-8 sm:py-12 md:py-16"
      style={{ backgroundColor: sectionBgColor }}
    >
      {/* Variant Selector Modal */}
      <VariantSelectorModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <div className="container mx-auto px-4 2xl:px-0">
        {/* Header - Centered like merchant panel */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h2
            className="text-xl sm:text-2xl md:text-4xl font-bold mb-2"
            style={{ color: titleColor }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className="text-sm sm:text-base md:text-lg"
              style={{ color: subtitleColor }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Carousel Container with hover controls */}
        <div
          className="relative group"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Previous Button - hidden by default, show on hover */}
          <button
            onClick={() => scrollTo("left")}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-gray-200 hidden md:flex items-center justify-center transition-all duration-300 ${
              canScrollLeft
                ? "opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-xl"
                : "opacity-0 cursor-not-allowed"
            }`}
            style={{ borderColor: canScrollLeft ? accentColor : undefined }}
            aria-label="Previous products"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Play/Pause Button - hidden by default, show on hover */}
          {autoPlay && (
            <button
              onClick={toggleAutoPlay}
              className="absolute top-2 right-2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              style={{ borderColor: isAutoPlaying ? accentColor : undefined }}
              aria-label={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
            >
              {isAutoPlaying ? (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          )}

          {/* Products Carousel */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto gap-4 sm:gap-5 md:gap-6 snap-x snap-mandatory pb-4 cursor-grab active:cursor-grabbing select-none scrollbar-hide"
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

          {/* Next Button - hidden by default, show on hover */}
          <button
            onClick={() => scrollTo("right")}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-gray-200 hidden md:flex items-center justify-center transition-all duration-300 ${
              canScrollRight
                ? "opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-xl"
                : "opacity-0 cursor-not-allowed"
            }`}
            style={{ borderColor: canScrollRight ? accentColor : undefined }}
            aria-label="Next products"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Scroll Indicators */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-2 mt-4 sm:mt-6 md:mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (carouselRef.current) {
                    const scrollAmount = carouselRef.current.clientWidth * 0.9 * index;
                    carouselRef.current.scrollTo({
                      left: scrollAmount,
                      behavior: "smooth",
                    });
                  }
                }}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: activeSlide === index ? "32px" : "8px",
                  backgroundColor: activeSlide === index ? accentColor : "#E5E7EB",
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        {showViewAll && (
          <div className="text-center mt-6 sm:mt-8 md:mt-12">
            <Link
              href={viewAllLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
              style={{ backgroundColor: accentColor }}
            >
              View All Products
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
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
