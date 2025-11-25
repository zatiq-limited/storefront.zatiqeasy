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
}

const ProductsPagination1: React.FC<ProductsPagination1Props> = ({
  settings = {},
  pagination,
  onPageChange,
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
    <div className="py-8">
      <div className={`flex items-center gap-2 ${positionClass}`}>
        {/* Previous Button */}
        {showPrevNext && (
          <button
            onClick={() => handlePageChange(current_page - 1)}
            disabled={current_page === 1}
            className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
              current_page === 1
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Previous
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
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  1
                </button>
                {visiblePages[0] > 2 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
              </>
            )}

            {/* Visible pages */}
            {visiblePages.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  page === current_page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Last page */}
            {visiblePages[visiblePages.length - 1] < total_pages && (
              <>
                {visiblePages[visiblePages.length - 1] < total_pages - 1 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
                <button
                  onClick={() => handlePageChange(total_pages)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
            className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
              current_page === total_pages
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        )}
      </div>

      {/* Page Info */}
      <p className="text-center text-sm text-gray-500 mt-4">
        Showing {pagination.from}-{pagination.to} of {pagination.total} products
      </p>
    </div>
  );
};

export default ProductsPagination1;
