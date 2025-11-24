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
  review_summary?: {
    average_rating: number;
    total_reviews: number;
  };
}

interface ProductsGrid1Props {
  settings?: {
    columns?: number;
    columnsTablet?: number;
    columnsMobile?: number;
    gap?: number;
    showQuickView?: boolean;
    showWishlist?: boolean;
  };
  products?: Product[];
  currency?: string;
}

const ProductsGrid1: React.FC<ProductsGrid1Props> = ({
  settings = {},
  products = [],
  currency = "৳",
}) => {
  const {
    columns = 3,
    columnsTablet = 2,
    columnsMobile = 1,
    gap = 6,
    showQuickView = true,
    showWishlist = true,
  } = settings;

  const getGridCols = () => {
    return `grid-cols-${columnsMobile} sm:grid-cols-${columnsTablet} lg:grid-cols-${columns}`;
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-${gap}`}>
      {products.map((product) => (
        <a
          key={product.id}
          href={`/products/${product.product_code?.toLowerCase() || product.id}`}
          className="group bg-white transition-all duration-300 overflow-hidden"
        >
          {/* Product Image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />

            {/* Sale Badge */}
            {product.old_price && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                {Math.round(((product.old_price - product.price) / product.old_price) * 100)}% OFF
              </div>
            )}

            {/* Stock Badge */}
            {product.quantity <= 10 && product.quantity > 0 && (
              <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                Only {product.quantity} left
              </div>
            )}

            {/* Out of Stock Overlay */}
            {product.quantity === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Out of Stock</span>
              </div>
            )}

            {/* Wishlist Button */}
            {showWishlist && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Handle wishlist
                }}
                className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}

            {/* Quick View Button */}
            {showQuickView && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle quick view
                  }}
                  className="w-full py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Quick View
                </button>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Brand */}
            {product.brand && (
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.brand}</p>
            )}

            {/* Title */}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            {product.review_summary && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.review_summary!.average_rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-600">({product.review_summary.total_reviews})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                {currency}{product.price.toLocaleString()}
              </span>
              {product.old_price && (
                <span className="text-sm text-gray-500 line-through">
                  {currency}{product.old_price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock Status */}
            {product.quantity > 0 ? (
              <p className="mt-2 text-xs text-green-600 font-medium">In Stock</p>
            ) : (
              <p className="mt-2 text-xs text-red-600 font-medium">Out of Stock</p>
            )}
          </div>
        </a>
      ))}
    </div>
  );
};

export default ProductsGrid1;
