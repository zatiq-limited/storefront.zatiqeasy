/**
 * ========================================
 * PRODUCTS PAGINATION 2 - LOAD MORE STYLE
 * ========================================
 *
 * Pagination with load more button and progress bar
 */

"use client";

interface ProductsPagination2Props {
  // Settings
  showPageNumbers?: boolean;
  showPrevNext?: boolean;
  showLoadMore?: boolean;
  loadMoreText?: string;

  // Pagination data
  currentPage?: number;
  totalPages?: number;
  from?: number;
  to?: number;
  total?: number;

  // Colors
  activeColor?: string;
  textColor?: string;

  // Callbacks
  onPageChange?: (page: number) => void;
  onLoadMore?: () => void;
}

export default function ProductsPagination2({
  showPageNumbers = true,
  showPrevNext = true,
  showLoadMore = false,
  loadMoreText = "Load More Products",
  currentPage = 1,
  totalPages = 10,
  from = 1,
  to = 20,
  total = 120,
  activeColor = "#3B82F6",
  textColor = "#374151",
  onPageChange,
  onLoadMore,
}: ProductsPagination2Props) {
  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Load More Style
  if (showLoadMore) {
    return (
      <div className="py-6 md:py-8 text-center px-4">
        <p className="text-xs sm:text-sm text-gray-500 mb-4">
          Showing <span className="font-semibold text-gray-900">{to}</span> of{" "}
          <span className="font-semibold text-gray-900">{total}</span> products
        </p>
        {currentPage < totalPages && (
          <button
            onClick={() =>
              onLoadMore ? onLoadMore() : handlePageChange(currentPage + 1)
            }
            className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium hover:opacity-90 transition-all inline-flex items-center gap-2 shadow-md hover:shadow-lg text-sm sm:text-base"
            style={{ backgroundColor: activeColor, color: "#FFFFFF" }}
          >
            {loadMoreText}
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
        <div className="mt-4 sm:mt-6">
          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 max-w-xs sm:max-w-sm mx-auto">
            <div
              className="h-1.5 sm:h-2 rounded-full transition-all duration-500"
              style={{
                width: `${(to / total) * 100}%`,
                backgroundColor: activeColor,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {Math.round((to / total) * 100)}% loaded
          </p>
        </div>
      </div>
    );
  }

  // Standard Pagination Style
  return (
    <div className="py-6 md:py-8 container">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Page Info - Hidden on mobile, shown on tablet+ */}
        <p className="hidden sm:block text-xs sm:text-sm text-gray-500 order-1">
          Page{" "}
          <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
          <span className="font-semibold text-gray-900">{totalPages}</span>
        </p>

        {/* Navigation - Centered on all devices */}
        <div className="flex items-center gap-1 sm:gap-1.5 order-2 sm:order-2">
          {/* Previous */}
          {showPrevNext && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className={`p-2 rounded-lg transition-all ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-900 hover:bg-gray-100 shadow-sm"
              }`}
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Page Numbers */}
          {showPageNumbers && (
            <div className="flex items-center gap-1 px-1 sm:px-2">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    aria-label={`Go to page ${pageNum}`}
                    aria-current={pageNum === currentPage ? "page" : undefined}
                    className={`min-w-9 sm:w-10 h-9 sm:h-10 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                      pageNum === currentPage
                        ? "shadow-md"
                        : "hover:bg-gray-100 shadow-sm"
                    }`}
                    style={
                      pageNum === currentPage
                        ? { backgroundColor: activeColor, color: "#FFFFFF" }
                        : { color: textColor }
                    }
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}

          {/* Next */}
          {showPrevNext && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className={`p-2 rounded-lg transition-all ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-900 hover:bg-gray-100 shadow-sm"
              }`}
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Results Info - Full width on mobile, right aligned on tablet+ */}
        <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-right order-3 w-full sm:w-auto">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {from}-{to}
          </span>{" "}
          of <span className="font-semibold text-gray-900">{total}</span>
        </p>
      </div>
    </div>
  );
}
