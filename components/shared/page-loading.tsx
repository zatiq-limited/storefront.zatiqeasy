"use client";

/**
 * PageLoading Component
 * Centralized loading state for pages
 * Matches old project's page-loading component
 */
export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 text-sm md:text-base">Loading...</p>
      </div>
    </div>
  );
}

/**
 * PageLoadingInline Component
 * Smaller loading indicator for inline use
 */
export function PageLoadingInline() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}
