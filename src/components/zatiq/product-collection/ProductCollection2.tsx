/**
 * Product Collection 2 - Premium Horizontal Carousel
 * Shopify/Apple-inspired smooth scroll with gradient edges
 */

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { getComponent } from "../../../lib/component-registry";

interface ProductCollection2Props {
  title?: string;
  subtitle?: string;
  titleColor?: string;
  subtitleColor?: string;
  viewAllText?: string;
  viewAllLink?: string;
  productCardType?: string;
  products?: any[];
  bgColor?: string;
  showViewAll?: boolean;
  showArrows?: boolean;
  slidesToShow?: number;
}

const ProductCollection2: React.FC<ProductCollection2Props> = ({
  title = "Featured Products",
  subtitle,
  titleColor = "#000000",
  subtitleColor = "#6B7280",
  viewAllText = "View All",
  viewAllLink = "/collections/all",
  productCardType = "product-card-1",
  products = [],
  bgColor = "#F9FAFB",
  showViewAll = true,
  showArrows = true,
  slidesToShow = 4,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const ProductCard = getComponent(productCardType);

  if (!ProductCard) {
    console.error(`Product card type "${productCardType}" not found`);
    return null;
  }

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () =>
        scrollElement.removeEventListener("scroll", updateScrollButtons);
    }
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      className="w-full py-16 md:py-24 relative"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 md:mb-16 gap-6">
          <div className="flex-1 max-w-3xl">
            {title && (
              <h2
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 leading-tight"
                style={{ color: titleColor }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="text-base md:text-lg lg:text-xl leading-relaxed"
                style={{ color: subtitleColor }}
              >
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            {showArrows && (
              <div className="hidden md:flex gap-3">
                <button
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    canScrollLeft
                      ? "border-gray-900 hover:bg-gray-900 hover:text-white hover:scale-110"
                      : "border-gray-200 text-gray-300 cursor-not-allowed"
                  }`}
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    canScrollRight
                      ? "border-gray-900 hover:bg-gray-900 hover:text-white hover:scale-110"
                      : "border-gray-200 text-gray-300 cursor-not-allowed"
                  }`}
                  aria-label="Next"
                >
                  <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>
            )}

            {showViewAll && viewAllLink && (
              <a
                href={viewAllLink}
                className="group inline-flex items-center gap-2 text-sm md:text-base font-bold transition-all hover:gap-4"
                style={{ color: titleColor }}
              >
                {viewAllText}
                <ArrowRight
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.5}
                />
              </a>
            )}
          </div>
        </div>

        {/* Product Carousel with Gradient Edges */}
        <div className="relative -mx-4 md:-mx-6 lg:-mx-8">
          {/* Left Gradient */}
          {canScrollLeft && (
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--bg-color)] to-transparent z-10 pointer-events-none"></div>
          )}

          {/* Right Gradient */}
          {canScrollRight && (
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--bg-color)] to-transparent z-10 pointer-events-none"></div>
          )}

          <div
            ref={scrollRef}
            className="overflow-x-auto scroll-smooth px-4 md:px-6 lg:px-8 pb-2"
            style={
              {
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
                "--bg-color": bgColor,
              } as React.CSSProperties
            }
          >
            <div className="flex gap-6 md:gap-8 lg:gap-10">
              {products.map((product, index) => (
                <div
                  key={product.id || index}
                  className="flex-shrink-0 w-[280px] md:w-[320px] lg:w-[360px] group"
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        section::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ProductCollection2;
