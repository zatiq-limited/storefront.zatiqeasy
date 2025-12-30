/**
 * Product Not Found Page
 * Displayed when a product is not found
 */

import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center">
        <svg
          className="w-24 h-24 text-gray-300 mx-auto mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Product Not Found
        </h1>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          The product you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Browse Products
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
