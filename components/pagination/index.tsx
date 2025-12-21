"use client";

import { useEffect } from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const scrollToTop = () => {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToTop();
    }, 100);
    return () => clearTimeout(timer);
  }, [currentPage]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="w-full mx-auto mt-12 px-4 text-gray-600 md:px-8">
      <div className="justify-center flex" aria-label="Pagination">
        <ul className="flex items-center gap-4">
          <li
            onClick={currentPage === 1 ? undefined : handlePrevPage}
            className={`${
              currentPage === 1
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-blue-zatiq cursor-pointer"
            } text-white dark:text-gray-200 px-4 py-2.5 border dark:border-gray-400 rounded-lg`}
          >
            Previous
          </li>
          <li className="text-black-2 dark:text-gray-200">
            <span>
              {currentPage} / {totalPages}
            </span>
          </li>
          <li
            onClick={currentPage === totalPages ? undefined : handleNextPage}
            className={`${
              currentPage === totalPages
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-blue-zatiq cursor-pointer"
            } text-white dark:text-gray-200 px-4 py-2.5 border dark:border-gray-400 rounded-lg`}
          >
            Next
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Pagination;
