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

interface RelatedProducts2Props {
  settings?: {
    title?: string;
    subtitle?: string;
    columns?: number;
    cardStyle?: string;
    limit?: number;
  };
  products: Product[];
  currency?: string;
}

const RelatedProducts2: React.FC<RelatedProducts2Props> = ({
  settings = {},
  products = [],
  currency = "৳",
}) => {
  const {
    title = "You May Also Like",
    subtitle = "Discover more products you'll love",
    columns = 4,
    cardStyle = "product-card-1",
    limit = 8,
  } = settings;

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check scroll position to enable/disable navigation buttons
  const checkScroll = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      // Calculate active slide based on viewport width
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
  }, [checkScroll, products]);

  const scrollTo = useCallback((direction: "left" | "right") => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const scrollAmount = container.clientWidth * 0.9; // Scroll ~90% of viewport width

      container.scrollBy({
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
          // Scroll to next (90% of viewport width)
          const scrollAmount = clientWidth * 0.9;
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

  // Mouse drag to scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  if (!products || products.length === 0) {
    return null;
  }

  const displayedProducts = products.slice(0, limit);
  const ProductCard = getComponent(cardStyle);

  // Calculate card width based on columns
  const getCardWidth = () => {
    const widthMap: Record<number, string> = {
      1: "w-full",
      2: "w-[calc(50%-12px)]",
      3: "w-[calc(33.333%-16px)]",
      4: "w-[calc(25%-18px)]",
      5: "w-[calc(20%-19.2px)]",
      6: "w-[calc(16.666%-20px)]",
    };
    return widthMap[columns] || "w-[calc(25%-18px)]";
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
      badgeColor: "#7C3AED",
      rating: rating,
      reviewCount: reviewCount,
      quickAddEnabled: true,
    };
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{title}</h2>
          {subtitle && <p className="text-gray-500 text-lg">{subtitle}</p>}
        </div>

        {/* Carousel Container */}
        <div
          className="relative group"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Previous Button */}
          <button
            onClick={() => scrollTo("left")}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 ${
              canScrollLeft
                ? "opacity-0 group-hover:opacity-100 hover:scale-110 hover:border-purple-300 hover:shadow-xl"
                : "opacity-0 cursor-not-allowed"
            }`}
            aria-label="Previous products"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={toggleAutoPlay}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:border-purple-300"
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

          {/* Products Carousel */}
          <div
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex overflow-x-auto gap-6 snap-x snap-mandatory scrollbar-hide pb-4 cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {displayedProducts.map((product) => (
              <a
                key={product.id}
                href={`/products/${product.slug || product.product_code?.toLowerCase() || product.id}`}
                className={`group block flex-shrink-0 ${getCardWidth()} snap-start min-w-[200px]`}
              >
                {ProductCard ? (
                  <ProductCard {...mapProductToCardProps(product)} />
                ) : (
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-xl hover:shadow-purple-100/50 transform hover:-translate-y-1 h-full">
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      {product.old_price && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                          {Math.round(((product.old_price - product.price) / product.old_price) * 100)}% OFF
                        </div>
                      )}
                      {/* Quick Add Button */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                        <button className="px-6 py-2.5 bg-white text-gray-900 rounded-full text-sm font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          Quick Add
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm group-hover:text-purple-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                          {currency}{product.price?.toLocaleString()}
                        </span>
                        {product.old_price && (
                          <span className="text-sm text-gray-400 line-through">
                            {currency}{product.old_price?.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {(product.review_summary?.average_rating || product.average_rating) && (
                        <div className="flex items-center gap-1 mt-2">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const rating = product.review_summary?.average_rating || product.average_rating || 0;
                            return (
                              <svg
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < Math.floor(rating) ? "text-yellow-400" : "text-gray-200"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            );
                          })}
                          <span className="text-xs text-gray-500 ml-1">({product.review_summary?.total_reviews || product.total_reviews || 0})</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </a>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => scrollTo("right")}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 ${
              canScrollRight
                ? "opacity-0 group-hover:opacity-100 hover:scale-110 hover:border-purple-300 hover:shadow-xl"
                : "opacity-0 cursor-not-allowed"
            }`}
            aria-label="Next products"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Scroll Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: Math.ceil(displayedProducts.length / columns) }).map((_, index) => (
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
              className={`h-2 rounded-full transition-all duration-300 ${
                activeSlide === index
                  ? "w-8 bg-purple-600"
                  : "w-2 bg-gray-300 hover:bg-purple-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeSlide === index ? "true" : "false"}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            View All Products
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Hide Scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default RelatedProducts2;
