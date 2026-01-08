/**
 * Customer Reviews 1
 * Grid layout with review cards - matches merchant panel design
 */

"use client";

import { convertSettingsKeys } from "@/lib/settings-utils";
import Image from "next/image";

import type { Review as StoreReview } from "@/stores/productsStore";

type Review = StoreReview;

interface ReviewSummary {
  average_rating: number;
  total_reviews: number;
}

interface CustomerReviews1Props {
  settings?: Record<string, unknown>;
  reviews: Review[];
  reviewSummary?: ReviewSummary;
}

interface CustomerReviews1Settings {
  title?: string;
  showRatingSummary?: boolean;
  showReviewImages?: boolean;
  columns?: number;
  limit?: number;
  titleColor?: string;
  starColor?: string;
  cardBgColor?: string;
  textColor?: string;
  verifiedBadgeColor?: string;
}

export default function CustomerReviews1({
  settings = {},
  reviews,
  reviewSummary,
}: CustomerReviews1Props) {
  const s = convertSettingsKeys<CustomerReviews1Settings>(settings);

  // Settings with defaults
  const title = s.title || "Customer Reviews";
  const showRatingSummary = s.showRatingSummary !== false;
  const showReviewImages = s.showReviewImages !== false;
  const columns = s.columns || 3;
  const limit = s.limit || 6;

  // Colors
  const titleColor = s.titleColor || "#111827";
  const starColor = s.starColor || "#FBBF24";
  const cardBgColor = s.cardBgColor || "#FFFFFF";
  const textColor = s.textColor || "#4B5563";
  const verifiedBadgeColor = s.verifiedBadgeColor || "#059669";

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const displayedReviews = reviews.slice(0, limit);

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
          className={size}
          fill="currentColor"
          viewBox="0 0 20 20"
          style={{ color: i < rating ? starColor : "#D1D5DB" }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  // Responsive grid classes based on columns setting
  const getGridClass = () => {
    const colsMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };
    return colsMap[columns] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <section className="py-8 md:py-10 lg:py-12">
      <div className="container mx-auto px-4 md:px-6 2xl:px-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ color: titleColor }}
          >
            {title}
          </h2>

          {showRatingSummary && reviewSummary && (
            <div className="flex items-center gap-4">
              {renderStars(Math.round(reviewSummary.average_rating), "w-6 h-6")}
              <span
                className="text-lg font-semibold"
                style={{ color: titleColor }}
              >
                {reviewSummary.average_rating.toFixed(1)}
              </span>
              <span style={{ color: textColor }}>
                ({reviewSummary.total_reviews} reviews)
              </span>
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        <div className={`grid ${getGridClass()} gap-6`}>
          {displayedReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl p-6 shadow-sm"
              style={{ backgroundColor: cardBgColor }}
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {renderStars(review.rating)}
              </div>

              {/* Review Text */}
              <p
                className="text-sm mb-4 line-clamp-3"
                style={{ color: textColor }}
              >
                {review.description}
              </p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-gray-600 font-medium text-sm">
                    {review.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p
                    className="font-medium text-sm truncate"
                    style={{ color: titleColor }}
                  >
                    {review.name}
                  </p>
                  {review.reviewer_type === "verified_buyer" && (
                    <p className="text-xs" style={{ color: verifiedBadgeColor }}>
                      ✓ Verified Purchase
                    </p>
                  )}
                  {review.created_at && (
                    <p className="text-xs" style={{ color: textColor }}>
                      {formatDate(review.created_at)}
                    </p>
                  )}
                </div>
              </div>

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
                        className="object-cover w-full h-full hover:opacity-75 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View All Button */}
        {reviews.length > limit && (
          <div className="text-center mt-8">
            <button className="px-8 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors">
              View All {reviews.length} Reviews
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
