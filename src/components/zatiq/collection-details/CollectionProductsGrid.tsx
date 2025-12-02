/**
 * ========================================
 * COLLECTION PRODUCTS GRID
 * ========================================
 * Simple product grid for collections - handles products display
 */

import React from "react";
import { getComponent } from "../../../lib/component-registry";

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

interface CollectionProductsGridProps {
  products: Product[];
  settings?: {
    columns?: number;
    columnsMobile?: 1 | 2;
    cardStyle?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
  };
}

const CollectionProductsGrid: React.FC<CollectionProductsGridProps> = ({
  products = [],
  settings = {},
}) => {
  const {
    columns = 4,
    columnsMobile = 2,
    cardStyle = "product-card-1",
    buttonBgColor = "#0c2c5f",
    buttonTextColor = "#eff2f6",
  } = settings;

  // Get product card component from registry
  const ProductCard = getComponent(cardStyle);

  if (!ProductCard) {
    console.warn(`CollectionProductsGrid: Card "${cardStyle}" not found`);
    return null;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg">
        <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products available</h3>
        <p className="text-gray-600">Check back soon for new arrivals!</p>
      </div>
    );
  }

  const gridCols = {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
  }[columns] || "lg:grid-cols-4";

  const mobileGridCols = columnsMobile === 1 ? "grid-cols-1" : "grid-cols-2";

  // Map product to card props
  const mapProps = (product: Product) => {
    let badge: string | undefined;
    if (product.old_price && product.old_price > product.price) {
      const discount = Math.round(((product.old_price - product.price) / product.old_price) * 100);
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
      currency: "৳",
      image: product.image_url,
      hoverImage: product.images?.[1],
      badge,
      badgeColor: "#F55157",
      rating: product.review_summary?.average_rating,
      reviewCount: product.review_summary?.total_reviews,
      quickAddEnabled: product.quantity > 0,
      buttonBgColor,
      buttonTextColor,
    };
  };

  return (
    <div className={`grid ${mobileGridCols} sm:grid-cols-2 ${gridCols} gap-4 sm:gap-6`}>
      {products.map((product, index) => (
        <div
          key={product.id}
          style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both` }}
        >
          <a href={`/products/${product.product_code?.toLowerCase() || product.id}`}>
            <ProductCard {...mapProps(product)} />
          </a>
        </div>
      ))}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CollectionProductsGrid;
