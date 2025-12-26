"use client";

import React, { useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore, type Product } from "@/stores/productsStore";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import { SelloraProductCard } from "../../../components/cards";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface RelatedProductsProps {
  currentProductId: number | string;
  categoryIds?: number[];
}

export function RelatedProducts({
  currentProductId,
  categoryIds = [],
}: RelatedProductsProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const allProducts = useProductsStore((state) => state.products);
  const swiperRef = useRef<SwiperType | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const baseUrl = shopDetails?.baseUrl || "";

  // Get related products
  const relatedProducts = useMemo(() => {
    if (categoryIds.length === 0) {
      // If no category IDs, just return some random products
      return allProducts
        .filter((p) => String(p.id) !== String(currentProductId))
        .slice(0, 20);
    }

    // First, try to find products with matching categories
    const related = allProducts.filter(
      (product) =>
        String(product.id) !== String(currentProductId) &&
        product.categories?.some((c) => categoryIds.includes(c.id))
    );

    // Sort by number of matching categories (more matches = higher priority)
    related.sort((a, b) => {
      const aMatches =
        a.categories?.filter((c) => categoryIds.includes(c.id)).length || 0;
      const bMatches =
        b.categories?.filter((c) => categoryIds.includes(c.id)).length || 0;
      return bMatches - aMatches;
    });

    // If we have less than 20, add more products
    if (related.length < 20) {
      const remaining = allProducts.filter(
        (product) =>
          String(product.id) !== String(currentProductId) &&
          !related.some((r) => r.id === product.id)
      );
      return [...related, ...remaining].slice(0, 20);
    }

    return related.slice(0, 20);
  }, [allProducts, currentProductId, categoryIds]);

  // Navigate to product details
  const navigateProductDetails = useCallback(
    (id: number | string) => {
      router.push(`${baseUrl}/products/${id}`);
    },
    [router, baseUrl]
  );

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#ede9e6] dark:bg-[#dad1ca] pt-10 sm:pt-24">
      {/* Variant Selector Modal */}
      <VariantSelectorModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <div className="container px-4 xl:px-0 pb-10 sm:pb-24">
        {/* Header with Navigation Buttons */}
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-normal text-black dark:text-white">
            {t("you_may_also_like") || "You May Also Like"}
          </h2>

          {/* Navigation Buttons */}
          {relatedProducts.length > 4 && (
            <div className="flex gap-2">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="cursor-pointer w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-black" />
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="cursor-pointer w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-black" />
              </button>
            </div>
          )}
        </div>

        {/* Swiper Slider */}
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
            }}
            className="pb-12!"
            pagination={{
              clickable: true,
              dynamicBullets: true,
              dynamicMainBullets: 3,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            modules={[Navigation, Autoplay, Pagination]}
            loop={relatedProducts.length > 4}
          >
            {relatedProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <SelloraProductCard
                  product={product}
                  onNavigate={() => navigateProductDetails(product.id)}
                  onSelectProduct={() => setSelectedProduct(product)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default RelatedProducts;
