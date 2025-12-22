/**
 * Product Details Loading State
 * Displayed while the product details page is loading
 */

export default function ProductDetailsLoading() {
  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
          <span className="text-gray-300">/</span>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <span className="text-gray-300">/</span>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Product Details Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-20 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />

            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Variant Options Skeleton */}
            <div className="space-y-4">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-16 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Add to Cart Button Skeleton */}
            <div className="flex gap-4">
              <div className="h-12 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-12 flex-1 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
