import React from 'react';
import type { Review, Product } from '@/stores/productsStore';

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
  viewMode?: 'desktop' | 'tablet' | 'mobile';
}

interface CustomerReviews2Props {
  settings: CustomerReviews2Settings;
  reviews?: Review[];
  reviewSummary?: Product['review_summary'];
}

const CustomerReviews2 = ({ settings, reviews = [], reviewSummary }: CustomerReviews2Props) => {
  const {
    title = 'Customer Reviews',
    showRatingSummary = true,
    showReviewImages = true,
    limit = 6,
    titleColor = '#111827',
    starColor = '#FBBF24',
    cardBgColor = '#FFFFFF',
    textColor = '#4B5563',
    verifiedBadgeColor = '#059669',
    accentColor = '#7C3AED',
    progressBarColor = '#7C3AED',
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

  // Get header grid based on viewMode (NO breakpoints)
  const getHeaderGridClass = () => {
    if (isMobile) return 'grid-cols-1';
    return 'grid-cols-1 lg:grid-cols-3';
  };

  // Get title size based on viewMode (NO breakpoints)
  const getTitleSizeClass = () => {
    if (isMobile) return 'text-2xl';
    return 'text-3xl';
  };

  // Get rating distribution col span based on viewMode (NO breakpoints)
  const getRatingColSpan = () => {
    if (isMobile) return '';
    return 'lg:col-span-2';
  };

  // Get review card layout based on viewMode (NO breakpoints)
  const getReviewCardLayoutClass = () => {
    if (isMobile) return 'flex-col';
    return 'flex-col md:flex-row md:items-start';
  };

  // Get avatar section width based on viewMode (NO breakpoints)
  const getAvatarSectionClass = () => {
    if (isMobile) return 'gap-4';
    return 'gap-4 md:w-48 shrink-0';
  };

  // Use real reviews data
  const displayedReviews = reviews.slice(0, limit);

  // Calculate rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => Math.floor(r.rating) === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter((r) => Math.floor(r.rating) === rating).length / reviews.length) * 100 : 0,
  }));

  return (
    <section className={`${getSectionPaddingClass()} bg-white`}>
      <div className={`container mx-auto ${getContainerPaddingClass()}`}>
        {/* Header with Rating Summary */}
        <div className={`grid ${getHeaderGridClass()} gap-8 mb-10`}>
          {/* Title & Overall Rating */}
          <div className="lg:col-span-1">
            <h2 className={`${getTitleSizeClass()} font-bold mb-4`} style={{ color: titleColor }}>
              {title}
            </h2>

            {showRatingSummary && (
              <div
                className="rounded-2xl p-6"
                style={{ background: `linear-gradient(135deg, ${accentColor}10 0%, ${accentColor}20 100%)` }}
              >
                <div className="text-5xl font-bold mb-2" style={{ color: titleColor }}>
                  {summary.average_rating.toFixed(1)}
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5"
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
                <p className="text-sm" style={{ color: textColor }}>
                  Based on {summary.total_reviews} reviews
                </p>
              </div>
            )}
          </div>

          {/* Rating Distribution */}
          {showRatingSummary && (
            <div className={`${getRatingColSpan()} mt-4`}>
              <div className="space-y-3">
                {ratingCounts.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-8" style={{ color: textColor }}>
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
                    <span className="text-sm w-12 text-right" style={{ color: textColor }}>
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
              className="border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              style={{ backgroundColor: cardBgColor }}
            >
              <div className={`flex ${getReviewCardLayoutClass()} gap-4`}>
                {/* Avatar & Info */}
                <div className={`flex items-center ${getAvatarSectionClass()}`}>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                    style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${progressBarColor} 100%)` }}
                  >
                    {review.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: titleColor }}>
                      {review.name}
                    </p>
                    {review.reviewer_type === 'verified_buyer' && (
                      <span
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${verifiedBadgeColor}15`, color: verifiedBadgeColor }}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
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
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{ color: i < review.rating ? starColor : '#E5E7EB' }}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="leading-relaxed" style={{ color: textColor }}>
                    {review.description}
                  </p>

                  {/* Review Images */}
                  {showReviewImages && review.images && review.images.length > 0 && (
                    <div className="flex gap-3 mt-4">
                      {review.images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt="Review"
                          className="w-20 h-20 rounded-xl object-cover cursor-pointer hover:opacity-75 transition-opacity"
                          style={{ boxShadow: `0 0 0 2px ${accentColor}00`, transition: 'box-shadow 0.2s' }}
                          onMouseEnter={(e) => (e.target.style.boxShadow = `0 0 0 2px ${accentColor}`)}
                          onMouseLeave={(e) => (e.target.style.boxShadow = `0 0 0 2px ${accentColor}00`)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {reviews.length > limit && (
          <div className="text-center mt-10">
            <button
              className="px-8 py-3 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
              style={{ background: `linear-gradient(90deg, ${accentColor} 0%, ${progressBarColor} 100%)` }}
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerReviews2;
