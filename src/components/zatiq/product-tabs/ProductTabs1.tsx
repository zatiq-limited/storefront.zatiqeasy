/**
 * Product Tabs Component
 * Displays products in tabbed sections (New Arrivals, Best Sellers, On Sale, etc.)
 */

import { useState } from "react";
import { getComponent } from "@/lib/component-registry";

interface Product {
  id: string;
  handle?: string;
  title: string;
  subtitle?: string;
  vendor?: string;
  price: number;
  comparePrice?: number | null;
  currency?: string;
  image: string;
  hoverImage?: string;
  badge?: string;
  badgeColor?: string;
  rating?: number;
  reviewCount?: number;
  colors?: string[];
  sizes?: string[];
  quickAddEnabled?: boolean;
  buyNowEnabled?: boolean;
}

interface Tab {
  id: string;
  label: string;
  products: Product[];
}

interface ProductTabs1Props {
  settings?: {
    title?: string;
    subtitle?: string;
    tabAlignment?: "left" | "center" | "right";
    productCardType?: string;
    columns?: number;
    columnsMobile?: number;
  };
  tabs?: Tab[];
}

export default function ProductTabs1({
  settings = {},
  tabs = [],
}: ProductTabs1Props) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");

  const {
    title,
    subtitle,
    tabAlignment = "center",
    productCardType,
    columns = 4,
    columnsMobile = 2,
  } = settings;

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  const alignmentClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[tabAlignment];

  // Get the product card component from registry
  const ProductCard = productCardType ? getComponent(productCardType) : null;

  if (!ProductCard) {
    return null;
  }

  return (
    <section className="w-full py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Header */}
        <div className="text-center mb-12">
          {title && (
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
          )}
          {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
        </div>

        {/* Tabs */}
        <div className={`flex flex-wrap gap-4 mb-12 ${alignmentClass}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gray-900 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {activeTabData && (
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${columnsMobile}, 1fr)`,
            }}
          >
            {activeTabData.products.length > 0 ? (
              activeTabData.products.map((product, index) => (
                <div
                  key={product.id || index}
                  className="animate-fadeIn overflow-hidden"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <ProductCard {...product} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products available in this category
                </p>
              </div>
            )}
          </div>
        )}
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
}
