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

interface ProductsGrid1Props {
  settings?: {
    columns?: number;
    columnsTablet?: number;
    columnsMobile?: number;
    gap?: number;
    cardStyle?: string; // e.g., "product-card-1", "product-card-2", etc.
  };
  products?: Product[];
  currency?: string;
}

const ProductsGrid1: React.FC<ProductsGrid1Props> = ({
  settings = {},
  products = [],
  currency = "BDT",
}) => {
  const {
    columns = 4,
    columnsTablet = 2,
    columnsMobile = 1,
    gap = 6,
    cardStyle = "product-card-1", // Default to product-card-1
  } = settings;

  if (products.length === 0) {
    return null;
  }

  // Get the product card component from registry
  const ProductCard = getComponent(cardStyle);

  // Fallback if component not found
  if (!ProductCard) {
    console.warn(
      `ProductsGrid1: Card style "${cardStyle}" not found in registry`
    );
    return (
      <div className="text-center py-8 text-gray-500">
        Product card component "{cardStyle}" not found
      </div>
    );
  }

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

export default ProductsGrid1;
