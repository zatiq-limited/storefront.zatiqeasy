"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useProductsStore } from "@/stores/productsStore";
import { LuxuraCategoryCard } from "../../../components/cards";
import { SectionHeader } from "./section-header";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

export function LuxuraHomeSelectedCategorySection() {
  const { t } = useTranslation();
  const categories = useProductsStore((state) => state.categories);
  const swiperRef = useRef<SwiperType | null>(null);

  // Use first 8 categories
  const displayCategories = categories.slice(0, 8);

  if (displayCategories.length === 0) {
    return null;
  }

  return (
    <div>
      <SectionHeader text={t("category")} link="/categories" />
      <div className="relative">
        <Swiper
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={2}
          spaceBetween={20}
          loop={displayCategories.length > 2}
          rewind={true}
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Navigation]}
          breakpoints={{
            640: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
        >
          {displayCategories.map((category) => (
            <SwiperSlide key={category.id}>
              <LuxuraCategoryCard
                id={category.id}
                name={category.name}
                image_url={category.image_url}
                isOnSale={false}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default LuxuraHomeSelectedCategorySection;
