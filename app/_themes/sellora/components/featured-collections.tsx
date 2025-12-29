"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useShopStore } from "@/stores/shopStore";
import { CategoryGrid } from "./category-grid";

interface SelectedCategory {
  id: number | string;
  name: string;
  image_url?: string | null;
}

type Props = {
  title: string;
};

export function FeaturedCollections({ title }: Props) {
  const { shopDetails } = useShopStore();

  const categories =
    (
      shopDetails?.shop_theme as unknown as {
        selected_categories?: SelectedCategory[];
      }
    )?.selected_categories ?? [];

  const navPrevId = "featured-prev";
  const navNextId = "featured-next";

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="pt-10 sm:pt-14 md:pt-16 lg:pt-20 pb-10 sm:pb-14">
      {/* Header */}
      <div className="mb-4 md:mb-8">
        <h2
          className="text-2xl md:text-3xl font-semibold text-foreground"
          style={{ letterSpacing: "4%" }}
        >
          {title}
        </h2>
      </div>

      {/* Swiper Slider with Navigation */}
      <div className="relative">
        <Swiper
          spaceBetween={12}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
          }}
          navigation={{
            prevEl: `#${navPrevId}`,
            nextEl: `#${navNextId}`,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          modules={[Navigation, Autoplay]}
          className="pb-4"
        >
          {categories.map((category, index) => (
            <SwiperSlide key={category?.id || index} className="h-auto!">
              <div className="h-72 sm:h-80 md:min-h-128 overflow-hidden">
                <div className="h-full transition-transform duration-300 ease-in-out hover:scale-105">
                  <CategoryGrid
                    category={{
                      ...category,
                      image_url: category.image_url || undefined,
                    }}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button
          id={navPrevId}
          className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 translate-x-1 md:-translate-x-6 z-10 w-8 h-8 sm:w-12 sm:h-12 hidden sm:flex items-center justify-center bg-background rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-foreground" />
        </button>
        <button
          id={navNextId}
          className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1 md:translate-x-6 z-10 w-8 h-8 sm:w-12 sm:h-12 hidden sm:flex items-center justify-center bg-background rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-foreground" />
        </button>
      </div>
    </div>
  );
}

export default FeaturedCollections;
