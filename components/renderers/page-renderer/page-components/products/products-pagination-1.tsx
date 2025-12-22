/**
 * ========================================
 * PRODUCTS PAGINATION 1 - FULL STYLE
 * ========================================
 *
 * Full pagination with page numbers, prev/next buttons, and info
 */

"use client";

interface ProductsPagination1Props {
  // Display settings
  showPageNumbers?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  position?: "left" | "center" | "right";

  // Colors
  activeBgColor?: string;
  activeColor?: string;
  activeTextColor?: string;
  buttonBorderColor?: string;
  buttonTextColor?: string;
  textColor?: string;
  buttonHoverBgColor?: string;
  countTextColor?: string;

  // Font settings
  buttonFontFamily?: string;
  buttonFontSize?: string;
  buttonFontWeight?: string;
  countFontFamily?: string;
  countFontSize?: string;

  // Data
  currentPage?: number;
  totalPages?: number;
  from?: number;
  to?: number;
  total?: number;
  onPageChange?: (page: number) => void;
}

export default function ProductsPagination1({
  showPageNumbers = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  position = "center",
  activeBgColor,
  activeColor = "#3B82F6",
  activeTextColor = "#FFFFFF",
  buttonBorderColor = "#E5E7EB",
  buttonTextColor,
  textColor = "#374151",
  countTextColor = "#6B7280",
  buttonFontFamily = "inherit",
  buttonFontSize = "text-sm",
  buttonFontWeight = "font-medium",
  countFontFamily = "inherit",
  countFontSize = "text-sm",
  currentPage = 1,
  totalPages = 10,
  from = 1,
  to = 20,
  total = 250,
  onPageChange,
}: ProductsPagination1Props) {
  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages: number[] = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const resolvedActiveBgColor = activeBgColor || activeColor;
  const resolvedButtonTextColor = buttonTextColor || textColor;

  const positionClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[position];

  const getButtonFontStyle = () => {
    return buttonFontFamily !== "inherit"
      ? { fontFamily: buttonFontFamily, color: resolvedButtonTextColor }
      : { color: resolvedButtonTextColor };
  };

  const getCountFontStyle = () => {
    return countFontFamily !== "inherit"
      ? { fontFamily: countFontFamily, color: countTextColor }
      : { color: countTextColor };
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="py-6 md:py-8">
      <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2 ${positionClass}`}>
        {/* Previous Button */}
        {showPrevNext && (
          <button
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg ${buttonFontSize} ${buttonFontWeight} transition-all ${
              currentPage === 1 ? "cursor-not-allowed opacity-50" : "shadow-sm hover:bg-gray-50"
            }`}
            style={{
              borderWidth: "1px",
              borderColor: currentPage === 1 ? `${buttonBorderColor}80` : buttonBorderColor,
              ...getButtonFontStyle(),
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
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
                  onClick={() => onPageChange && onPageChange(1)}
                  className={`min-w-10 h-10 px-2 sm:px-3 rounded-lg transition-all ${buttonFontSize} ${buttonFontWeight} shadow-sm hover:bg-gray-50`}
                  style={{
                    borderWidth: "1px",
                    borderColor: buttonBorderColor,
                    ...getButtonFontStyle(),
                  }}
                >
                  1
                </button>
                {visiblePages[0] > 2 && (
                  <span className="px-1 sm:px-2 select-none" style={{ color: countTextColor }}>
                    ...
                  </span>
                )}
              </>
            )}

            {/* Visible pages */}
            {visiblePages.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange && onPageChange(page)}
                disabled={page === currentPage}
                className={`min-w-10 h-10 px-2 sm:px-3 rounded-lg ${buttonFontSize} ${buttonFontWeight} transition-all ${
                  page === currentPage ? "shadow-md cursor-default" : "shadow-sm hover:bg-gray-50"
                }`}
                style={
                  page === currentPage
                    ? {
                        backgroundColor: resolvedActiveBgColor,
                        color: activeTextColor,
                      }
                    : {
                        borderWidth: "1px",
                        borderColor: buttonBorderColor,
                        ...getButtonFontStyle(),
                      }
                }
              >
                {page}
              </button>
            ))}

            {/* Last page */}
            {visiblePages[visiblePages.length - 1] < totalPages && (
              <>
                {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                  <span className="px-1 sm:px-2 select-none" style={{ color: countTextColor }}>
                    ...
                  </span>
                )}
                <button
                  onClick={() => onPageChange && onPageChange(totalPages)}
                  className={`min-w-10 h-10 px-2 sm:px-3 rounded-lg transition-all ${buttonFontSize} ${buttonFontWeight} shadow-sm hover:bg-gray-50`}
                  style={{
                    borderWidth: "1px",
                    borderColor: buttonBorderColor,
                    ...getButtonFontStyle(),
                  }}
                >
                  {totalPages}
                </button>
              </>
            )}
          </>
        )}

        {/* Next Button */}
        {showPrevNext && (
          <button
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg ${buttonFontSize} ${buttonFontWeight} transition-all ${
              currentPage === totalPages ? "cursor-not-allowed opacity-50" : "shadow-sm hover:bg-gray-50"
            }`}
            style={{
              borderWidth: "1px",
              borderColor: currentPage === totalPages ? `${buttonBorderColor}80` : buttonBorderColor,
              ...getButtonFontStyle(),
            }}
          >
            <span className="hidden sm:inline">Next</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Page Info */}
      <div className="mt-4 text-center">
        <p className={`${countFontSize}`} style={getCountFontStyle()}>
          Showing{" "}
          <span className="font-semibold" style={{ color: resolvedButtonTextColor }}>
            {from}-{to}
          </span>{" "}
          of{" "}
          <span className="font-semibold" style={{ color: resolvedButtonTextColor }}>
            {total}
          </span>{" "}
          products
        </p>
      </div>
    </div>
  );
}
