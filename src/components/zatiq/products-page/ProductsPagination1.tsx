import React from "react";

interface ProductsPagination1Props {
  settings?: {
    showPageNumbers?: boolean;
    showPrevNext?: boolean;
    maxVisiblePages?: number;
    position?: "left" | "center" | "right";
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
  activeColor?: string;
  textColor?: string;
}

const ProductsPagination1: React.FC<ProductsPagination1Props> = ({
  settings = {},
  pagination,
  onPageChange,
  activeColor = "#3B82F6",
  textColor = "#374151",
}) => {
  const {
    showPageNumbers = true,
    showPrevNext = true,
    maxVisiblePages = 5,
    position = "center",
  } = settings;

  if (!pagination || pagination.total_pages <= 1) {
    return null;
  }

  const { current_page, total_pages } = pagination;

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

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages: number[] = [];
    let startPage = Math.max(1, current_page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(total_pages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const positionClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[position];

  return (
    <div className="py-6 md:py-8">
      <div
        className={`flex flex-wrap items-center gap-1.5 sm:gap-2 ${positionClass}`}
      >
        {/* Previous Button */}
        {showPrevNext && (
          <button
            onClick={() => handlePageChange(current_page - 1)}
            disabled={current_page === 1}
            aria-label="Previous page"
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 border rounded-lg font-medium transition-all text-sm sm:text-base ${
              current_page === 1
                ? "border-border/30 text-muted-foreground cursor-not-allowed opacity-50"
                : "border-border text-foreground hover:bg-muted/50 hover:border-border shadow-sm"
            }`}
          >
            <svg
              className="w-4 h-4"
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
            <span className="hidden sm:inline">Previous</span>
          </button>
        )}

        {/* Page Numbers */}
        {showPageNumbers && (
          <>
            {/* First page */}
            {visiblePages[0] > 1 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  aria-label="Go to page 1"
                  className="min-w-10 h-10 px-2 sm:px-3 border border-border rounded-lg hover:bg-muted/50 transition-all text-sm sm:text-base font-medium shadow-sm hover:border-border"
                  style={{ color: textColor }}
                >
                  1
                </button>
                {visiblePages[0] > 2 && (
                  <span className="px-1 sm:px-2 text-muted-foreground select-none">
                    ...
                  </span>
                )}
              </>
            )}

            {/* Visible pages */}
            {visiblePages.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                aria-label={`Go to page ${page}`}
                aria-current={page === current_page ? "page" : undefined}
                className={`min-w-10 h-10 px-2 sm:px-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  page === current_page
                    ? "shadow-md"
                    : "border border-border hover:bg-muted/50 shadow-sm hover:border-border"
                }`}
                style={
                  page === current_page
                    ? { backgroundColor: activeColor, color: "#FFFFFF" }
                    : { color: textColor }
                }
              >
                {page}
              </button>
            ))}

            {/* Last page */}
            {visiblePages[visiblePages.length - 1] < total_pages && (
              <>
                {visiblePages[visiblePages.length - 1] < total_pages - 1 && (
                  <span className="px-1 sm:px-2 text-muted-foreground select-none">
                    ...
                  </span>
                )}
                <button
                  onClick={() => handlePageChange(total_pages)}
                  aria-label={`Go to page ${total_pages}`}
                  className="min-w-10 h-10 px-2 sm:px-3 border border-border rounded-lg hover:bg-muted/50 transition-all text-sm sm:text-base font-medium shadow-sm hover:border-border"
                  style={{ color: textColor }}
                >
                  {total_pages}
                </button>
              </>
            )}
          </>
        )}

        {/* Next Button */}
        {showPrevNext && (
          <button
            onClick={() => handlePageChange(current_page + 1)}
            disabled={current_page === total_pages}
            aria-label="Next page"
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 border rounded-lg font-medium transition-all text-sm sm:text-base ${
              current_page === total_pages
                ? "border-border/30 text-muted-foreground cursor-not-allowed opacity-50"
                : "border-border text-foreground hover:bg-muted/50 hover:border-border shadow-sm"
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <svg
              className="w-4 h-4"
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

      {/* Page Info */}
      <div className="mt-4 text-center">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {pagination.from}-{pagination.to}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">
            {pagination.total}
          </span>{" "}
          products
        </p>
      </div>
    </div>
  );
};

export default ProductsPagination1;
