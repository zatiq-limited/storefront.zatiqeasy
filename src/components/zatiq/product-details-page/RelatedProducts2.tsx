import React from "react";
import { getComponent } from "@/lib/component-registry";

interface Product {
  id: number;
  name: string;
  slug?: string;
  product_code?: string;
  price: number;
  old_price?: number | null;
  image_url: string;
  images?: string[];
  brand?: string;
  short_description?: string;
  average_rating?: number;
  total_reviews?: number;
  review_summary?: {
    average_rating: number;
    total_reviews: number;
  };
}

interface RelatedProducts2Props {
  settings?: {
    title?: string;
    subtitle?: string;
    columns?: number;
    cardStyle?: string;
    limit?: number;
  };
  products: Product[];
  currency?: string;
}

const RelatedProducts2: React.FC<RelatedProducts2Props> = ({
  settings = {},
  products = [],
  currency = "৳",
}) => {
  const {
    title = "You May Also Like",
    subtitle = "Discover more products you'll love",
    columns = 4,
    cardStyle = "product-card-1",
    limit = 8,
  } = settings;

  if (!products || products.length === 0) {
    return null;
  }

  const displayedProducts = products.slice(0, limit);
  const ProductCard = getComponent(cardStyle);

  const getGridClass = () => {
    const colsMap: Record<number, string> = {
      2: "grid-cols-2",
      3: "grid-cols-2 md:grid-cols-3",
      4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
      6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    };
    return colsMap[columns] || "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  };

  const mapProductToCardProps = (product: Product) => {
    let badge: string | undefined;
    if (product.old_price && product.old_price > product.price) {
      const discount = Math.round(
        ((product.old_price - product.price) / product.old_price) * 100
      );
      badge = `${discount}% OFF`;
    }

    // Get rating from review_summary or direct fields
    const rating = product.review_summary?.average_rating || product.average_rating;
    const reviewCount = product.review_summary?.total_reviews || product.total_reviews;

    return {
      id: product.id,
      handle: product.slug || product.product_code?.toLowerCase() || String(product.id),
      title: product.name,
      subtitle: product.short_description,
      vendor: product.brand,
      price: product.price,
      comparePrice: product.old_price,
      currency: currency,
      image: product.image_url,
      hoverImage: product.images?.[1],
      badge: badge,
      badgeColor: "#7C3AED",
      rating: rating,
      reviewCount: reviewCount,
      quickAddEnabled: true,
    };
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{title}</h2>
          {subtitle && <p className="text-gray-500 text-lg">{subtitle}</p>}
        </div>

        {/* Products Grid */}
        <div className={`grid ${getGridClass()} gap-6`}>
          {displayedProducts.map((product) => (
            <a
              key={product.id}
              href={`/products/${product.slug || product.product_code?.toLowerCase() || product.id}`}
              className="group block"
            >
              {ProductCard ? (
                <ProductCard {...mapProductToCardProps(product)} />
              ) : (
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-xl hover:shadow-purple-100/50 transform hover:-translate-y-1">
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    {product.old_price && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {Math.round(((product.old_price - product.price) / product.old_price) * 100)}% OFF
                      </div>
                    )}
                    {/* Quick Add Button */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                      <button className="px-6 py-2.5 bg-white text-gray-900 rounded-full text-sm font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Quick Add
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm group-hover:text-purple-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        {currency}{product.price?.toLocaleString()}
                      </span>
                      {product.old_price && (
                        <span className="text-sm text-gray-400 line-through">
                          {currency}{product.old_price?.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {(product.review_summary?.average_rating || product.average_rating) && (
                      <div className="flex items-center gap-1 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const rating = product.review_summary?.average_rating || product.average_rating || 0;
                          return (
                            <svg
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < Math.floor(rating) ? "text-yellow-400" : "text-gray-200"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          );
                        })}
                        <span className="text-xs text-gray-500 ml-1">({product.review_summary?.total_reviews || product.total_reviews || 0})</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </a>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            View All Products
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts2;
