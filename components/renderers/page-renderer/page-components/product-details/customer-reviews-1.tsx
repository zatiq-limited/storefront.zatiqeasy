import React from 'react';
import type { Review, Product } from '@/stores/productsStore';

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
  viewMode?: 'desktop' | 'tablet' | 'mobile';
}

interface CustomerReviews1Props {
  settings: CustomerReviews1Settings;
  reviews?: Review[];
  reviewSummary?: Product['review_summary'];
}

const CustomerReviews1 = ({ settings, reviews = [], reviewSummary }: CustomerReviews1Props) => {
  const {
    title = 'Customer Reviews',
    showRatingSummary = true,
    showReviewImages = true,
    columns = 3,
    limit = 6,
    titleColor = '#111827',
    starColor = '#FBBF24',
    cardBgColor = '#FFFFFF',
    textColor = '#4B5563',
    verifiedBadgeColor = '#059669',
    viewMode = 'desktop',
  } = settings;

  // Provide default values for reviewSummary
  const summary = reviewSummary || {
    average_rating: 0,
    total_reviews: 0,
    rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  };
  // Helper to check current view mode
  const isMobile = viewMode === 'mobile';
  const isTablet = viewMode === 'tablet';

  // Helper to get container padding class based on viewMode (NO breakpoints)
  const getContainerPaddingClass = () => {
    if (isMobile) return 'px-4';
    if (isTablet) return 'px-6';
    return 'px-4';
  };

  // Get section padding based on viewMode (NO breakpoints)
  const getSectionPaddingClass = () => {
    if (isMobile) return 'py-8';
    if (isTablet) return 'py-10';
    return 'py-12';
  };

  // Get header layout based on viewMode (NO breakpoints)
  const getHeaderLayoutClass = () => {
    if (isMobile) return 'flex-col gap-4';
    return 'flex-row items-center justify-between gap-4';
  };

  // Get title size based on viewMode (NO breakpoints)
  const getTitleSizeClass = () => {
    if (isMobile) return 'text-2xl';
    return 'text-3xl';
  };

  // Get grid columns based on viewMode (NO breakpoints)
  const getGridClass = () => {
    if (isMobile) return 'grid-cols-1';
    if (isTablet) return 'grid-cols-2';

    // Desktop
    const colsMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
    };
    return colsMap[columns] || 'grid-cols-3';
  };

  // Use real reviews data
  const displayedReviews = reviews.slice(0, limit);

  return (
    <section className={getSectionPaddingClass()}>
      <div className={`container mx-auto ${getContainerPaddingClass()}`}>
        {/* Header */}
        <div className={`flex ${getHeaderLayoutClass()} mb-8`}>
          <h2 className={`${getTitleSizeClass()} font-bold`} style={{ color: titleColor }}>
            {title}
          </h2>

          {showRatingSummary && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    style={{
                      color: i < Math.floor(summary.average_rating) ? starColor : '#D1D5DB',
                    }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-lg font-semibold" style={{ color: titleColor }}>
                {summary.average_rating.toFixed(1)}
              </span>
              <span style={{ color: textColor }}>({summary.total_reviews} reviews)</span>
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
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    style={{ color: i < review.rating ? starColor : '#D1D5DB' }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Review Text */}
              <p className="text-sm mb-4 line-clamp-3" style={{ color: textColor }}>
                {review.description}
              </p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-sm">
                    {review.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm" style={{ color: titleColor }}>
                    {review.name}
                  </p>
                  {review.reviewer_type === 'verified_buyer' && (
                    <p className="text-xs" style={{ color: verifiedBadgeColor }}>
                      ✓ Verified Purchase
                    </p>
                  )}
                  {review.created_at && (
                    <p className="text-xs" style={{ color: textColor }}>
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </div>

              {/* Review Images */}
              {showReviewImages && review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {review.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt="Review"
                      className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:opacity-75 hover:ring-2 hover:ring-blue-500 transition-all"
                    />
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
};

export default CustomerReviews1;
