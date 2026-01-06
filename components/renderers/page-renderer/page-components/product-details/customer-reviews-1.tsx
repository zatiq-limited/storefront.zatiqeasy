/**
 * Customer Reviews 1
 * Grid layout with review cards
 */

"use client";

import { convertSettingsKeys } from "@/lib/settings-utils";
import Image from "next/image";

import type { Review as StoreReview } from "@/stores/productsStore";

type Review = StoreReview;

interface ReviewSummary {
  average_rating: number;
  total_reviews: number;
  rating_distribution?: Record<number, number>;
}

interface CustomerReviews1Props {
  settings?: Record<string, unknown>;
  reviews: Review[];
  reviewSummary?: ReviewSummary;
}

interface CustomerReviews1Settings {
  title?: string;
  showRatingDistribution?: boolean;
  showReviewImages?: boolean;
  showReviewDate?: boolean;
  showAvatar?: boolean;
  gridColumns?: number;
  titleColor?: string;
  starColor?: string;
  cardBgColor?: string;
  cardBorderColor?: string;
  textColor?: string;
  ratingBarColor?: string;
  ratingBarBgColor?: string;
}

export default function CustomerReviews1({
  settings = {},
  reviews,
  reviewSummary,
}: CustomerReviews1Props) {
  const s = convertSettingsKeys<CustomerReviews1Settings>(settings);

  // Settings with defaults
  const title = s.title || "Customer Reviews";
  const showRatingDistribution = s.showRatingDistribution !== false;
  const showReviewImages = s.showReviewImages !== false;
  const showReviewDate = s.showReviewDate !== false;
  const showAvatar = s.showAvatar !== false;
  const gridColumns = s.gridColumns || 2;

  // Colors
  const titleColor = s.titleColor || "#111827";
  const starColor = s.starColor || "#FBBF24";
  const cardBgColor = s.cardBgColor || "#FFFFFF";
  const cardBorderColor = s.cardBorderColor || "#E5E7EB";
  const textColor = s.textColor || "#4B5563";
  const ratingBarColor = s.ratingBarColor || "#FBBF24";
  const ratingBarBgColor = s.ratingBarBgColor || "#E5E7EB";

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number, size = "w-4 h-4") => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`${size} ${i < rating ? "" : "opacity-30"}`}
          fill={starColor}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  const gridClass =
    gridColumns === 1
      ? "grid-cols-1"
      : gridColumns === 3
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2";

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 2xl:px-0">
        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: titleColor }}
          >
            {title}
          </h2>
          {reviewSummary && (
            <div className="flex items-center justify-center gap-3">
              {renderStars(Math.round(reviewSummary.average_rating), "w-5 h-5")}
              <span className="text-lg font-semibold" style={{ color: titleColor }}>
                {reviewSummary.average_rating.toFixed(1)}
              </span>
              <span style={{ color: textColor }}>
                ({reviewSummary.total_reviews} reviews)
              </span>
            </div>
          )}
        </div>

        {/* Rating Distribution */}
        {showRatingDistribution &&
          reviewSummary?.rating_distribution &&
          reviewSummary.total_reviews > 0 && (
            <div className="max-w-md mx-auto mb-10 bg-white p-6 rounded-xl shadow-sm">
              {[5, 4, 3, 2, 1].map((star) => {
                const count =
                  reviewSummary.rating_distribution?.[star] || 0;
                const percentage =
                  reviewSummary.total_reviews > 0
                    ? (count / reviewSummary.total_reviews) * 100
                    : 0;

                return (
                  <div key={star} className="flex items-center gap-3 mb-2">
                    <span
                      className="w-3 text-sm font-medium"
                      style={{ color: textColor }}
                    >
                      {star}
                    </span>
                    <svg
                      className="w-4 h-4"
                      fill={starColor}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div
                      className="flex-1 h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: ratingBarBgColor }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: ratingBarColor,
                        }}
                      />
                    </div>
                    <span
                      className="w-8 text-sm text-right"
                      style={{ color: textColor }}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

        {/* Reviews Grid */}
        <div className={`grid ${gridClass} gap-6`}>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-xl shadow-sm"
              style={{
                backgroundColor: cardBgColor,
                border: `1px solid ${cardBorderColor}`,
              }}
            >
              {/* Review Header */}
              <div className="flex items-start gap-4 mb-4">
                {showAvatar && (
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-purple-500 to-pink-500 text-white font-semibold text-lg">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4
                      className="font-semibold truncate"
                      style={{ color: titleColor }}
                    >
                      {review.name}
                    </h4>
                    {showReviewDate && review.created_at && (
                      <span className="text-sm" style={{ color: textColor }}>
                        {formatDate(review.created_at)}
                      </span>
                    )}
                  </div>
                  <div className="mt-1">{renderStars(review.rating)}</div>
                </div>
              </div>

              {/* Review Comment */}
              <p className="leading-relaxed" style={{ color: textColor }}>
                {review.description}
              </p>

              {/* Review Images */}
              {showReviewImages && review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {review.images.map((img, index) => (
                    <div
                      key={index}
                      className="w-16 h-16 rounded-lg overflow-hidden shrink-0"
                    >
                      <Image
                        src={img}
                        alt={`Review image ${index + 1}`}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
