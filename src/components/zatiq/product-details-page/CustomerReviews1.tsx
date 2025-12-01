import React, { useState } from "react";

interface Review {
  id: number;
  name: string;
  description: string;
  rating: number;
  reviewer_type?: string;
  created_at?: string;
  images?: string[];
}

interface ReviewSummary {
  average_rating: number;
  total_reviews: number;
}

interface CustomerReviews1Props {
  settings?: {
    title?: string;
    showRatingSummary?: boolean;
    showReviewImages?: boolean;
    columns?: number;
    limit?: number;
  };
  reviews: Review[];
  reviewSummary?: ReviewSummary;
}

const CustomerReviews1: React.FC<CustomerReviews1Props> = ({
  settings = {},
  reviews = [],
  reviewSummary,
}) => {
  const {
    title = "Customer Reviews",
    showRatingSummary = true,
    showReviewImages = true,
    columns = 3,
    limit = 6,
  } = settings;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (images: string[], index: number) => {
    setCurrentImages(images);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : currentImages.length - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev < currentImages.length - 1 ? prev + 1 : 0));
  };

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const displayedReviews = reviews.slice(0, limit);

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
    <section className="py-8 sm:py-12">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>

          {showRatingSummary && reviewSummary && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(reviewSummary.average_rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {reviewSummary.average_rating.toFixed(1)}
              </span>
              <span className="text-gray-500">({reviewSummary.total_reviews} reviews)</span>
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        <div className={`grid ${getGridClass()} gap-6`}>
          {displayedReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm">
              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{review.description}</p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-sm">
                    {review.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{review.name}</p>
                  {review.reviewer_type === "verified_buyer" && (
                    <p className="text-xs text-green-600">✓ Verified Purchase</p>
                  )}
                  {review.created_at && (
                    <p className="text-xs text-gray-500">
                      {new Date(review.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
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
                      onClick={() => openLightbox(review.images!, index)}
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

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous Button */}
          {currentImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-full"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div onClick={(e) => e.stopPropagation()} className="max-w-7xl max-h-[90vh] mx-4">
            <img
              src={currentImages[currentImageIndex]}
              alt="Review"
              className="max-w-full max-h-[90vh] object-contain"
            />
            {currentImages.length > 1 && (
              <div className="text-center text-white mt-4">
                {currentImageIndex + 1} / {currentImages.length}
              </div>
            )}
          </div>

          {/* Next Button */}
          {currentImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-full"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default CustomerReviews1;
