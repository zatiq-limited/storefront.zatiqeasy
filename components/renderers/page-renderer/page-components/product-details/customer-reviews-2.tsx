/**
 * Customer Reviews 2
 * List layout with rating summary sidebar
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
  rating_distribution?: Record<number, number>;
}

interface CustomerReviews2Props {
  settings?: Record<string, unknown>;
  reviews: Review[];
  reviewSummary?: ReviewSummary;
}

interface CustomerReviews2Settings {
  title?: string;
  subtitle?: string;
  showRatingSummary?: boolean;
  showReviewImages?: boolean;
  showReviewDate?: boolean;
  showVerifiedBadge?: boolean;
  reviewsPerPage?: number;
  accentColor?: string;
  titleColor?: string;
  starColor?: string;
  cardBgColor?: string;
  textColor?: string;
  verifiedBadgeColor?: string;
}

export default function CustomerReviews2({
  settings = {},
  reviews,
  reviewSummary,
}: CustomerReviews2Props) {
  const s = convertSettingsKeys<CustomerReviews2Settings>(settings);
  const [visibleReviews, setVisibleReviews] = useState(
    s.reviewsPerPage || 5
  );

  // Settings with defaults
  const title = s.title || "What Our Customers Say";
  const subtitle = s.subtitle || "";
  const showRatingSummary = s.showRatingSummary !== false;
  const showReviewImages = s.showReviewImages !== false;
  const showReviewDate = s.showReviewDate !== false;
  const showVerifiedBadge = s.showVerifiedBadge !== false;
  const reviewsPerPage = s.reviewsPerPage || 5;

  // Colors
  const accentColor = s.accentColor || "#7C3AED";
  const titleColor = s.titleColor || "#111827";
  const starColor = s.starColor || "#FBBF24";
  const cardBgColor = s.cardBgColor || "#FFFFFF";
  const textColor = s.textColor || "#4B5563";
  const verifiedBadgeColor = s.verifiedBadgeColor || "#10B981";

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
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

  const displayedReviews = reviews.slice(0, visibleReviews);
  const hasMoreReviews = reviews.length > visibleReviews;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 2xl:px-0">
        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: titleColor }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg" style={{ color: textColor }}>
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Rating Summary Sidebar */}
          {showRatingSummary && reviewSummary && (
            <div className="lg:col-span-1">
              <div
                className="sticky top-4 p-6 rounded-2xl text-center"
                style={{ backgroundColor: cardBgColor }}
              >
                <div
                  className="text-5xl font-bold mb-2"
                  style={{ color: accentColor }}
                >
                  {reviewSummary.average_rating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(
                    Math.round(reviewSummary.average_rating),
                    "w-6 h-6"
                  )}
                </div>
                <p className="text-sm mb-6" style={{ color: textColor }}>
                  Based on {reviewSummary.total_reviews} reviews
                </p>

                {/* Rating Distribution */}
                {reviewSummary.rating_distribution && (
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count =
                        reviewSummary.rating_distribution?.[star] || 0;
                      const percentage =
                        reviewSummary.total_reviews > 0
                          ? (count / reviewSummary.total_reviews) * 100
                          : 0;

                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span
                            className="w-3 text-xs font-medium"
                            style={{ color: textColor }}
                          >
                            {star}
                          </span>
                          <svg
                            className="w-3 h-3"
                            fill={starColor}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: accentColor,
                              }}
                            />
                          </div>
                          <span
                            className="w-6 text-xs text-right"
                            style={{ color: textColor }}
                          >
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div
            className={`space-y-4 ${
              showRatingSummary && reviewSummary
                ? "lg:col-span-3"
                : "lg:col-span-4"
            }`}
          >
            {displayedReviews.map((review) => (
              <div
                key={review.id}
                className="p-6 rounded-xl border border-gray-100 shadow-sm"
                style={{ backgroundColor: cardBgColor }}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
                    <div
                      className="w-full h-full flex items-center justify-center text-white font-semibold text-lg"
                      style={{ backgroundColor: accentColor }}
                    >
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h4
                        className="font-semibold"
                        style={{ color: titleColor }}
                      >
                        {review.name}
                      </h4>
                      {showVerifiedBadge && (
                        <span
                          className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
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
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Verified
                        </span>
                      )}
                      {showReviewDate && review.created_at && (
                        <span className="text-sm" style={{ color: textColor }}>
                          {formatDate(review.created_at)}
                        </span>
                      )}
                    </div>

                    <div className="mb-3">{renderStars(review.rating)}</div>

                    <p className="leading-relaxed" style={{ color: textColor }}>
                      {review.description}
                    </p>

                    {/* Review Images */}
                    {showReviewImages &&
                      review.images &&
                      review.images.length > 0 && (
                        <div className="flex gap-2 mt-4 overflow-x-auto">
                          {review.images.map((img, index) => (
                            <div
                              key={index}
                              className="w-20 h-20 rounded-lg overflow-hidden shrink-0"
                            >
                              <Image
                                src={img}
                                alt={`Review image ${index + 1}`}
                                width={80}
                                height={80}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}

            {/* Load More Button */}
            {hasMoreReviews && (
              <div className="text-center pt-4">
                <button
                  onClick={() =>
                    setVisibleReviews((prev) => prev + reviewsPerPage)
                  }
                  className="px-6 py-3 rounded-lg font-semibold transition-colors"
                  style={{
                    backgroundColor: `${accentColor}15`,
                    color: accentColor,
                  }}
                >
                  Load More Reviews
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
