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
    viewTotalProducts?: number;
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
    viewTotalProducts,
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

  // Responsive grid classes
  const mobileColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
  }[columnsMobile] || "grid-cols-2";

  const desktopColsClass = {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
  }[columns] || "lg:grid-cols-4";

  const productsToShow = viewTotalProducts
    ? activeTabData?.products.slice(0, viewTotalProducts)
    : activeTabData?.products;

  return (
    <section className="w-full pb-12 md:pb-16 lg:pb-20">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          {title && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Tabs - Scrollable on mobile */}
        <div className={`mb-8 md:mb-12 overflow-x-auto scrollbar-hide`}>
          <div className={`flex gap-2 sm:gap-4 ${alignmentClass} min-w-max sm:min-w-0`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gray-900 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {activeTabData && (
          <div className={`grid ${mobileColsClass} md:grid-cols-3 ${desktopColsClass} gap-3 sm:gap-4 md:gap-6`}>
            {productsToShow && productsToShow.length > 0 ? (
              productsToShow.map((product, index) => (
                <div
                  key={product.id || index}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <ProductCard {...product} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-base md:text-lg">
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
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
