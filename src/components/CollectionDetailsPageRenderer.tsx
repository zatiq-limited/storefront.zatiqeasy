/**
 * ========================================
 * COLLECTION DETAILS PAGE RENDERER
 * ========================================
 *
 * Renders collection detail page sections dynamically based on JSON configuration
 */

import React from "react";
import { getComponent } from "../lib/component-registry";
import type { Section } from "../lib/types";

interface Collection {
  id: number;
  handle: string;
  category_id: number;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  banner_url?: string;
  product_count: number;
  is_active: boolean;
  serial: number;
  created_at?: string;
  updated_at?: string;
  seo?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
  };
}

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
  description?: string;
  short_description?: string;
  review_summary?: {
    average_rating: number;
    total_reviews: number;
  };
  categories?: Array<{
    id: number;
    name: string;
  }>;
}

interface CollectionDetailsPageRendererProps {
  sections: Section[];
  collection: Collection;
  products: Product[];
  className?: string;
}

export default function CollectionDetailsPageRenderer({
  sections,
  collection,
  products,
  className = "",
}: CollectionDetailsPageRendererProps) {
  const renderSection = (section: Section) => {
    if (section.enabled === false) {
      return null;
    }

    const Component = getComponent(section.type);

    if (!Component) {
      if (import.meta.env.DEV) {
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
    };

    // Inject collection data for collection components
    if (section.type.includes("collection-banner") || section.type.includes("collection-breadcrumb")) {
      componentProps.collection = collection;
    }

    // Inject products data for collection products section
    if (section.type.includes("collection-products")) {
      componentProps.products = products;
      componentProps.collection = collection;
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

  return (
    <div className={`zatiq-collection-details-page ${className}`}>
      {sections.map(renderSection)}
    </div>
  );
}
