import React, { useRef, useState, useEffect } from "react";
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

interface Product {
  id?: string | number;
  name?: string;
  title?: string;
  image?: string;
  images?: string[];
  selling_price?: number;
  price?: number;
  regular_price?: number;
  comparePrice?: number;
  category?: string;
  vendor?: string;
  discount?: string;
  badge?: string;
  url?: string;
  rating?: number;
  reviewCount?: number;
}

interface CustomSectionsSettings {
  sectionTitle?: string;
  sectionSubtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  showButton?: boolean;
  titleAlignment?: "left" | "center" | "right";
  buttonPosition?: "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
  maxProducts?: number;
  cardDesign?: string;
  showAsSlider?: boolean;
  slidesPerView?: number;
  enableAutoplay?: boolean;
  autoplayDelay?: number;
  titleFont?: string;
  subtitleFont?: string;
  titleColor?: string;
  subtitleColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonRadius?: number;
  backgroundColor?: string;
}

interface CustomSectionsProps {
  settings?: CustomSectionsSettings;
  products?: Product[];
}

const CustomSections: React.FC<CustomSectionsProps> = ({
  settings = {},
  products = [],
}) => {
  const {
    sectionTitle = "Featured Products",
    sectionSubtitle = "Handpicked items just for you",
    buttonText = "View All",
    buttonLink = "/products",
    showButton = true,
    titleAlignment = "center",
    buttonPosition = "top-right",
    cardDesign = "product-card-1",
    showAsSlider = false,
    slidesPerView = 4,
    enableAutoplay = false,
    autoplayDelay = 3000,
    titleFont = "montserrat",
    subtitleFont = "montserrat",
    titleColor = "#181D25",
    subtitleColor = "#666666",
    buttonColor = "#3465F0",
    buttonTextColor = "#FFFFFF",
    buttonRadius = 24,
    backgroundColor = "#FFFFFF",
  } = settings;

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Get the product card component from registry
  // Add "product-card-" prefix if not already present (e.g., "card-7" -> "product-card-7")
  const cardType = cardDesign.startsWith("product-card-") ? cardDesign : `product-card-${cardDesign.replace("card-", "")}`;
  const ProductCard = getComponent(cardType);

  // Autoplay plugin for carousel
  const autoplayPlugin = React.useMemo(
    () =>
      Autoplay({
        delay: autoplayDelay,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    [autoplayDelay]
  );

  // Track current slide
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Return null if no products or card component not found
  if (products.length === 0) {
    return null;
  }

  if (!ProductCard) {
    console.error(`Product card type "${cardType}" not found in component registry`);
    return null;
  }

  // Font class mapping
  const getFontClass = (font: string) => {
    const fontMap: Record<string, string> = {
      sans: "font-sans",
      serif: "font-serif",
      mono: "font-mono",
      inter: "font-inter",
      playfair: "font-playfair",
      roboto: "font-roboto",
      montserrat: "font-montserrat",
      poppins: "font-poppins",
      lora: "font-lora",
      opensans: "font-opensans",
    };
    return fontMap[font] || "font-montserrat";
  };

  // Alignment class mapping
  const getAlignmentClass = (alignment: string) => {
    const alignMap: Record<string, string> = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };
    return alignMap[alignment] || "text-center";
  };

  const titleFontClass = getFontClass(titleFont);
  const subtitleFontClass = getFontClass(subtitleFont);
  const alignmentClass = getAlignmentClass(titleAlignment);

  // Prepare product props for card component
  const getProductCardProps = (product: Product) => ({
    key: product.id,
    title: product.title || product.name || "Product",
    price: product.price || product.selling_price || 0,
    comparePrice:
      product.comparePrice ||
      (product.regular_price && product.regular_price > (product.price || product.selling_price || 0)
        ? product.regular_price
        : undefined),
    currency: "BDT",
    image: product.image || "/assets/card/p-1.png",
    vendor: product.vendor || product.category || "",
    badge: product.badge || product.discount || "",
    rating: product.rating || 0,
    reviewCount: product.reviewCount || 0,
    subtitle: product.category,
  });

  // Button component for reuse
  const ButtonComponent = ({ withArrow = false }: { withArrow?: boolean }) =>
    showButton && buttonText ? (
      <a
        href={buttonLink || "#"}
        className="px-6 py-3 font-medium text-sm transition-all hover:opacity-90 inline-flex items-center gap-2"
        style={{
          backgroundColor: buttonColor,
          color: buttonTextColor,
          borderRadius: `${buttonRadius}px`,
        }}
      >
        {buttonText}
        {withArrow && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        )}
      </a>
    ) : null;

  // Get button position alignment class
  const getButtonContainerClass = () => {
    switch (buttonPosition) {
      case "bottom-left":
        return "justify-start";
      case "bottom-center":
        return "justify-center";
      case "bottom-right":
        return "justify-end";
      default:
        return "";
    }
  };

  const isButtonTop = buttonPosition === "top-right";
  const isButtonBottom = ["bottom-left", "bottom-center", "bottom-right"].includes(
    buttonPosition
  );

  // Calculate basis for carousel items based on slidesPerView
  const getCarouselBasis = () => {
    switch (slidesPerView) {
      case 1:
        return "basis-full";
      case 2:
        return "basis-1/2";
      case 3:
        return "basis-1/3";
      case 4:
        return "basis-1/4";
      case 5:
        return "basis-1/5";
      case 6:
        return "basis-1/6";
      default:
        return "basis-1/4";
    }
  };

  return (
    <section
      ref={sectionRef}
      className="w-full py-8 sm:py-12"
      style={{ backgroundColor }}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Section Header */}
        <div className="mb-8">
          {isButtonTop ? (
            // Top-right button layout: Title/Subtitle aligned, button on far right
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className={`flex-1 ${alignmentClass}`}>
                {sectionTitle && (
                  <h2
                    className={`${titleFontClass} font-bold text-2xl sm:text-3xl mb-2`}
                    style={{ color: titleColor }}
                  >
                    {sectionTitle}
                  </h2>
                )}
                {sectionSubtitle && (
                  <p
                    className={`${subtitleFontClass} text-sm sm:text-base`}
                    style={{ color: subtitleColor }}
                  >
                    {sectionSubtitle}
                  </p>
                )}
              </div>
              <div className="shrink-0">
                <ButtonComponent withArrow />
              </div>
            </div>
          ) : (
            // Bottom button layout: Title/Subtitle aligned, button below products
            <div className={alignmentClass}>
              {sectionTitle && (
                <h2
                  className={`${titleFontClass} font-bold text-2xl sm:text-3xl mb-2`}
                  style={{ color: titleColor }}
                >
                  {sectionTitle}
                </h2>
              )}
              {sectionSubtitle && (
                <p
                  className={`${subtitleFontClass} text-sm sm:text-base`}
                  style={{ color: subtitleColor }}
                >
                  {sectionSubtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Products Display - Slider or Grid */}
        {showAsSlider ? (
          <div className="relative">
            <Carousel
              setApi={setApi}
              plugins={enableAutoplay ? [autoplayPlugin] : []}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4 sm:-ml-6">
                {products.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className={`pl-4 sm:pl-6 ${getCarouselBasis()}`}
                  >
                    <ProductCard {...getProductCardProps(product)} />
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation Arrows */}
              {products.length > slidesPerView && (
                <>
                  <CarouselPrevious className="hidden md:flex -left-4 lg:-left-6 w-10 h-10 bg-white border shadow-md hover:shadow-lg transition-all" />
                  <CarouselNext className="hidden md:flex -right-4 lg:-right-6 w-10 h-10 bg-white border shadow-md hover:shadow-lg transition-all" />
                </>
              )}
            </Carousel>

            {/* Progress Dots */}
            {products.length > slidesPerView && (
              <div className="flex justify-center mt-6 gap-2">
                {products.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
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
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <div key={product.id}>
                <ProductCard {...getProductCardProps(product)} />
              </div>
            ))}
          </div>
        )}

        {/* Bottom Button */}
        {isButtonBottom && showButton && buttonText && (
          <div className={`flex mt-8 ${getButtonContainerClass()}`}>
            <ButtonComponent />
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomSections;
