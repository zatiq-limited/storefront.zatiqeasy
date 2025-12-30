"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import SidebarCategory from "@/components/features/category/sidebar-category";
import TrustCard from "../../../components/trust-card";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

export function LuxuraHeroSection() {
  const { shopDetails } = useShopStore();
  const swiperRef = useRef<SwiperType | null>(null);

  const carousels = shopDetails?.shop_theme?.carousels?.filter(
    (c) => (c as unknown as { tag?: string }).tag === "primary"
  ) || [];

  return (
    <div className="flex gap-6 items-stretch">
      {/* Sidebar Categories - Desktop Only */}
      <div className="hidden lg:block w-[25%] bg-white dark:bg-black-27 lg:h-105 xl:h-150 overflow-auto shadow-md border dark:border-gray-700 rounded-xl">
        <SidebarCategory />
      </div>

      {/* Hero Carousel */}
      <div className="w-full lg:max-w-[75%] overflow-hidden">
        <div className="w-full bg-blue-zatiq h-70 sm:h-80 md:h-90 lg:h-105 xl:h-150 rounded-xl relative">
          {carousels.length > 0 ? (
            <>
              <Swiper
                onBeforeInit={(swiper) => {
                  swiperRef.current = swiper;
                }}
                slidesPerView={1}
                loop={carousels.length > 1}
                rewind={true}
                autoplay={{
                  delay: 2000,
                  disableOnInteraction: false,
                }}
                modules={[Autoplay, Navigation]}
                className="rounded-xl h-full"
              >
                {carousels.map((item: {
                  id?: string | number;
                  image_url?: string;
                  title?: string;
                  sub_title?: string;
                  button_text?: string;
                  button_link?: string;
                }, index: number) => (
                  <SwiperSlide
                    key={item.id || index}
                    onClick={() => item.button_link && window.open(item.button_link)}
                    className={item.button_link ? "cursor-pointer" : ""}
                  >
                    <div className="w-full h-full flex items-center relative">
                      {/* Text Overlay */}
                      {(item.title || item.sub_title) && (
                        <div className="w-1/2 p-3 md:p-5 lg:p-8 xl:pl-12 relative z-20 h-full flex flex-col justify-center bg-linear-to-r from-white/50 to-transparent">
                          {item.title && (
                            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-none line-clamp-2 text-gray-900">
                              {item.title}
                            </h1>
                          )}
                          {item.sub_title && (
                            <p className="line-clamp-3 mt-3 md:mt-4 xl:mt-5 text-gray-700">
                              {item.sub_title}
                            </p>
                          )}
                          {item.button_link && (
                            <div className="mt-4 md:mt-6 xl:mt-8">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(item.button_link);
                                }}
                                className="bg-black/75 px-5 py-2 text-xs md:text-sm xl:text-base rounded-md xl:rounded-xl text-white hover:bg-black transition"
                              >
                                {item.button_text || "Shop Now"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Background Image */}
                      {item.image_url && (
                        <Image
                          src={item.image_url}
                          alt={item.title || "Carousel"}
                          fill
                          className="object-cover absolute inset-0 rounded-xl"
                          priority={index === 0}
                        />
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation Buttons */}
              {carousels.length > 1 && (
                <>
                  <button
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/80 dark:bg-black/50 rounded-full flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-black/70 transition-colors"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={20} className="text-gray-800 dark:text-white" />
                  </button>
                  <button
                    onClick={() => swiperRef.current?.slideNext()}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/80 dark:bg-black/50 rounded-full flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-black/70 transition-colors"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={20} className="text-gray-800 dark:text-white" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-400 to-blue-600 rounded-xl">
              <p className="text-white text-xl font-medium">Welcome to {shopDetails?.shop_name}</p>
            </div>
          )}
        </div>

        {/* Trust Card */}
        <div className="mt-3 md:mt-4 xl:mt-5">
          <TrustCard isWide />
        </div>
      </div>
    </div>
  );
}

export default LuxuraHeroSection;
