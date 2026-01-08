/**
 * Customer Reviews 2
 * List layout with rating distribution sidebar - matches merchant panel design
 */

"use client";

import { useState } from "react";
import { convertSettingsKeys } from "@/lib/settings-utils";
import Image from "next/image";

import type { Review as StoreReview } from "@/stores/productsStore";

type Review = StoreReview;

interface ReviewSummary {
  average_rating: number;
  total_reviews: number;
}

interface CustomerReviews2Props {
  settings?: Record<string, unknown>;
  reviews: Review[];
  reviewSummary?: ReviewSummary;
}

interface CustomerReviews2Settings {
  title?: string;
  showRatingSummary?: boolean;
  showReviewImages?: boolean;
  limit?: number;
  titleColor?: string;
  starColor?: string;
  cardBgColor?: string;
  textColor?: string;
  verifiedBadgeColor?: string;
  accentColor?: string;
  progressBarColor?: string;
}

export default function CustomerReviews2({
  settings = {},
  reviews,
  reviewSummary,
}: CustomerReviews2Props) {
  const s = convertSettingsKeys<CustomerReviews2Settings>(settings);
  const limit = s.limit || 6;
  const [visibleReviews, setVisibleReviews] = useState(limit);

  // Settings with defaults
  const title = s.title || "Customer Reviews";
  const showRatingSummary = s.showRatingSummary !== false;
  const showReviewImages = s.showReviewImages !== false;

  // Colors
  const titleColor = s.titleColor || "#111827";
  const starColor = s.starColor || "#FBBF24";
  const cardBgColor = s.cardBgColor || "#FFFFFF";
  const textColor = s.textColor || "#4B5563";
  const verifiedBadgeColor = s.verifiedBadgeColor || "#059669";
  const accentColor = s.accentColor || "#7C3AED";
  const progressBarColor = s.progressBarColor || "#7C3AED";

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const displayedReviews = reviews.slice(0, visibleReviews);
  const hasMoreReviews = reviews.length > visibleReviews;

  // Calculate rating distribution from reviews
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => Math.floor(r.rating) === rating).length,
    percentage:
      (reviews.filter((r) => Math.floor(r.rating) === rating).length /
        reviews.length) *
      100,
  }));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number, size = "w-5 h-5") => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={size}
          fill="currentColor"
          viewBox="0 0 20 20"
          style={{ color: i < rating ? starColor : "#E5E7EB" }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <section className="py-8 md:py-10 lg:py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6 2xl:px-0">
        {/* Header with Rating Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Title & Overall Rating */}
          <div className="lg:col-span-1">
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: titleColor }}
            >
              {title}
            </h2>

            {showRatingSummary && reviewSummary && (
              <div
                className="rounded-2xl p-6"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}10 0%, ${accentColor}20 100%)`,
                }}
              >
                <div
                  className="text-4xl md:text-5xl font-bold mb-2"
                  style={{ color: titleColor }}
                >
                  {reviewSummary.average_rating.toFixed(1)}
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(Math.round(reviewSummary.average_rating))}
                </div>
                <p className="text-sm" style={{ color: textColor }}>
                  Based on {reviewSummary.total_reviews} reviews
                </p>
              </div>
            )}
          </div>

          {/* Rating Distribution */}
          {showRatingSummary && reviewSummary && (
            <div className="lg:col-span-2 mt-4 lg:mt-0">
              <div className="space-y-3">
                {ratingCounts.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span
                      className="text-sm font-medium w-8"
                      style={{ color: textColor }}
                    >
                      {rating} ★
                    </span>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          background: `linear-gradient(90deg, ${progressBarColor} 0%, ${accentColor} 100%)`,
                        }}
                      />
                    </div>
                    <span
                      className="text-sm w-12 text-right"
                      style={{ color: textColor }}
                    >
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-100 rounded-2xl p-4 md:p-6 hover:shadow-lg transition-shadow"
              style={{ backgroundColor: cardBgColor }}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Avatar & Info */}
                <div className="flex items-center gap-4 md:w-48 shrink-0">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor} 0%, ${progressBarColor} 100%)`,
                    }}
                  >
                    {review.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="font-semibold truncate"
                      style={{ color: titleColor }}
                    >
                      {review.name}
                    </p>
                    {review.reviewer_type === "verified_buyer" && (
                      <span
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${verifiedBadgeColor}15`,
                          color: verifiedBadgeColor,
                        }}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Verified
                      </span>
                    )}
                    {review.created_at && (
                      <p className="text-xs mt-1" style={{ color: textColor }}>
                        {formatDate(review.created_at)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {renderStars(review.rating)}
                  </div>

                  {/* Review Text */}
                  <p className="leading-relaxed" style={{ color: textColor }}>
                    {review.description}
                  </p>

                  {/* Review Images */}
                  {showReviewImages &&
                    review.images &&
                    review.images.length > 0 && (
                      <div className="flex gap-3 mt-4 overflow-x-auto">
                        {review.images.map((img, index) => (
                          <div
                            key={index}
                            className="w-20 h-20 rounded-xl overflow-hidden shrink-0"
                          >
                            <Image
                              src={img}
                              alt={`Review image ${index + 1}`}
                              width={80}
                              height={80}
                              className="object-cover w-full h-full hover:opacity-75 transition-opacity"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {hasMoreReviews && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleReviews((prev) => prev + limit)}
              className="px-8 py-3 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
              style={{
                background: `linear-gradient(90deg, ${accentColor} 0%, ${progressBarColor} 100%)`,
              }}
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
