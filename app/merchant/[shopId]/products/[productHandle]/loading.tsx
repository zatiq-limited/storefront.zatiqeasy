/**
 * Loading state for merchant product detail page
 */
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image skeleton */}
          <div>
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 dark:bg-gray-700 rounded"
                ></div>
              ))}
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
