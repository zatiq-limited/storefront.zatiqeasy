/**
 * Product Collection 2 - Premium Carousel with Auto-play
 * World-class design with shadcn carousel and smooth animations
 */

import React, { useRef, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { getComponent } from "../../../lib/component-registry";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface ProductCollection2Props {
  title?: string;
  subtitle?: string;
  titleColor?: string;
  curatedTag?: string;
  subtitleColor?: string;
  viewAllText?: string;
  viewAllLink?: string;
  productCardType?: string;
  viewTotalProducts?: number;
  products?: any[];
  bgColor?: string;
  showViewAll?: boolean;
  showArrows?: boolean;
  autoplayDelay?: number;
}

const ProductCollection2: React.FC<ProductCollection2Props> = ({
  title = "Featured Products",
  subtitle,
  curatedTag = "Curated Selection",
  titleColor = "#111827",
  subtitleColor = "#6B7280",
  viewAllText = "Explore Collection",
  viewAllLink = "/collections/all",
  productCardType = "product-card-1",
  viewTotalProducts = 4,
  products = [],
  bgColor = "#FAFAFA",
  showViewAll = true,
  showArrows = true,
  autoplayDelay = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const ProductCard = getComponent(productCardType);

  const autoplayPlugin = React.useMemo(
    () =>
      Autoplay({
        delay: autoplayDelay,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    [autoplayDelay]
  );

  if (!ProductCard) {
    console.error(`Product card type "${productCardType}" not found`);
    return null;
  }

  // Intersection Observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Track current slide
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 md:py-28 lg:py-32 relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${titleColor} 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 relative">
        {/* Premium Header */}
        <div
          className={`flex flex-col lg:flex-row lg:justify-between lg:items-center mb-14 gap-6 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex-1 max-w-2xl">
            {/* Elegant Label */}
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-12 h-[2px] rounded-full"
                style={{ backgroundColor: titleColor }}
              />
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: subtitleColor }}
              >
                {curatedTag}
              </span>
            </div>

            {title && (
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight mb-2 leading-[1.1]"
                style={{ color: titleColor }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="text-lg md:text-xl leading-relaxed font-light"
                style={{ color: subtitleColor }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* View All Button */}
          {showViewAll && viewAllLink && (
            <a
              href={viewAllLink}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-semibold text-sm tracking-wide transition-all duration-500 ease-out hover:gap-5 group shadow-lg hover:shadow-xl"
              style={{
                backgroundColor: titleColor,
                color: bgColor,
              }}
            >
              {viewAllText}
              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
          )}
        </div>

        {/* Product Carousel with Autoplay */}
        <div
          className={`relative transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <Carousel
            setApi={setApi}
            plugins={[autoplayPlugin]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {products.slice(0, viewTotalProducts).map((product, index) => (
                <CarouselItem
                  key={product.id || index}
                  className="pl-4 md:pl-6 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div
                    className={`transition-all duration-700 ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
                    style={{
                      transitionDelay: isVisible
                        ? `${300 + index * 100}ms`
                        : "0ms",
                    }}
                  >
                    <ProductCard {...product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Arrows */}
            {showArrows && (
              <div className={`${viewTotalProducts <= 4 ? "hidden" : ""}`}>
                <CarouselPrevious className="hidden md:flex -left-4 lg:-left-6 w-14 h-14 bg-white border-0 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300" />
                <CarouselNext className="hidden md:flex -right-4 lg:-right-6 w-14 h-14 bg-white border-0 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300" />
              </div>
            )}
          </Carousel>

          {/* Progress Dots */}
          <div className={`${viewTotalProducts <= 4 ? "hidden" : ""} flex justify-center mt-10 gap-2`}>
            {products.slice(0, Math.min(products.length, 8)).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  current === index ? "w-8" : "w-2"
                }`}
                style={{
                  backgroundColor:
                    current === index ? titleColor : `${titleColor}30`,
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCollection2;
