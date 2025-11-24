import React from "react";

interface Product {
  id: number;
  name: string;
  product_code?: string;
  price: number;
  old_price?: number | null;
  image_url: string;
  images?: string[];
  brand?: string;
  quantity: number;
  short_description?: string;
  review_summary?: {
    average_rating: number;
    total_reviews: number;
  };
}

interface ProductsGrid2Props {
  settings?: {
    columns?: number;
    showQuickAdd?: boolean;
    showWishlist?: boolean;
    showCompare?: boolean;
  };
  products?: Product[];
  currency?: string;
  view?: "grid" | "list";
}

const ProductsGrid2: React.FC<ProductsGrid2Props> = ({
  settings = {},
  products = [],
  currency = "৳",
  view = "grid",
}) => {
  const {
    columns = 4,
    showQuickAdd = true,
    showWishlist = true,
    showCompare = false,
  } = settings;

  if (products.length === 0) {
    return null;
  }

  // List View
  if (view === "list") {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <a
            key={product.id}
            href={`/products/${product.product_code?.toLowerCase() || product.id}`}
            className="flex gap-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden p-4"
          >
            {/* Product Image */}
            <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden bg-gray-100 rounded-lg">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {product.old_price && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                  -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col justify-between py-2">
              <div>
                {product.brand && (
                  <p className="text-xs text-blue-600 font-medium mb-1">{product.brand}</p>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                {product.short_description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.short_description}</p>
                )}
                {product.review_summary && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.review_summary!.average_rating) ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{product.review_summary.average_rating} ({product.review_summary.total_reviews} reviews)</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{currency}{product.price.toLocaleString()}</span>
                  {product.old_price && (
                    <span className="text-base text-gray-500 line-through">{currency}{product.old_price.toLocaleString()}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {showWishlist && (
                    <button onClick={(e) => e.preventDefault()} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  )}
                  {showQuickAdd && product.quantity > 0 && (
                    <button onClick={(e) => e.preventDefault()} className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    );
  }

  // Grid View
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          {/* Product Image */}
          <a
            href={`/products/${product.product_code?.toLowerCase() || product.id}`}
            className="block relative aspect-square overflow-hidden bg-gray-100"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.old_price && (
                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                </span>
              )}
              {product.quantity === 0 && (
                <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold">
                  Sold Out
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {showWishlist && (
                <button
                  onClick={(e) => { e.preventDefault(); }}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              )}
              {showCompare && (
                <button
                  onClick={(e) => { e.preventDefault(); }}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </button>
              )}
            </div>
          </a>

          {/* Product Info */}
          <div className="p-4">
            {product.brand && (
              <p className="text-xs text-blue-600 font-medium mb-1">{product.brand}</p>
            )}
            <a href={`/products/${product.product_code?.toLowerCase() || product.id}`}>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
            </a>

            {/* Rating */}
            {product.review_summary && (
              <div className="flex items-center gap-1 mb-3">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3.5 h-3.5 ${i < Math.floor(product.review_summary!.average_rating) ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-500">({product.review_summary.total_reviews})</span>
              </div>
            )}

            {/* Price & Add to Cart */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-gray-900">{currency}{product.price.toLocaleString()}</span>
                {product.old_price && (
                  <span className="text-sm text-gray-500 line-through ml-2">{currency}{product.old_price.toLocaleString()}</span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            {showQuickAdd && (
              <button
                onClick={(e) => { e.preventDefault(); }}
                disabled={product.quantity === 0}
                className={`w-full mt-3 py-2.5 rounded-lg font-medium transition-colors ${
                  product.quantity > 0
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsGrid2;
