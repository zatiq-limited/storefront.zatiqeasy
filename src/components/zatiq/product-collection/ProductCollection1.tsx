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
  viewTotalProducts?: number;
  columns?: number;
  columnsMobile?: number;
  products?: any[];
  bgColor?: string;
  showViewAll?: boolean;
}

const ProductCollection1: React.FC<ProductCollection1Props> = ({
  title,
  subtitle,
  titleColor,
  subtitleColor,
  viewAllText,
  viewAllLink,
  productCardType,
  viewTotalProducts,
  columns,
  columnsMobile,
  products,
  bgColor,
  showViewAll,
}) => {
  // Get the product card component
  const ProductCard = productCardType ? getComponent(productCardType) : null;

  if (!ProductCard || !products) {
    return null;
  }

  return (
    <section
      className="w-full py-16 md:py-24"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-6">
          <div>
            {title && (
              <h2
                className="text-3xl md:text-5xl font-bold mb-4"
                style={{ color: titleColor }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg" style={{ color: subtitleColor }}>
                {subtitle}
              </p>
            )}
          </div>

          {showViewAll && viewAllLink && (
            <a
              href={viewAllLink}
              className="group inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full border-2 hover:bg-gray-900/20 hover:text-white transition-all"
              style={{ color: titleColor, borderColor: titleColor }}
            >
              {viewAllText}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          )}
        </div>

        {/* Product Grid */}
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${columnsMobile}, 1fr)`,
          }}
        >
          {products.slice(0, viewTotalProducts).map((product, index) => (
            <div
              key={product.id || index}
              className="animate-fadeIn overflow-hidden"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        @media (min-width: 768px) {
          .grid {
            grid-template-columns: repeat(${columns}, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ProductCollection1;
