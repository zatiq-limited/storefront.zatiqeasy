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
  image?: string;
  productImage?: string;
  titleColor?: string;
  url?: string;
  productCount?: number;
}

interface Category5Settings {
  showProductCount?: boolean;
  showBackground?: boolean;
  backgroundColor?: string;
  titleColor?: string;
  countColor?: string;
  // Slider settings
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

interface Category5Props {
  settings?: Category5Settings;
  blocks?: Block[];
}

interface CategoryCardProps {
  category: Block;
  showProductCount: boolean;
  showBackground: boolean;
  backgroundColor: string;
  defaultTitleColor: string;
  countColor: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  showProductCount,
  showBackground,
  backgroundColor,
  defaultTitleColor,
  countColor,
}) => {
  const titleColor = category.titleColor || defaultTitleColor;
  // Use productImage if available, fallback to image
  const categoryImage = category.productImage || category.image;

  return (
    <a
      href={category.url || "#"}
      className="relative flex flex-col items-center hover:opacity-80 transition"
    >
      {/* Circle Image Container with light background */}
      {categoryImage && (
        <div
          className="relative rounded-full overflow-hidden mb-3 sm:mb-4 w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40"
          style={{ backgroundColor: showBackground ? backgroundColor : "transparent" }}
        >
          <img
            src={categoryImage}
            alt={category.name || category.title || "Category"}
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* Category Name */}
      {(category.name || category.title) && (
        <h3
          className="font-semibold text-center text-sm sm:text-base tracking-normal leading-5 sm:leading-6"
          style={{ color: titleColor }}
        >
          {category.name || category.title}
        </h3>
      )}

      {/* Product Count */}
      {showProductCount && category.productCount !== undefined && (
        <p
          className="text-xs sm:text-sm text-center mt-1"
          style={{ color: countColor }}
        >
          {category.productCount} products
        </p>
      )}
    </a>
  );
};

const Category5: React.FC<Category5Props> = ({ settings = {}, blocks = [] }) => {
  const {
    showProductCount = false,
    showBackground = true,
    backgroundColor = "#F5F5F8",
    titleColor: defaultTitleColor = "#181D25",
    countColor = "#666666",
    // Slider settings
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

  const cardProps = {
    showProductCount,
    showBackground,
    backgroundColor,
    defaultTitleColor,
    countColor,
  };

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
      <div className="w-full max-w-[1440px] mx-auto px-4 2xl:px-0 lg:px-8 py-6 pb-8 sm:pb-14">
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
                  <CategoryCard category={category} {...cardProps} />
                </div>
                <div
                  className="hidden md:block lg:hidden"
                  style={{ width: "100%" }}
                >
                  <CategoryCard category={category} {...cardProps} />
                </div>
                <div className="hidden lg:block" style={{ width: "100%" }}>
                  <CategoryCard category={category} {...cardProps} />
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
            .category-5-carousel [data-carousel-item] {
              flex-basis: ${tabletBasis}% !important;
            }
          }
          @media (min-width: 1024px) {
            .category-5-carousel [data-carousel-item] {
              flex-basis: ${desktopBasis}% !important;
            }
          }
        `}</style>
      </div>
    );
  }

  // Render as grid (default)
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 2xl:px-0 lg:px-8 py-6 pb-8 sm:pb-14">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {blocks.map((category, i) => (
          <CategoryCard key={i} category={category} {...cardProps} />
        ))}
      </div>
    </div>
  );
};

export default Category5;
