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
      <div className="py-6 md:py-8 text-center px-4">
        <p className="text-xs sm:text-sm text-muted-foreground mb-4">
          Showing <span className="font-semibold text-foreground">{to}</span> of{" "}
          <span className="font-semibold text-foreground">{total}</span>{" "}
          products
        </p>
        {current_page < total_pages && (
          <button
            onClick={() => onLoadMore?.() || handlePageChange(current_page + 1)}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-foreground text-background rounded-full font-medium hover:opacity-90 transition-all inline-flex items-center gap-2 shadow-md hover:shadow-lg text-sm sm:text-base"
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
          <div className="w-full bg-muted rounded-full h-1.5 sm:h-2 max-w-xs sm:max-w-sm mx-auto">
            <div
              className="bg-primary h-1.5 sm:h-2 rounded-full transition-all duration-500"
              style={{ width: `${(to / total) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {Math.round((to / total) * 100)}% loaded
          </p>
        </div>
      </div>
    );
  }

  // Standard Pagination Style
  return (
    <div className="py-6 md:py-8 max-w-[1440px] mx-auto px-4 2xl:px-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Page Info - Hidden on mobile, shown on tablet+ */}
        <p className="hidden sm:block text-xs sm:text-sm text-muted-foreground order-1">
          Page{" "}
          <span className="font-semibold text-foreground">{current_page}</span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">{total_pages}</span>
        </p>

        {/* Navigation - Centered on all devices */}
        <div className="flex items-center gap-1 sm:gap-1.5 order-2 sm:order-2">
          {/* Previous */}
          {showPrevNext && (
            <button
              onClick={() => handlePageChange(current_page - 1)}
              disabled={current_page === 1}
              aria-label="Previous page"
              className={`p-2 rounded-lg transition-all ${
                current_page === 1
                  ? "text-muted-foreground/40 cursor-not-allowed"
                  : "text-foreground hover:bg-muted/50 shadow-sm"
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
                    aria-label={`Go to page ${pageNum}`}
                    aria-current={pageNum === current_page ? "page" : undefined}
                    className={`min-w-9 sm:w-10 h-9 sm:h-10 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                      pageNum === current_page
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-foreground hover:bg-muted/50 shadow-sm"
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
              aria-label="Next page"
              className={`p-2 rounded-lg transition-all ${
                current_page === total_pages
                  ? "text-muted-foreground/40 cursor-not-allowed"
                  : "text-foreground hover:bg-muted/50 shadow-sm"
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
        <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right order-3 w-full sm:w-auto">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {from}-{to}
          </span>{" "}
          of <span className="font-semibold text-foreground">{total}</span>
        </p>
      </div>
    </div>
  );
};

export default ProductsPagination2;
