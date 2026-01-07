/**
 * Related Products 2
 * Professional carousel with subtitle and enhanced styling
 * Fetches from store if API products not available (like static themes)
 * Limited to 10 products maximum
 */

"use client";

import { useRef, useMemo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, Eye } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { convertSettingsKeys } from "@/lib/settings-utils";
import { useProductsStore, type Product } from "@/stores/productsStore";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
  showViewAll?: boolean;
  viewAllLink?: string;
  showPrice?: boolean;
  showRating?: boolean;
  showWishlist?: boolean;
  showQuickView?: boolean;
  showNavigation?: boolean;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  accentColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  priceColor?: string;
  oldPriceColor?: string;
  cardBgColor?: string;
  starColor?: string;
  badgeColor?: string;
  sectionBgColor?: string;
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
  const router = useRouter();
  const s = convertSettingsKeys<RelatedProducts2Settings>(settings);
  const swiperRef = useRef<SwiperType | null>(null);
  const allProducts = useProductsStore((state) => state.products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // ============================================
  // SETTINGS WITH DEFAULTS
  // ============================================

  const title = s.title || "You May Also Like";
  const subtitle = s.subtitle || "Discover more products you'll love";
  const showViewAll = s.showViewAll !== false;
  const viewAllLink = s.viewAllLink || "/products";
  const showPrice = s.showPrice !== false;
  const showRating = s.showRating !== false;
  const showWishlist = s.showWishlist !== false;
  const showQuickView = s.showQuickView !== false;
  const showNavigation = s.showNavigation !== false;
  const autoPlay = s.autoPlay !== false;
  const autoPlayDelay = s.autoPlayDelay || DEFAULT_AUTOPLAY_DELAY;

  // Colors
  const accentColor = s.accentColor || "#7C3AED";
  const titleColor = s.titleColor || "#111827";
  const subtitleColor = s.subtitleColor || "#6B7280";
  const priceColor = s.priceColor || "#7C3AED";
  const oldPriceColor = s.oldPriceColor || "#9CA3AF";
  const cardBgColor = s.cardBgColor || "#FFFFFF";
  const starColor = s.starColor || "#FBBF24";
  const badgeColor = s.badgeColor || "#DC2626";
  const sectionBgColor = s.sectionBgColor || "#F9FAFB";

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
  // HANDLERS
  // ============================================

  const handleProductClick = useCallback(
    (productId: number | string) => {
      router.push(`/products/${productId}`);
    },
    [router]
  );

  const handleQuickView = useCallback(
    (e: React.MouseEvent, targetProduct: Product) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectedProduct(targetProduct);
    },
    []
  );

  // ============================================
  // RENDER HELPERS
  // ============================================

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3 h-3 ${i < rating ? "" : "opacity-30"}`}
          fill={starColor}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  const renderProductCard = (relatedProduct: Product) => {
    const discount =
      relatedProduct.old_price && relatedProduct.old_price > relatedProduct.price
        ? Math.round(
            ((relatedProduct.old_price - relatedProduct.price) /
              relatedProduct.old_price) *
              100
          )
        : null;

    return (
      <div
        onClick={() => handleProductClick(relatedProduct.id)}
        className="group cursor-pointer rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-lg"
        style={{ backgroundColor: cardBgColor }}
      >
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <Image
            src={relatedProduct.image_url || ""}
            alt={relatedProduct.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Discount Badge */}
          {discount && (
            <div
              className="absolute top-2 left-2 px-2 py-1 text-xs font-bold text-white rounded-full"
              style={{ backgroundColor: badgeColor }}
            >
              -{discount}%
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {showWishlist && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart className="w-4 h-4 text-gray-600" />
              </button>
            )}
            {showQuickView && (
              <button
                onClick={(e) => handleQuickView(e, relatedProduct)}
                className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                aria-label="Quick view"
              >
                <Eye className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {relatedProduct.quantity === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4">
          <h3
            className="font-medium text-sm line-clamp-2 mb-2 group-hover:underline transition-colors"
            style={{ color: titleColor }}
          >
            {relatedProduct.name}
          </h3>

          {/* Rating */}
          {showRating && relatedProduct.review_summary && (
            <div className="flex items-center gap-1.5 mb-2">
              {renderStars(
                Math.round(relatedProduct.review_summary.average_rating)
              )}
              <span className="text-xs text-gray-500">
                {relatedProduct.review_summary.average_rating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Price */}
          {showPrice && (
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="font-bold text-base"
                style={{ color: priceColor }}
              >
                ৳{relatedProduct.price.toLocaleString()}
              </span>
              {relatedProduct.old_price &&
                relatedProduct.old_price > relatedProduct.price && (
                  <span
                    className="text-xs line-through"
                    style={{ color: oldPriceColor }}
                  >
                    ৳{relatedProduct.old_price.toLocaleString()}
                  </span>
                )}
            </div>
          )}
        </div>
      </div>
    );
  };

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
      className="py-12 md:py-16"
      style={{ backgroundColor: sectionBgColor }}
    >
      {/* Variant Selector Modal */}
      <VariantSelectorModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <div className="container mx-auto px-4 2xl:px-0">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-10 gap-4">
          <div>
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1"
              style={{ color: titleColor }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className="text-sm sm:text-base"
                style={{ color: subtitleColor }}
              >
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Navigation Buttons */}
            {showNavigation && relatedProducts.length > 4 && (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border-2 rounded-full hover:bg-gray-50 transition-all"
                  style={{ borderColor: accentColor }}
                  aria-label="Previous slide"
                >
                  <ChevronLeft
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    style={{ color: accentColor }}
                  />
                </button>
                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border-2 rounded-full hover:bg-gray-50 transition-all"
                  style={{ borderColor: accentColor }}
                  aria-label="Next slide"
                >
                  <ChevronRight
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    style={{ color: accentColor }}
                  />
                </button>
              </div>
            )}

            {/* View All Link */}
            {showViewAll && (
              <Link
                href={viewAllLink}
                className="text-sm font-semibold transition-colors hover:underline"
                style={{ color: accentColor }}
              >
                View All →
              </Link>
            )}
          </div>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={12}
            slidesPerView={2}
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
              1280: { slidesPerView: 5, spaceBetween: 24 },
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              dynamicMainBullets: 3,
            }}
            autoplay={
              autoPlay
                ? {
                    delay: autoPlayDelay,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }
                : false
            }
            modules={[Navigation, Autoplay, Pagination]}
            loop={relatedProducts.length > 4}
            className="pb-12!"
          >
            {relatedProducts.map((relatedProduct) => (
              <SwiperSlide key={relatedProduct.id}>
                {renderProductCard(relatedProduct)}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
