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

interface RelatedProducts1Props {
  settings?: {
    title?: string;
    columns?: number;
    cardStyle?: string;
    limit?: number;
  };
  products: Product[];
  currency?: string;
}

const RelatedProducts1: React.FC<RelatedProducts1Props> = ({
  settings = {},
  products = [],
  currency = "৳",
}) => {
  const {
    title = "You May Also Like",
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
      badgeColor: "#F55157",
      rating: rating,
      reviewCount: reviewCount,
      quickAddEnabled: true,
    };
  };

  return (
    <section className="py-12">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">{title}</h2>

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
                <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden">
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {currency}{product.price?.toLocaleString()}
                      </span>
                      {product.old_price && (
                        <span className="text-xs text-gray-500 line-through">
                          {currency}{product.old_price?.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {(product.review_summary?.average_rating || product.average_rating) && (
                      <div className="flex items-center gap-1 mt-2">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs text-gray-600">
                          {product.review_summary?.average_rating || product.average_rating} ({product.review_summary?.total_reviews || product.total_reviews || 0})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts1;
