import React, { useRef, useState, useEffect, useCallback } from "react";
import { getComponent } from "@/lib/component-registry";

interface Product {
  id: number;
  name: string;
  slug?: string;
  product_code?: string;
  price: number;
  old_price?: number | null;
  image_url: string;
  images?: string[];
  brand?: string;
  short_description?: string;
  average_rating?: number;
  total_reviews?: number;
  review_summary?: {
    average_rating: number;
    total_reviews: number;
  };
}

interface RelatedProducts1Props {
  settings?: {
    title?: string;
    columns?: number;
    mobileColumns?: number;
    tabletColumns?: number;
    gap?: "sm" | "md" | "lg";
    cardDesign?: string;
    limit?: number;
  };
  products: Product[];
  currency?: string;
}

const RelatedProducts1: React.FC<RelatedProducts1Props> = ({
  settings = {},
  products = [],
  currency = "৳",
}) => {
  const {
    title = "You May Also Like",
    columns = 4,
    mobileColumns = 2,
    tabletColumns = 3,
    gap = "md",
    cardDesign = "card-1",
    limit = 8,
  } = settings;

  // Gap classes
  const gapClasses = {
    sm: "gap-3 sm:gap-4",
    md: "gap-4 sm:gap-5 lg:gap-6",
    lg: "gap-5 sm:gap-6 lg:gap-8",
  };

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check scroll position
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
  }, [checkScroll, products]);

  const scrollTo = useCallback((direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.85;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  // Auto-play functionality
  const startAutoPlay = useCallback(() => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
    }

    autoPlayIntervalRef.current = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 10;

        if (isAtEnd) {
          // Reset to beginning
          carouselRef.current.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          // Scroll to next (85% of viewport width)
          const scrollAmount = clientWidth * 0.85;
          carouselRef.current.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
          });
        }
      }
    }, 3000); // Auto-scroll every 3 seconds
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
    if (isAutoPlaying) {
      startAutoPlay();
    }
    return () => {
      stopAutoPlay();
    };
  }, [isAutoPlaying, startAutoPlay, stopAutoPlay]);

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

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
    carouselRef.current.style.cursor = "grabbing";
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = "grab";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  if (!products || products.length === 0) {
    return null;
  }

  const displayedProducts = products.slice(0, limit);
  // Convert cardDesign format (e.g., 'card-1') to component registry format (e.g., 'product-card-1')
  const cardComponentName = cardDesign.startsWith('card-')
    ? `product-${cardDesign}`
    : cardDesign;
  const ProductCard = getComponent(cardComponentName);

  // Calculate responsive card width based on columns for different breakpoints
  const getCardWidth = () => {
    const mobileWidthMap: Record<number, string> = {
      1: "w-full",
      2: "w-[calc(50%-8px)]",
      3: "w-[calc(33.333%-11px)]",
    };

    const tabletWidthMap: Record<number, string> = {
      1: "sm:w-full",
      2: "sm:w-[calc(50%-10px)]",
      3: "sm:w-[calc(33.333%-14px)]",
    };

    const desktopWidthMap: Record<number, string> = {
      1: "lg:w-full",
      2: "lg:w-[calc(50%-12px)]",
      3: "lg:w-[calc(33.333%-16px)]",
      4: "lg:w-[calc(25%-14px)]",
      5: "lg:w-[calc(20%-16px)]",
      6: "lg:w-[calc(16.666%-15px)]",
    };

    const mobileWidth = mobileWidthMap[mobileColumns] || "w-[calc(50%-8px)]";
    const tabletWidth = tabletWidthMap[tabletColumns] || "sm:w-[calc(33.333%-14px)]";
    const desktopWidth = desktopWidthMap[columns] || "lg:w-[calc(25%-18px)]";

    return `${mobileWidth} ${tabletWidth} ${desktopWidth}`;
  };

  const mapProductToCardProps = (product: Product) => {
    let badge: string | undefined;
    if (product.old_price && product.old_price > product.price) {
      const discount = Math.round(
        ((product.old_price - product.price) / product.old_price) * 100
      );
      badge = `${discount}% OFF`;
    }

    // Get rating from review_summary or direct fields
    const rating = product.review_summary?.average_rating || product.average_rating;
    const reviewCount = product.review_summary?.total_reviews || product.total_reviews;

    return {
      id: product.id,
      handle: product.slug || product.product_code?.toLowerCase() || String(product.id),
      title: product.name,
      subtitle: product.short_description,
      vendor: product.brand,
      price: product.price,
      comparePrice: product.old_price,
      currency: currency,
      image: product.image_url,
      hoverImage: product.images?.[1],
      badge: badge,
      badgeColor: "#F55157",
      rating: rating,
      reviewCount: reviewCount,
      quickAddEnabled: true,
    };
  };

  const totalSlides = Math.ceil(displayedProducts.length / columns);

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleAutoPlay}
              className="w-10 h-10 rounded-full border-2 border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900 flex items-center justify-center transition-all"
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
            <button
              onClick={() => scrollTo("left")}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
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
            <button
              onClick={() => scrollTo("right")}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
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
        </div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            handleMouseUp();
            handleMouseLeave();
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          className={`flex overflow-x-auto ${gapClasses[gap]} snap-x snap-mandatory scrollbar-hide pb-2 cursor-grab select-none`}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {displayedProducts.map((product) => (
            <a
              key={product.id}
              href={`/products/${product.slug || product.product_code?.toLowerCase() || product.id}`}
              className={`group block shrink-0 p-0.5 ${getCardWidth()} snap-start min-w-[140px] sm:min-w-[180px] lg:min-w-[200px]`}
              draggable="false"
            >
              {ProductCard ? (
                <ProductCard {...mapProductToCardProps(product)} />
              ) : (
                <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-gray-900 transition-all overflow-hidden h-full">
                  <div className="aspect-square bg-gray-50 overflow-hidden relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      draggable="false"
                    />
                    {product.old_price && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-600 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-semibold">
                        -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 sm:p-3 lg:p-4">
                    <h3 className="font-medium text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 text-xs sm:text-sm leading-tight">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <span className="text-sm sm:text-base font-bold text-gray-900">
                        {currency}{product.price?.toLocaleString()}
                      </span>
                      {product.old_price && (
                        <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                          {currency}{product.old_price?.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {(product.review_summary?.average_rating || product.average_rating) && (
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const rating = product.review_summary?.average_rating || product.average_rating || 0;
                            return (
                              <svg
                                key={i}
                                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 ${
                                  i < Math.floor(rating) ? "text-gray-900" : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            );
                          })}
                        </div>
                        <span className="text-[10px] sm:text-xs text-gray-600">
                          ({product.review_summary?.total_reviews || product.total_reviews || 0})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </a>
          ))}
        </div>

        {/* Progress Dots - Shopify Style */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
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

      {/* Hide Scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default RelatedProducts1;
