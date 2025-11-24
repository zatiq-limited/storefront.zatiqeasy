import React from "react";

interface ProductsPagination2Props {
  settings?: {
    showPageNumbers?: boolean;
    showPrevNext?: boolean;
    showLoadMore?: boolean;
    loadMoreText?: string;
  };
  pagination?: {
    current_page: number;
    total_pages: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  onPageChange?: (page: number) => void;
  onLoadMore?: () => void;
}

const ProductsPagination2: React.FC<ProductsPagination2Props> = ({
  settings = {},
  pagination,
  onPageChange,
  onLoadMore,
}) => {
  const {
    showPageNumbers = true,
    showPrevNext = true,
    showLoadMore = false,
    loadMoreText = "Load More Products",
  } = settings;

  if (!pagination || pagination.total_pages <= 1) {
    return null;
  }

  const { current_page, total_pages, from, to, total } = pagination;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > total_pages || page === current_page) return;

    if (onPageChange) {
      onPageChange(page);
    } else {
      const url = new URL(window.location.href);
      url.searchParams.set("page", page.toString());
      window.location.href = url.toString();
    }
  };

  // Load More Style
  if (showLoadMore) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-gray-500 mb-4">
          Showing {to} of {total} products
        </p>
        {current_page < total_pages && (
          <button
            onClick={() => onLoadMore?.() || handlePageChange(current_page + 1)}
            className="px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
          >
            {loadMoreText}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-1.5 max-w-xs mx-auto">
            <div
              className="bg-gray-900 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(to / total) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Standard Pagination Style
  return (
    <div className="py-8">
      <div className="flex items-center justify-between">
        {/* Page Info */}
        <p className="text-sm text-gray-600">
          Page <span className="font-semibold">{current_page}</span> of{" "}
          <span className="font-semibold">{total_pages}</span>
        </p>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          {/* Previous */}
          {showPrevNext && (
            <button
              onClick={() => handlePageChange(current_page - 1)}
              disabled={current_page === 1}
              className={`p-2 rounded-lg transition-colors ${
                current_page === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Page Numbers */}
          {showPageNumbers && (
            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: Math.min(5, total_pages) }).map((_, i) => {
                let pageNum: number;
                if (total_pages <= 5) {
                  pageNum = i + 1;
                } else if (current_page <= 3) {
                  pageNum = i + 1;
                } else if (current_page >= total_pages - 2) {
                  pageNum = total_pages - 4 + i;
                } else {
                  pageNum = current_page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                      pageNum === current_page
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
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
              onClick={() => handlePageChange(current_page + 1)}
              disabled={current_page === total_pages}
              className={`p-2 rounded-lg transition-colors ${
                current_page === total_pages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Results Info */}
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{from}-{to}</span> of{" "}
          <span className="font-semibold">{total}</span>
        </p>
      </div>
    </div>
  );
};

export default ProductsPagination2;
