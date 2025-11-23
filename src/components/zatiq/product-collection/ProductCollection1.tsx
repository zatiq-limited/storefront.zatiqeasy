/**
 * Product Collection 1 - Modern Grid Layout
 * Shopify-inspired clean grid with smooth animations & hover effects
 */

import React from "react";
import { ArrowRight } from "lucide-react";
import { getComponent } from "../../../lib/component-registry";

interface ProductCollection1Props {
  title?: string;
  subtitle?: string;
  titleColor?: string;
  subtitleColor?: string;
  viewAllText?: string;
  viewAllLink?: string;
  productCardType?: string;
  columns?: number;
  columnsMobile?: number;
  products?: any[];
  bgColor?: string;
  showViewAll?: boolean;
}

const ProductCollection1: React.FC<ProductCollection1Props> = ({
  title = "Featured Products",
  subtitle,
  titleColor = "#000000",
  subtitleColor = "#6B7280",
  viewAllText = "View All",
  viewAllLink = "/collections/all",
  productCardType = "product-card-1",
  columns = 4,
  columnsMobile = 2,
  products = [],
  bgColor = "#FFFFFF",
  showViewAll = true,
}) => {
  const ProductCard = getComponent(productCardType);

  if (!ProductCard) {
    console.error(`Product card type "${productCardType}" not found`);
    return null;
  }

  const gridCols: Record<number, string> = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
  };

  return (
    <section
      className="w-full py-16 md:py-24 px-4 md:px-6 lg:px-8"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full max-w-[1400px] mx-auto">
        {/* Header - Premium Spacing */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 md:mb-16 gap-6">
          <div className="flex-1 max-w-3xl">
            {title && (
              <h2
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 leading-tight"
                style={{ color: titleColor }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="text-base md:text-lg lg:text-xl leading-relaxed"
                style={{ color: subtitleColor }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {showViewAll && viewAllLink && (
            <a
              href={viewAllLink}
              className="group inline-flex items-center gap-2 text-sm md:text-base font-bold transition-all hover:gap-4 px-6 py-3 rounded-full border-2 border-current hover:bg-gray-900 hover:text-white"
              style={{ color: titleColor }}
            >
              {viewAllText}
              <ArrowRight
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                strokeWidth={2.5}
              />
            </a>
          )}
        </div>

        {/* Product Grid - Professional Spacing */}
        <div
          className={`grid grid-cols-${columnsMobile} ${
            gridCols[columns] || "md:grid-cols-4"
          } gap-6 md:gap-8 lg:gap-10 xl:gap-12`}
        >
          {products.map((product, index) => (
            <div
              key={product.id || index}
              className="group animate-fadeInUp"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default ProductCollection1;
