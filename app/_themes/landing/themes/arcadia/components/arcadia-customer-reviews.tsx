"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { Review } from "@/stores/productsStore";
import { Swiper, SwiperSlide, useSwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useTranslation } from "react-i18next";

interface CustomerReviewsProps {
  reviews: Review[];
  showGradientOverlays?: boolean;
}

export function ArcadiaCustomerReviews({ reviews, showGradientOverlays = true }: CustomerReviewsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const { t } = useTranslation();

  const profileColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
  ];

  const reviewsData = Array(2).fill(reviews).flat();
  const animationDelay = 2;

  const handleImageClick = (imageSrc: string) => {
    setModalImage(imageSrc);
    setModalOpen(true);
  };

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative">
      {/* Image Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <Image
              src={modalImage}
              alt="Review image"
              width={1200}
              height={1200}
              className="object-contain max-h-[90vh]"
            />
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* <h2 className="text-center text-gray-700 dark:text-gray-200 font-bold text-xl sm:text-2xl lg:text-3xl xl:text-4xl mt-2.5 relative w-50 sm:w-full mx-auto mb-8">
        {t("customer_reviews")}
      </h2> */}

      <div className="w-full overflow-hidden">
        <Swiper
          autoplay={{
            delay: animationDelay * 1000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          loop={true}
          slidesPerView={1.3}
          centeredSlides={true}
          breakpoints={{
            500: { slidesPerView: 2 },
            700: { slidesPerView: 2.3 },
            800: { slidesPerView: 2.6 },
            900: { slidesPerView: 3 },
            1024: { slidesPerView: 3.3 },
            1124: { slidesPerView: 3.3 },
            1280: { slidesPerView: 3.3 },
            1440: { slidesPerView: 3.5 },
          }}
          className="flex items-center"
        >
          {reviewsData.map((review, index) => (
            <SwiperSlide
              key={`${review.id}-${index}`}
              className="flex items-center py-8 sm:py-10 md:pt-20"
            >
              <ReviewCard
                review={review}
                index={index}
                profileColors={profileColors}
                onImageClick={handleImageClick}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Gradient overlays */}
      {showGradientOverlays && (
        <>
          <div className="h-full w-[10%] right-0 bottom-0 absolute z-10 pointer-events-none"></div>
          <div className="h-full w-[10%] left-0 bottom-0 absolute z-10 pointer-events-none"></div>
        </>
      )}
    </div>
  );
}

interface ReviewCardProps {
  review: Review;
  index: number;
  profileColors: string[];
  onImageClick: (src: string) => void;
}

function ReviewCard({
  review,
  index,
  profileColors,
  onImageClick,
}: ReviewCardProps) {
  const { isActive } = useSwiperSlide();
  const scaleClass = isActive ? "scale-[1]" : "scale-[0.9]";

  return (
    <div
      className={`border-[5px] border-gray-500 bg-white dark:bg-gray-800 h-130 rounded-[41px] overflow-hidden transition-all duration-[2000] sm:aspect-9/16 ${scaleClass}`}
    >
      <div className="h-full flex flex-col justify-center">
        {review?.images && review.images.length > 0 ? (
          <div className="flex justify-center items-center h-full cursor-pointer">
            <Image
              src={review.images[0]}
              alt={review.name || "Review"}
              width={512}
              height={512}
              className="w-full h-full object-contain"
              onClick={() => onImageClick(review.images![0])}
            />
          </div>
        ) : (
          <div className="flex flex-col justify-center h-full p-3 sm:p-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 border rounded-full ${
                  profileColors[index % profileColors.length]
                }`}
              ></div>
              <h3 className="text-gray-800 dark:text-gray-200 font-bold text-lg md:text-xl">
                {review?.name ?? "Anonymous"}
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-normal text-base md:text-lg leading-snug mt-5 wrap-break-words overflow-y-hidden">
              {review?.description ?? ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
