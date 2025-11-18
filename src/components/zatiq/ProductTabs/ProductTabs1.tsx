/**
 * Product Tabs Component
 * Displays products in tabbed sections (New Arrivals, Best Sellers, On Sale, etc.)
 */

import React, { useState } from "react";

interface Tab {
  id: string;
  label: string;
  products: any[];
}

interface ProductTabs1Props {
  settings?: {
    title?: string;
    subtitle?: string;
    tabAlignment?: "left" | "center" | "right";
  };
  tabs?: Tab[];
}

export default function ProductTabs1({
  settings = {},
  tabs = [],
}: ProductTabs1Props) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");

  const {
    title = "Shop by Collection",
    subtitle = "",
    tabAlignment = "center",
  } = settings;

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  const alignmentClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[tabAlignment];

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
          )}
          {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
        </div>

        {/* Tabs */}
        <div className={`flex flex-wrap gap-4 mb-8 ${alignmentClass}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {activeTabData && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activeTabData.products.length > 0 ? (
              activeTabData.products.map((product: any, index: number) => (
                <div
                  key={product.id || index}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.title || "Product"}
                      className="w-full h-64 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {product.title || "Product"}
                    </h3>
                    {product.price && (
                      <p className="text-blue-600 font-bold">
                        ${product.price}
                      </p>
                    )}
                  </div>
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
    </section>
  );
}
