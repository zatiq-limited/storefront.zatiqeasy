/**
 * ========================================
 * PRODUCT DETAILS PAGE RENDERER
 * ========================================
 *
 * Renders product detail page sections dynamically based on JSON configuration
 */

"use client";

import type { Section } from "@/lib/types";
import type { Product, Variant, Review } from "@/stores/productsStore";
import ProductBreadcrumb1 from "@/components/renderers/page-renderer/page-components/product-details/product-breadcrumb-1";
import ProductBreadcrumb2 from "@/components/renderers/page-renderer/page-components/product-details/product-breadcrumb-2";
import ProductDetail1 from "@/components/renderers/page-renderer/page-components/product-details/product-detail-1";
import ProductDetail2 from "@/components/renderers/page-renderer/page-components/product-details/product-detail-2";
import CustomerReviews1 from "@/components/renderers/page-renderer/page-components/product-details/customer-reviews-1";
import CustomerReviews2 from "@/components/renderers/page-renderer/page-components/product-details/customer-reviews-2";
import RelatedProducts1 from "@/components/renderers/page-renderer/page-components/product-details/related-products-1";
import RelatedProducts2 from "@/components/renderers/page-renderer/page-components/product-details/related-products-2";
import BlockRenderer from "@/components/renderers/block-renderer";

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
  relatedProducts?: Product[];
  reviews?: Review[];
  className?: string;
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
  relatedProducts = [],
  reviews = [],
  className = "",
}: ProductDetailsPageRendererProps) {
  const renderSection = (section: Section) => {
    if (section.enabled === false) return null;

    switch (section.type) {
      case "product-breadcrumb-1":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <ProductBreadcrumb1
              settings={section.settings || {}}
              product={product}
            />
          </div>
        );

      case "product-breadcrumb-2":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <ProductBreadcrumb2
              settings={section.settings || {}}
              product={product}
            />
          </div>
        );

      case "product-detail-1":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <ProductDetail1
              settings={section.settings || {}}
              product={product}
              selectedVariants={selectedVariants}
              quantity={quantity}
              computedPrice={computedPrice}
              onSelectVariant={onSelectVariant}
              onQuantityChange={onQuantityChange}
              onIncrementQuantity={onIncrementQuantity}
              onDecrementQuantity={onDecrementQuantity}
            />
          </div>
        );

      case "product-detail-2":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <ProductDetail2
              settings={section.settings || {}}
              product={product}
              selectedVariants={selectedVariants}
              quantity={quantity}
              computedPrice={computedPrice}
              onSelectVariant={onSelectVariant}
              onQuantityChange={onQuantityChange}
              onIncrementQuantity={onIncrementQuantity}
              onDecrementQuantity={onDecrementQuantity}
            />
          </div>
        );

      case "customer-reviews-1":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <CustomerReviews1
              settings={section.settings || {}}
              reviews={reviews}
              reviewSummary={product.review_summary}
            />
          </div>
        );

      case "customer-reviews-2":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <CustomerReviews2
              settings={section.settings || {}}
              reviews={reviews}
              reviewSummary={product.review_summary}
            />
          </div>
        );

      case "related-products-1":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <RelatedProducts1
              settings={section.settings || {}}
              products={relatedProducts}
            />
          </div>
        );

      case "related-products-2":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <RelatedProducts2
              settings={section.settings || {}}
              products={relatedProducts}
            />
          </div>
        );

      case "custom-sections":
        // Custom sections use BlockRenderer for V3.0 Schema blocks
        const block = section.blocks?.[0];
        if (!block) return null;
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <BlockRenderer
              block={block as unknown as import("@/components/renderers/block-renderer").Block}
              data={{}}
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
      {sections.map(renderSection)}
    </div>
  );
}
