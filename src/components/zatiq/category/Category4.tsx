import React, { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface Block {
  name?: string;
  title?: string;
  count?: string;
  subtitle?: string;
  image?: string;
  titleColor?: string;
  subtitleColor?: string;
  url?: string;
}

interface Category4Settings {
  enableSlider?: boolean;
  slidesPerView?: number;
  slidesPerViewTablet?: number;
  slidesPerViewMobile?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  showNavigation?: boolean;
  showPagination?: boolean;
  loop?: boolean;
  spaceBetween?: number;
}

interface Category4Props {
  settings?: Category4Settings;
  blocks?: Block[];
}

const CategoryCard: React.FC<{ category: Block }> = ({ category }) => (
  <a
    href={category.url || "#"}
    className="relative flex flex-col items-center hover:opacity-80 transition"
  >
    {/* Circle Image Container with light gray background */}
    {category.image && (
      <div className="relative rounded-full overflow-hidden mb-3 sm:mb-4 w-[140px] h-[140px] sm:w-40 sm:h-40 lg:w-[180px] lg:h-[180px] bg-[#F7F7F7]">
        <img
          src={category.image}
          alt={category.name || category.title || "Category"}
          className="w-full h-full object-cover object-center p-4 sm:p-5 lg:p-6"
        />
      </div>
    )}

    {/* Category Name */}
    {(category.name || category.title) && (
      <h3
        className="font-normal text-center text-base sm:text-lg lg:text-xl tracking-normal leading-6 sm:leading-7 lg:leading-8"
        style={{ color: category.titleColor || "#181D25" }}
      >
        {category.name || category.title}
      </h3>
    )}

    {/* Product Count */}
    {(category.count || category.subtitle) && (
      <p
        className="text-center text-sm sm:text-base tracking-normal line-clamp-2 leading-5 sm:leading-6 font-normal"
        style={{ color: category.subtitleColor || "#666666" }}
      >
        {category.count || category.subtitle}
      </p>
    )}
  </a>
);

const Category4: React.FC<Category4Props> = ({ settings = {}, blocks = [] }) => {
  const {
    enableSlider = false,
    slidesPerView = 5,
    slidesPerViewTablet = 4,
    slidesPerViewMobile = 2,
    autoplay = false,
    autoplayDelay = 3000,
    showNavigation = true,
    showPagination = true,
    loop = true,
  } = settings;

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  // Return null if no blocks
  if (blocks.length === 0) {
    return null;
  }

  // Render as slider
  if (enableSlider) {
    const autoplayPlugin = autoplay
      ? [
          Autoplay({
            delay: autoplayDelay,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]
      : [];

    // Calculate basis percentages for responsive slides
    const mobileBasis = Math.floor(100 / slidesPerViewMobile);
    const tabletBasis = Math.floor(100 / slidesPerViewTablet);
    const desktopBasis = Math.floor(100 / slidesPerView);

    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-8 pb-8 sm:pb-14">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: loop,
          }}
          plugins={autoplayPlugin}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {blocks.map((category, i) => (
              <CarouselItem
                key={i}
                className="pl-4"
                style={{
                  flexBasis: `${mobileBasis}%`,
                }}
              >
                <div className="md:hidden">
                  <CategoryCard category={category} />
                </div>
                <div
                  className="hidden md:block lg:hidden"
                  style={{ width: "100%" }}
                >
                  <CategoryCard category={category} />
                </div>
                <div className="hidden lg:block" style={{ width: "100%" }}>
                  <CategoryCard category={category} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {showNavigation && (
            <>
              <CarouselPrevious className="hidden md:flex -left-2 lg:-left-4 bg-white border-gray-200 hover:bg-gray-50 shadow-md" />
              <CarouselNext className="hidden md:flex -right-2 lg:-right-4 bg-white border-gray-200 hover:bg-gray-50 shadow-md" />
            </>
          )}
        </Carousel>

        {/* Pagination Dots */}
        {showPagination && count > 1 && (
          <div className="flex justify-center gap-1.5 mt-6">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  current === index
                    ? "w-6 bg-gray-900"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Responsive styles for carousel items */}
        <style>{`
          @media (min-width: 768px) {
            .category-4-carousel [data-carousel-item] {
              flex-basis: ${tabletBasis}% !important;
            }
          }
          @media (min-width: 1024px) {
            .category-4-carousel [data-carousel-item] {
              flex-basis: ${desktopBasis}% !important;
            }
          }
        `}</style>
      </div>
    );
  }

  // Render as grid (default)
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-8 sm:px-0 pb-8 sm:pb-14">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6">
        {blocks.map((category, i) => (
          <CategoryCard key={i} category={category} />
        ))}
      </div>
    </div>
  );
};

export default Category4;
