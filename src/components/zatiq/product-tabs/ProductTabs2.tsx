/**
 * Product Tabs 2 - Premium Underline Tabs with Animated Grid
 * Modern design with underline tab indicators and staggered animations
 */

import { useState, useRef, useEffect } from "react";
import { getComponent } from "@/lib/component-registry";

interface Product {
  id: string;
  handle?: string;
  title: string;
  subtitle?: string;
  vendor?: string;
  price: number;
  comparePrice?: number | null;
  currency?: string;
  image: string;
  hoverImage?: string;
  badge?: string;
  badgeColor?: string;
  rating?: number;
  reviewCount?: number;
  colors?: string[];
  sizes?: string[];
  quickAddEnabled?: boolean;
  buyNowEnabled?: boolean;
}

interface Tab {
  id: string;
  label: string;
  products: Product[];
}

interface ProductTabs2Props {
  settings?: {
    title?: string;
    subtitle?: string;
    tagline?: string;
    tabAlignment?: "left" | "center" | "right";
    productCardType?: string;
    viewTotalProducts?: number;
    columns?: number;
    columnsMobile?: number;
    titleColor?: string;
    subtitleColor?: string;
    accentColor?: string;
    bgColor?: string;
  };
  tabs?: Tab[];
}

export default function ProductTabs2({
  settings = {},
  tabs = [],
}: ProductTabs2Props) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const {
    title,
    subtitle,
    tagline,
    tabAlignment = "center",
    productCardType,
    viewTotalProducts,
    columns = 4,
    columnsMobile = 2,
    titleColor = "#111827",
    subtitleColor = "#6B7280",
    accentColor = "#111827",
    bgColor = "#FFFFFF",
  } = settings;

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  const alignmentClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[tabAlignment];

  // Get the product card component from registry
  const ProductCard = productCardType ? getComponent(productCardType) : null;

  // Responsive grid classes
  const mobileColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
  }[columnsMobile] || "grid-cols-2";

  const desktopColsClass = {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
  }[columns] || "lg:grid-cols-4";

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

  // Update indicator position when active tab changes
  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const activeTabEl = tabRefs.current[activeIndex];

    if (activeTabEl) {
      setIndicatorStyle({
        left: activeTabEl.offsetLeft,
        width: activeTabEl.offsetWidth,
      });
    }
  }, [activeTab, tabs, isVisible]);

  // Handle tab change with animation
  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab || isAnimating) return;

    setIsAnimating(true);
    setActiveTab(tabId);

    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };

  if (!ProductCard) {
    return null;
  }

  const productsToShow = viewTotalProducts
    ? activeTabData?.products.slice(0, viewTotalProducts)
    : activeTabData?.products;

  return (
    <section
      ref={sectionRef}
      className="w-full pb-12 md:pb-20 relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, ${bgColor} 0%, ${accentColor}05 50%, ${bgColor} 100%)`,
        }}
      />

      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0 relative">
        {/* Premium Header */}
        <div
          className={`text-center mb-8 md:mb-14 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Tagline with decorative lines */}
          {tagline && (
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div
                className="hidden sm:block w-8 md:w-20 h-px"
                style={{ backgroundColor: `${accentColor}30` }}
              />
              <span
                className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.2em] md:tracking-[0.25em] uppercase"
                style={{ color: accentColor }}
              >
                {tagline}
              </span>
              <div
                className="hidden sm:block w-8 md:w-20 h-px"
                style={{ backgroundColor: `${accentColor}30` }}
              />
            </div>
          )}

          {/* Title with gradient accent */}
          {title && (
            <div className="relative inline-block">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]"
                style={{ color: titleColor }}
              >
                {title}
              </h2>
              {/* Decorative underline accent */}
              <div
                className="absolute -bottom-1.5 md:-bottom-2 left-1/2 -translate-x-1/2 w-12 md:w-24 h-0.5 md:h-1 rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                }}
              />
            </div>
          )}

          {/* Subtitle with refined typography */}
          {subtitle && (
            <p
              className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-light mt-4 md:mt-6 px-4"
              style={{ color: subtitleColor }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Tabs with Underline Indicator - Scrollable on mobile */}
        <div
          className={`mb-8 md:mb-14 transition-all duration-1000 delay-100 overflow-x-auto scrollbar-hide ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className={`flex ${alignmentClass}`}>
            <div className="relative inline-flex border-b border-gray-200 min-w-max">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative px-4 sm:px-6 md:px-10 py-3 md:py-4 text-sm sm:text-base md:text-lg font-medium transition-colors duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? ""
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={{
                    color: activeTab === tab.id ? accentColor : undefined,
                  }}
                >
                  {tab.label}
                  {/* Product count badge */}
                  <span
                    className={`ml-1.5 sm:ml-2 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {tab.products.length}
                  </span>
                </button>
              ))}

              {/* Animated Underline Indicator */}
              <div
                className="absolute bottom-0 h-0.5 md:h-[3px] rounded-full transition-all duration-500 ease-out"
                style={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                  backgroundColor: accentColor,
                }}
              />
            </div>
          </div>
        </div>

        {/* Products Grid with Animation */}
        {activeTabData && (
          <div
            className={`grid ${mobileColsClass} md:grid-cols-3 ${desktopColsClass} gap-3 sm:gap-4 md:gap-6 transition-all duration-500 ${
              isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            {productsToShow && productsToShow.length > 0 ? (
              productsToShow.map((product, index) => (
                <div
                  key={product.id || index}
                  className={`transition-all duration-700 ${
                    isVisible && !isAnimating
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{
                    transitionDelay: isVisible ? `${200 + index * 100}ms` : "0ms",
                  }}
                >
                  <ProductCard {...product} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 md:py-16">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 md:w-8 md:h-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm md:text-lg">
                  No products available in this category
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
