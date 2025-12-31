import React, { useState, useRef, useEffect, useCallback } from 'react';
import ProductCard1 from '../products/product-cards/product-card-1';
import ProductCard2 from '../products/product-cards/product-card-2';
import ProductCard3 from '../products/product-cards/product-card-3';
import ProductCard4 from '../products/product-cards/product-card-4';
import ProductCard5 from '../products/product-cards/product-card-5';
import ProductCard6 from '../products/product-cards/product-card-6';
import ProductCard7 from '../products/product-cards/product-card-7';
import ProductCard8 from '../products/product-cards/product-card-8';
import ProductCard9 from '../products/product-cards/product-card-9';
import ProductCard10 from '../products/product-cards/product-card-10';
import ProductCard11 from '../products/product-cards/product-card-11';
import ProductCard12 from '../products/product-cards/product-card-12';
import ProductCard13 from '../products/product-cards/product-card-13';
import ProductCard14 from '../products/product-cards/product-card-14';
import ProductCard15 from '../products/product-cards/product-card-15';
import ProductCard16 from '../products/product-cards/product-card-16';
import type { Product } from '@/stores/productsStore';

interface RelatedProducts1Settings {
  title?: string;
  columns?: number;
  mobileColumns?: number;
  tabletColumns?: number;
  gap?: string;
  cardDesign?: string;
  limit?: number;
  titleColor?: string;
  priceColor?: string;
  oldPriceColor?: string;
  badgeColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
}

interface RelatedProducts1Props {
  settings: RelatedProducts1Settings;
  products?: Product[];
}

