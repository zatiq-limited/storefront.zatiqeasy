"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FallbackImage } from "@/components/ui/fallback-image";

interface Review {
  id?: number;
  name: string;
  description: string;
  images?: string[];
  rating?: number;
}

interface CustomerReviewsProps {
  reviews: Review[];
}

const CustomerReviews = ({ reviews }: CustomerReviewsProps) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");

  const profileColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
  ];

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <>
      {/* Image Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl font-bold z-10"
            >
              ×
            </button>
            <FallbackImage
              src={modalImageSrc}
              alt="Review image"
              width={800}
              height={800}
              className="object-contain max-h-[90vh]"
            />
          </div>
        </div>
      )}

      <div className="w-full mb-20 xl:mb-32 relative">
        <h4 className="font-semibold mb-10 mt-12 text-xl md:text-2xl dark:text-gray-200 text-center">
          {t("customer_reviews")}
        </h4>

        <div className="w-full overflow-x-auto pb-4">
          <div className="flex gap-6 px-4">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[300px] sm:w-[350px] border-4 border-gray-400 bg-white dark:bg-gray-800 h-[527px] rounded-[41px] overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="h-full flex flex-col justify-center">
                  {review?.images && review.images.length > 0 ? (
                    <div className="flex justify-center items-center h-full cursor-pointer">
                      <FallbackImage
                        src={review.images[0]}
                        alt={review.name}
                        className="w-full object-contain"
                        height={512}
                        width={512}
                        onClick={() => {
                          setModalImageSrc(review.images![0]);
                          setModalOpen(true);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center h-full p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 border rounded-full ${
                            profileColors[index % profileColors.length]
                          }`}
                        />
                        <h3 className="text-gray-800 dark:text-gray-200 font-bold text-xl">
                          {review?.name ?? ""}
                        </h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-normal text-lg leading-snug mt-5 break-words overflow-y-auto">
                        {review?.description ?? ""}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerReviews;
