/**
 * Products Page Loading State
 * Displayed while the products page is loading (route-level Suspense)
 */

export default function ProductsLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Skeleton */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-5 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg overflow-hidden shadow-sm"
            >
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
