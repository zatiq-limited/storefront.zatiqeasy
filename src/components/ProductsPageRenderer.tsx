'use client';

/**
 * ========================================
 * PRODUCTS PAGE RENDERER
 * ========================================
 *
 * Special renderer for products page that passes products data to components
 */

import React from "react";
import { getComponent } from "../lib/component-registry";
import type { Section } from "../lib/types";

interface Product {
  id: number;
  name: string;
  product_code?: string;
  price: number;
  old_price?: number | null;
  image_url: string;
  brand?: string;
  quantity: number;
  short_description?: string;
  review_summary?: {
    average_rating: number;
    total_reviews: number;
  };
}

interface Pagination {
  current_page: number;
  total_pages: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface Filters {
  page: number;
  category: string | null;
  search: string | null;
  sort: string;
}

interface ProductsPageRendererProps {
  sections: Section[];
  products: Product[];
  pagination: Pagination | null;
  filters: Filters;
  className?: string;
}

export default function ProductsPageRenderer({
  sections,
  products,
  pagination,
  filters,
  className = "",
}: ProductsPageRendererProps) {
  const renderSection = (section: Section) => {
    if (section.enabled === false) {
      return null;
    }

    const Component = getComponent(section.type);

    if (!Component) {
      if (process.env.DEV) {
        return (
          <div key={section.id} className="bg-yellow-50 border border-yellow-200 rounded p-4 my-4">
            <p className="text-yellow-800 font-semibold">
              Component not found: {section.type}
            </p>
          </div>
        );
      }
      return null;
    }

    // Prepare props based on component type
    let componentProps: any = {
      ...section.settings,
      settings: section.settings,
      blocks: section.blocks,
    };

    // Inject products data for specific component types
    if (
      section.type.includes("products-grid") ||
      section.type.includes("products-layout")
    ) {
      componentProps.products = products;
    }

    // For products-layout, also pass sidebar data and filter props
    if (section.type.includes("products-layout")) {
      componentProps.sidebar = (section as any).sidebar;
      componentProps.currentSort = filters.sort;
      componentProps.currentSearch = filters.search || "";
      componentProps.productCount = pagination?.total || products.length;
    }

    // Inject pagination data
    if (section.type.includes("products-pagination")) {
      componentProps.pagination = pagination;
    }

    // Inject filter data for hero and filter components
    if (section.type.includes("products-hero")) {
      componentProps.productCount = pagination?.total || products.length;
      componentProps.searchQuery = filters.search;
      componentProps.category = filters.category;
    }

    if (section.type.includes("products-filter")) {
      componentProps.currentSort = filters.sort;
      componentProps.currentSearch = filters.search || "";
      componentProps.productCount = pagination?.total || products.length;
    }

    // For layout components, also pass products to nested blocks
    if (section.type.includes("products-layout") && section.blocks) {
      componentProps.blocks = section.blocks.map((block: any) => ({
        ...block,
        products: block.type?.includes("products-grid") ? products : undefined,
      }));
    }

    return (
      <div
        key={section.id}
        data-section-id={section.id}
        data-section-type={section.type}
        className="zatiq-section"
      >
        <Component {...componentProps} />
      </div>
    );
  };

  // Check if we should show empty state
  const showEmptyState = products.length === 0;
  const emptySection = sections.find((s) => s.type.includes("products-empty"));

  return (
    <div className={`zatiq-products-page ${className}`}>
      {sections
        .filter((section) => {
          // If no products and this is NOT an empty state component, check if it should be shown
          if (showEmptyState) {
            // Only show hero, filter, layout, and empty state when no products
            const alwaysShow = ["products-hero", "products-filter", "products-layout", "products-empty"];
            return alwaysShow.some((type) => section.type.includes(type));
          }
          // If we have products, don't show empty state
          if (section.type.includes("products-empty")) {
            return false;
          }
          return true;
        })
        .map(renderSection)}

      {/* Show empty state if no products and no empty section defined */}
      {showEmptyState && !emptySection && (
        <div className="text-center py-20 bg-white">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-6 text-2xl font-semibold text-gray-900">No products found</h3>
          <p className="mt-2 text-gray-600">Try adjusting your search or filter criteria</p>
          <a
            href="/products"
            className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Products
          </a>
        </div>
      )}
    </div>
  );
}
