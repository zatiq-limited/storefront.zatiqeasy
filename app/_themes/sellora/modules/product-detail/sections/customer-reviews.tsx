"use client";

import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { FallbackImage } from "@/components/ui/fallback-image";

interface Review {
  name?: string;
  description?: string;
  images?: string[];
  rating?: number;
  created_at?: string;
}

interface CustomerReviewsProps {
  reviews: Review[];
}

// Image Modal Component
function ImageModal({
  isOpen,
  imgSrc,
  imgAlt,
  onClose,
}: {
  isOpen: boolean;
  imgSrc: string;
  imgAlt: string;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
      >
        <X size={24} />
      </button>
      <div className="relative max-w-4xl max-h-[90vh] overflow-hidden">
        <FallbackImage
          src={imgSrc}
          alt={imgAlt}
          width={800}
          height={600}
          className="max-w-full max-h-[90vh] object-contain"
        />
      </div>
    </div>
  );
}

export function CustomerReviews({ reviews }: CustomerReviewsProps) {
  const { t } = useTranslation();
  const [visibleReviews, setVisibleReviews] = useState(4);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState({ src: "", alt: "" });

  const getInitials = useCallback((name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const handleImageClick = useCallback((src: string, alt: string) => {
    setModalImage({ src, alt });
    setModalOpen(true);
  }, []);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const displayedReviews = reviews.slice(0, visibleReviews);
  const hasMore = reviews.length > visibleReviews;

  return (
    <section className="w-full py-6 sm:py-8 lg:py-10 border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        imgSrc={modalImage.src}
        imgAlt={modalImage.alt}
        onClose={() => setModalOpen(false)}
      />

      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl lg:text-3xl font-normal text-gray-900 dark:text-white">
            {t("reviews") || "Reviews"}
          </h2>
        </div>

        {/* Reviews List */}
        <div className="space-y-4 sm:space-y-6">
          {displayedReviews.map((review, index) => (
            <div
              key={`${review.name}-${index}`}
              className="pt-4 pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              {/* Review Header */}
              <div className="flex sm:items-start gap-2 sm:gap-0 mb-3 sm:mb-4">
                {review.name && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold text-sm shrink-0">
                      {getInitials(review.name || "Anonymous")}
                    </div>
                    <div>
                      <h3 className="text-nowrap font-normal text-sm sm:text-base text-gray-900 dark:text-white">
                        {review.name || "User"}
                      </h3>
                      {/* Star Rating */}
                      <div className="flex items-center gap-0.5 sm:gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 sm:w-4 sm:h-4 ${
                              i < (review.rating || 5)
                                ? "fill-yellow-400"
                                : "fill-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {review.created_at && (
                  <div className="w-full text-end text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                )}
              </div>

              {/* Review Description */}
              {review.description && (
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 ml-0 sm:ml-14">
                  {review.description}
                </p>
              )}

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div
                  className="mb-3 sm:mb-4 ml-0 sm:ml-14 cursor-pointer rounded-lg overflow-hidden w-56 sm:w-72 aspect-3/4"
                  onClick={() =>
                    handleImageClick(review.images![0], review.name || "Review")
                  }
                >
                  <FallbackImage
                    src={review.images[0]}
                    alt={review.name || "Review"}
                    height={180}
                    width={120}
                    className="w-full h-full object-cover object-top hover:opacity-90 transition-opacity"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {hasMore && (
          <div className="w-full sm:max-w-3xl sm:mx-auto mt-4 sm:mt-6">
            <button
              onClick={() => setVisibleReviews((prev) => prev + 4)}
              className="w-full mx-auto px-6 sm:px-8 py-2.5 sm:py-3 cursor-pointer text-center border border-gray-300 dark:border-gray-600 rounded-md text-sm sm:text-base text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {t("show_more") || "Show more"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default CustomerReviews;
