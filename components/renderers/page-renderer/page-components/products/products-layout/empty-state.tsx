"use client";

import { Search } from "lucide-react";

interface EmptyStateProps {
  searchQuery?: string | null;
  hasSelectedCategories?: boolean;
  onClearFilters: () => void;
}

export default function EmptyState({
  searchQuery,
  hasSelectedCategories,
  onClearFilters,
}: EmptyStateProps) {
  const getMessage = () => {
    if (searchQuery) {
      return `No products match "${searchQuery}"`;
    }
    if (hasSelectedCategories) {
      return "No products found in the selected categories";
    }
    return "No products match your current filters";
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Search className="w-16 h-16 text-gray-300 mb-4" strokeWidth={1.5} />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No products found
      </h3>
      <p className="text-gray-500 mb-4 max-w-md">{getMessage()}</p>
      <button
        onClick={onClearFilters}
        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
}
