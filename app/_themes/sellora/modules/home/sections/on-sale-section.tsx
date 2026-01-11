"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useShopStore } from "@/stores/shopStore";
import { SelloraProductCard } from "../../../components/cards";
import type { Product } from "@/stores/productsStore";

import "swiper/css";
import "swiper/css/navigation";
import FlashSaleCountdown from "@/components/shared/flash-sale-countdown";

interface OnSaleSectionProps {
  setSelectedProduct: (product: Product | null) => void;
  navigateProductDetails: (id: number | string) => void;
}

export function OnSaleSection({
  setSelectedProduct,
  navigateProductDetails,
}: OnSaleSectionProps) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const swiperRef = useRef<SwiperType | null>(null);

  // Get on-sale products from theme
  const onSaleProducts =
    (shopDetails?.shop_theme as unknown as { on_sale_inventories?: Product[] })
      ?.on_sale_inventories || [];

  if (onSaleProducts.length === 0) return null;

  return (
    <div className="container py-10 sm:py-14">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h2
          className="text-2xl md:text-3xl font-semibold text-foreground mb-6 sm:mb-8"
          style={{ letterSpacing: "4%" }}
        >
          {t("special_offer")}
        </h2>

        {/* Flash Sale Countdown */}
        <FlashSaleCountdown />
      </div>

      {/* Swiper Slider */}
      <div className="relative px-0">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 16 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          modules={[Navigation, Autoplay]}
          className="pb-4"
          loop={onSaleProducts.length > 4}
        >
          {onSaleProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <SelloraProductCard
                product={product}
                onNavigate={() => navigateProductDetails(product.id)}
                onSelectProduct={() => setSelectedProduct(product)}
                isSale={true}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        {onSaleProducts.length > 3 && (
          <>
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-1 xl:-translate-x-5 z-10 w-8 h-8 sm:w-10 sm:h-10 hidden sm:flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-1 xl:translate-x-5 z-10 w-8 h-8 sm:w-10 sm:h-10 hidden sm:flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default OnSaleSection;
