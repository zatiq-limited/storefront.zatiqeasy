/**
 * ========================================
 * PRODUCT DETAILS PAGE RENDERER
 * ========================================
 *
 * Renders product detail page sections dynamically based on JSON configuration
 */

import React from "react";
import { getComponent } from "../lib/component-registry";
import type { Section } from "../lib/types";
import { convertSettingsKeys } from "../lib/settings-utils";

interface Review {
  id: number;
  name: string;
  description: string;
  rating: number;
  reviewer_type?: string;
  created_at?: string;
  images?: string[];
}

interface VariantType {
  id: number;
  title: string;
  is_mandatory: boolean;
  variants: Array<{
    id: number;
    name: string;
    price: number;
  }>;
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
  warranty?: string;
  custom_fields?: Record<string, string>;
  variant_types?: VariantType[];
  review_summary?: {
    average_rating: number;
    total_reviews: number;
  };
  reviews?: Review[];
  related_products?: any[];
  isApplyDefaultDeliveryCharge?: boolean;
  specific_delivery_charges?: {
    Dhaka: number;
    Others: number;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

interface ProductDetailsPageRendererProps {
  sections: Section[];
  product: Product;
  className?: string;
}

export default function ProductDetailsPageRenderer({
  sections,
  product,
  className = "",
}: ProductDetailsPageRendererProps) {
  const renderSection = (section: Section) => {
    if (section.enabled === false) {
      return null;
    }

    const Component = getComponent(section.type);

    if (!Component) {
      if (import.meta.env.DEV) {
        return (
          <div
            key={section.id}
            className="bg-yellow-50 border border-yellow-200 rounded p-4 my-4"
          >
            <p className="text-yellow-800 font-semibold">
              Component not found: {section.type}
            </p>
          </div>
        );
      }
      return null;
    }

    // Prepare props based on component type
    // Convert snake_case settings to camelCase
    const camelSettings = convertSettingsKeys(section.settings || {});

    let componentProps: any = {
      ...camelSettings,
      settings: camelSettings,
    };

    // Inject product data for product detail components
    if (
      section.type.includes("product-detail") ||
      section.type.includes("product-breadcrumb")
    ) {
      componentProps.product = product;
    }

    // Inject reviews data
    if (section.type.includes("customer-reviews")) {
      componentProps.reviews = product.reviews || [];
      componentProps.reviewSummary = product.review_summary;
    }

    // Inject related products data
    if (section.type.includes("related-products")) {
      componentProps.products = product.related_products || [];
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
    <div className={`zatiq-product-details-page ${className}`}>
      {sections.map(renderSection)}
    </div>
  );
}
