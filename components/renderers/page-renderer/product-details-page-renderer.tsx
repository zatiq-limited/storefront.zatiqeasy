/**
 * ========================================
 * PRODUCT DETAILS PAGE RENDERER
 * ========================================
 *
 * Renders product detail page sections dynamically based on JSON configuration
 * Uses external page components for consistent rendering
 * Optimized for Next.js with React Query caching
 */

"use client";

import React from "react";
import type { Section } from "@/lib/types";
import type { Product, Variant } from "@/stores/productsStore";
import BlockRenderer from "@/components/renderers/block-renderer";

// Import page components
import {
  ProductBreadcrumb1,
  ProductBreadcrumb2,
  ProductDetail1,
  ProductDetail2,
  CustomerReviews1,
  CustomerReviews2,
  RelatedProducts1,
  RelatedProducts2,
} from "./page-components/product-details";

interface ProductDetailsPageRendererProps {
  sections: Section[];
  product: Product;
  selectedVariants: Record<number, Variant>;
  quantity: number;
  computedPrice: number;
  onSelectVariant: (variantTypeId: number, variant: Variant) => void;
  onQuantityChange: (quantity: number) => void;
  onIncrementQuantity: () => void;
  onDecrementQuantity: () => void;
  className?: string;
}

/**
 * Helper function to extract variant number from section type
 * e.g., "product-breadcrumb-1" => 1, "product-detail-2" => 2
 */
function getVariantNumber(sectionType: string): number {
  const match = sectionType.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : 1;
}

export default function ProductDetailsPageRenderer({
  sections,
  product,
  selectedVariants,
  quantity,
  computedPrice,
  onSelectVariant,
  onQuantityChange,
  onIncrementQuantity,
  onDecrementQuantity,
  className = "",
}: ProductDetailsPageRendererProps) {
  const renderSection = (section: Section) => {
    if (section.enabled === false) return null;

    // Get settings from section.settings or from section.blocks[0].data
    const settings =
      section.settings ||
      (section.blocks?.[0]?.data as Record<string, unknown>) ||
      {};

    // Get variant number for component selection
    const variant = getVariantNumber(section.type);

    // Page Rendering with pre-built external components
    switch (true) {
      case section.type.includes("product-breadcrumb"):
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            {variant === 2 ? (
              <ProductBreadcrumb2 settings={settings} product={product} />
            ) : (
              <ProductBreadcrumb1 settings={settings} product={product} />
            )}
          </div>
        );

      case section.type.includes("product-detail"):
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            {variant === 2 ? (
              <ProductDetail2
                settings={settings}
                product={product}
                selectedVariants={selectedVariants}
                quantity={quantity}
                computedPrice={computedPrice}
                onSelectVariant={onSelectVariant}
                onQuantityChange={onQuantityChange}
                onIncrementQuantity={onIncrementQuantity}
                onDecrementQuantity={onDecrementQuantity}
              />
            ) : (
              <ProductDetail1
                settings={settings}
                product={product}
                selectedVariants={selectedVariants}
                quantity={quantity}
                computedPrice={computedPrice}
                onSelectVariant={onSelectVariant}
                onQuantityChange={onQuantityChange}
                onIncrementQuantity={onIncrementQuantity}
                onDecrementQuantity={onDecrementQuantity}
              />
            )}
          </div>
        );

      case section.type.includes("customer-reviews"):
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            {variant === 2 ? (
              <CustomerReviews2
                settings={settings}
                reviews={product.reviews || []}
                reviewSummary={product.review_summary}
              />
            ) : (
              <CustomerReviews1
                settings={settings}
                reviews={product.reviews || []}
                reviewSummary={product.review_summary}
              />
            )}
          </div>
        );

      case section.type.includes("related-products"):
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            {variant === 2 ? (
              <RelatedProducts2
                settings={settings}
                product={product}
                apiProducts={product.related_products || []}
              />
            ) : (
              <RelatedProducts1
                settings={settings}
                product={product}
                apiProducts={product.related_products || []}
              />
            )}
          </div>
        );

      case section.type.includes("custom-sections"):
        // Custom sections use BlockRenderer for V3.0 Schema blocks
        const customBlock = section.blocks?.[0];
        if (!customBlock) return null;
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <BlockRenderer
              block={
                customBlock as import("@/components/renderers/block-renderer").Block
              }
              data={(customBlock.data as Record<string, unknown>) || {}}
            />
          </div>
        );

      default:
        if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "DEV") {
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
  };

  return (
    <div className={`zatiq-product-details-page ${className}`}>
      {sections.map((section, index) => (
        <React.Fragment key={`${section.id}-${index}`}>
          {renderSection(section)}
        </React.Fragment>
      ))}
    </div>
  );
}
