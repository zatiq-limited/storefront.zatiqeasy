/**
 * Collections Page Loading State
 * Displayed while the collections page is loading
 */

export default function CollectionsLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Skeleton */}
      <div className="bg-linear-to-r from-blue-50 to-purple-50 py-12 px-4">
        <div className="container text-center">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
          <div className="h-5 w-96 bg-gray-200 rounded animate-pulse mx-auto" />
        </div>
      </div>

      {/* Collections Grid Skeleton */}
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg overflow-hidden shadow-sm"
            >
              <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
