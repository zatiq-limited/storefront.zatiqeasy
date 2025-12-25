"use client";

interface ErrorComponentProps {
  error: string;
  retry?: () => void;
}

/**
 * ErrorComponent
 * Centralized error state for pages
 * Matches old project's error handling pattern
 */
export function ErrorComponent({ error, retry }: ErrorComponentProps) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <svg
          className="w-16 h-16 text-red-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        {/* Error Message */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-6 text-sm md:text-base">{error}</p>

        {/* Retry Button */}
        {retry && (
          <button
            onClick={retry}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * ErrorBoundaryFallback
 * Error boundary fallback component
 */
export function ErrorBoundaryFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <ErrorComponent
      error={error.message || "An unexpected error occurred"}
      retry={resetErrorBoundary}
    />
  );
}
