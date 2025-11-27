import React from "react";
import { getComponent } from "@/lib/component-registry";

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
    columnsTablet?: number;
    columnsMobile?: number;
    gap?: number;
    cardStyle?: string; // e.g., "product-card-1", "product-card-2", etc.
    listCardStyle?: string; // Card style for list view
  };
  products?: Product[];
  currency?: string;
  view?: "grid" | "list";
}

const ProductsGrid2: React.FC<ProductsGrid2Props> = ({
  settings = {},
  products = [],
  currency = "BDT",
  view = "grid",
}) => {
  const {
    columns = 4,
    columnsTablet = 2,
    columnsMobile = 1,
    gap = 6,
    cardStyle = "product-card-1", // Default grid card style
    listCardStyle = "product-card-2", // Default list card style (can be different)
  } = settings;

  if (products.length === 0) {
    return null;
  }

  // Get the product card component from registry
  const currentCardStyle = view === "list" ? listCardStyle : cardStyle;
  const ProductCard = getComponent(currentCardStyle);

  // Map API product data to ProductCard props
  const mapProductToCardProps = (product: Product) => {
    // Calculate discount badge
    let badge: string | undefined;
    if (product.old_price && product.old_price > product.price) {
      const discount = Math.round(
        ((product.old_price - product.price) / product.old_price) * 100
      );
      badge = `${discount}% OFF`;
    }

    return {
      id: product.id,
      handle: product.product_code?.toLowerCase() || String(product.id),
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
      rating: product.review_summary?.average_rating,
      reviewCount: product.review_summary?.total_reviews,
      quickAddEnabled: product.quantity > 0,
    };
  };

  // Fallback if component not found - use inline rendering
  if (!ProductCard) {
    console.warn(
      `ProductsGrid2: Card style "${currentCardStyle}" not found, using fallback`
    );

    // List View Fallback
    if (view === "list") {
      return (
        <div className="space-y-4">
          {products.map((product) => (
            <a
              key={product.id}
              href={`/products/${
                product.product_code?.toLowerCase() || product.id
              }`}
              className="flex gap-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden p-4"
            >
              <div className="relative w-48 h-48 shrink-0 overflow-hidden bg-gray-100 rounded-lg">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {product.old_price && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                    -
                    {Math.round(
                      ((product.old_price - product.price) /
                        product.old_price) *
                        100
                    )}
                    %
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between py-2">
                <div>
                  {product.brand && (
                    <p className="text-xs text-blue-600 font-medium mb-1">
                      {product.brand}
                    </p>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  {product.short_description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {product.short_description}
                    </p>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {currency} {product.price.toLocaleString()}
                  </span>
                  {product.old_price && (
                    <span className="text-base text-gray-500 line-through">
                      {currency} {product.old_price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      );
    }

    // Grid View Fallback
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: `${gap * 4}px`,
        }}
      >
        {products.map((product) => (
          <a
            key={product.id}
            href={`/products/${
              product.product_code?.toLowerCase() || product.id
            }`}
            className="block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden"
          >
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              {product.brand && (
                <p className="text-xs text-blue-600 mb-1">{product.brand}</p>
              )}
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>
              <div>
                <span className="text-lg font-bold">
                  {currency} {product.price.toLocaleString()}
                </span>
                {product.old_price && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    {currency} {product.old_price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    );
  }

  // List View with dynamic card
  if (view === "list") {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <a
            key={product.id}
            href={`/products/${
              product.product_code?.toLowerCase() || product.id
            }`}
            className="block"
          >
            <ProductCard {...mapProductToCardProps(product)} />
          </a>
        ))}
      </div>
    );
  }

  // Grid View with dynamic card
  return (
    <div
      className={`grid grid-cols-${columnsMobile} sm:grid-cols-${columnsTablet} lg:grid-cols-${columns} xl:grid-cols-${columns} gap-${gap}`}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${gap * 4}px`,
      }}
    >
      {products.map((product) => (
        <a
          key={product.id}
          href={`/products/${
            product.product_code?.toLowerCase() || product.id
          }`}
          className="block"
        >
          <ProductCard {...mapProductToCardProps(product)} />
        </a>
      ))}
    </div>
  );
};

export default ProductsGrid2;