const RelatedProducts1 = ({ settings, products = [] }: RelatedProducts1Props) => {
  const {
    title = 'You May Also Like',
    columns = 4,
    mobileColumns = 2,
    tabletColumns = 3,
    gap = 'md',
    cardDesign = 'card-1',
    limit = 8,
    titleColor = '#111827',
    priceColor = '#111827',
    oldPriceColor = '#9CA3AF',
    badgeColor = '#DC2626',
    buttonBgColor = '#111827',
    buttonTextColor = '#FFFFFF',
    viewMode = 'desktop',
  } = settings;
  // Helper to check current view mode
  const isMobile = viewMode === 'mobile';
  const isTablet = viewMode === 'tablet';

  // Helper to get container padding class based on viewMode (NO breakpoints)
  const getContainerPaddingClass = () => {
    if (isMobile) return 'px-4';
    if (isTablet) return 'px-6';
    return 'px-4';
  };

  // Get section padding based on viewMode (NO breakpoints)
  const getSectionPaddingClass = () => {
    if (isMobile) return 'py-8';
    if (isTablet) return 'py-10';
    return 'py-12';
  };

  // Get header margin based on viewMode (NO breakpoints)
  const getHeaderMarginClass = () => {
    if (isMobile) return 'mb-4';
    if (isTablet) return 'mb-6';
    return 'mb-8';
  };

  // Get title size based on viewMode (NO breakpoints)
  const getTitleSizeClass = () => {
    if (isMobile) return 'text-xl';
    if (isTablet) return 'text-2xl';
    return 'text-3xl';
  };

  // Get gap class based on viewMode (NO breakpoints)
  const getGapClass = () => {
    const gapValues = {
      sm: { mobile: 'gap-3', tablet: 'gap-4', desktop: 'gap-4' },
      md: { mobile: 'gap-4', tablet: 'gap-5', desktop: 'gap-6' },
      lg: { mobile: 'gap-5', tablet: 'gap-6', desktop: 'gap-8' },
    };
    const gapConfig = gapValues[gap] || gapValues.md;
    if (isMobile) return gapConfig.mobile;
    if (isTablet) return gapConfig.tablet;
    return gapConfig.desktop;
  };

  // Get card width based on viewMode (NO breakpoints)
  const getCardWidth = () => {
    const widthMap = {
      1: 'w-full',
      2: 'w-[calc(50%-8px)]',
      3: 'w-[calc(33.333%-11px)]',
      4: 'w-[calc(25%-12px)]',
      5: 'w-[calc(20%-13px)]',
      6: 'w-[calc(16.666%-14px)]',
    };

    if (isMobile) return widthMap[mobileColumns] || 'w-[calc(50%-8px)]';
    if (isTablet) return widthMap[tabletColumns] || 'w-[calc(33.333%-11px)]';
    return widthMap[columns] || 'w-[calc(25%-12px)]';
  };

  // Get min card width based on viewMode (NO breakpoints)
  const getMinCardWidth = () => {
    if (isMobile) return 'min-w-[140px]';
    if (isTablet) return 'min-w-[180px]';
    return 'min-w-[200px]';
  };

  // Get dots gap based on viewMode (NO breakpoints)
  const getDotsContainerClass = () => {
    if (isMobile) return 'gap-1.5 mt-4';
    if (isTablet) return 'gap-2 mt-5';
    return 'gap-2 mt-6';
  };

  // Button size based on viewMode (NO breakpoints)
  const getButtonSize = () => {
    if (isMobile) return 32;
    if (isTablet) return 36;
    return 40;
  };

  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayIntervalRef = useRef(null);

  const displayedProducts = products.slice(0, limit);

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
      carousel.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        carousel.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [checkScroll]);

  const scrollTo = useCallback((direction) => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.85;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
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
            behavior: 'smooth',
          });
        } else {
          // Scroll to next (85% of viewport width)
          const scrollAmount = clientWidth * 0.85;
          carouselRef.current.scrollBy({
            left: scrollAmount,
            behavior: 'smooth',
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
  const handleMouseDown = (e) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftPos(carouselRef.current.scrollLeft);
    carouselRef.current.style.cursor = 'grabbing';
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    carouselRef.current.scrollLeft = scrollLeftPos - walk;
  };

  // Render product card based on cardDesign
  const renderProductCard = (product) => {
    const discountPercent = product.old_price
      ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
      : 0;

    const cardProps = {
      id: product.id,
      handle: product.handle || String(product.id),
      title: product.name,
      price: product.price,
      comparePrice: product.old_price || undefined,
      currency: 'BDT',
      image: product.image_url,
      vendor: product.category,
      badge: discountPercent > 0 ? `-${discountPercent}%` : undefined,
      rating: product.rating || 0,
      reviewCount: product.reviews || 0,
      buttonBgColor: buttonBgColor,
      buttonTextColor: buttonTextColor,
      priceColor: priceColor,
      oldPriceColor: oldPriceColor,
      badgeColor: badgeColor,
      viewMode: viewMode,
    };

    switch (cardDesign) {
      case 'card-1':
      default:
        return <ProductCard1 {...cardProps} />;
      case 'card-2':
        return <ProductCard2 {...cardProps} />;
      case 'card-3':
        return <ProductCard3 {...cardProps} />;
      case 'card-4':
        return <ProductCard4 {...cardProps} subtitle={product.category} />;
      case 'card-5':
        return <ProductCard5 {...cardProps} />;
      case 'card-6':
        return <ProductCard6 {...cardProps} />;
      case 'card-7':
        return <ProductCard7 {...cardProps} />;
      case 'card-8':
        return <ProductCard8 {...cardProps} />;
      case 'card-9':
        return <ProductCard9 {...cardProps} />;
      case 'card-10':
        return <ProductCard10 {...cardProps} />;
      case 'card-11':
        return <ProductCard11 {...cardProps} />;
      case 'card-12':
        return <ProductCard12 {...cardProps} />;
      case 'card-13':
        return <ProductCard13 {...cardProps} />;
      case 'card-14':
        return <ProductCard14 {...cardProps} />;
      case 'card-15':
        return <ProductCard15 {...cardProps} />;
      case 'card-16':
        return <ProductCard16 {...cardProps} />;
    }
  };

  const currentColumns = isMobile ? mobileColumns : isTablet ? tabletColumns : columns;
  const totalSlides = Math.ceil(displayedProducts.length / currentColumns);
  const buttonSize = getButtonSize();

  return (
    <section className={getSectionPaddingClass()}>
      <div className={`container mx-auto ${getContainerPaddingClass()}`}>
        {/* Header with Navigation */}
        <div className={`flex items-center justify-between ${getHeaderMarginClass()}`}>
          <h2 className={`${getTitleSizeClass()} font-bold`} style={{ color: titleColor }}>
            {title}
          </h2>

          {/* Navigation - hidden on mobile */}
          {!isMobile && (
            <div className="flex items-center gap-3">
              {/* Pause/Play Button */}
              <button
                onClick={toggleAutoPlay}
                className="rounded-full border-2 border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900 flex items-center justify-center transition-all"
                style={{
                  width: `${buttonSize}px`,
                  height: `${buttonSize}px`,
                  minWidth: `${buttonSize}px`,
                  minHeight: `${buttonSize}px`,
                }}
                aria-label={isAutoPlaying ? 'Pause autoplay' : 'Start autoplay'}
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
              {/* Previous Button */}
              <button
                onClick={() => scrollTo('left')}
                disabled={!canScrollLeft}
                className={`rounded-full border-2 flex items-center justify-center transition-all ${
                  canScrollLeft
                    ? 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
                style={{
                  width: `${buttonSize}px`,
                  height: `${buttonSize}px`,
                  minWidth: `${buttonSize}px`,
                  minHeight: `${buttonSize}px`,
                }}
                aria-label="Previous products"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {/* Next Button */}
              <button
                onClick={() => scrollTo('right')}
                disabled={!canScrollRight}
                className={`rounded-full border-2 flex items-center justify-center transition-all ${
                  canScrollRight
                    ? 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
                style={{
                  width: `${buttonSize}px`,
                  height: `${buttonSize}px`,
                  minWidth: `${buttonSize}px`,
                  minHeight: `${buttonSize}px`,
                }}
                aria-label="Next products"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
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
          className={`flex overflow-x-auto ${getGapClass()} snap-x snap-mandatory scrollbar-hide pb-2 cursor-grab select-none`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              className={`shrink-0 ${getCardWidth()} ${getMinCardWidth()} snap-start`}
            >
              {renderProductCard(product)}
            </div>
          ))}
        </div>

        {/* Progress Dots */}
        {totalSlides > 1 && (
          <div className={`flex justify-center ${getDotsContainerClass()}`}>
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (carouselRef.current) {
                    const scrollAmount = carouselRef.current.clientWidth * 0.85 * index;
                    carouselRef.current.scrollTo({
                      left: scrollAmount,
                      behavior: 'smooth',
                    });
                  }
                }}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === index ? 'w-6 bg-gray-900' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
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
};

export default RelatedProducts1;
