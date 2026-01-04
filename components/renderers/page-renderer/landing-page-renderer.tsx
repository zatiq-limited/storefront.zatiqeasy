/**
 * ========================================
 * LANDING PAGE RENDERER
 * ========================================
 *
 * Renders landing page sections dynamically based on JSON configuration
 * Designed for single product landing pages with checkout functionality
 * Supports both landing-specific components and generic theme components via BlockRenderer
 */

"use client";

import { useRef } from "react";
import type { Section } from "@/lib/types";
import LandingNavbar1 from "@/components/renderers/page-renderer/page-components/landing/landing-navbar-1";
import LandingTopBanner1 from "@/components/renderers/page-renderer/page-components/landing/landing-top-banner-1";
import LandingFeatured1 from "@/components/renderers/page-renderer/page-components/landing/landing-featured-1";
import LandingVideo1 from "@/components/renderers/page-renderer/page-components/landing/landing-video-1";
import LandingProductShowcase1 from "@/components/renderers/page-renderer/page-components/landing/landing-product-showcase-1";
import LandingProductShowcase2 from "@/components/renderers/page-renderer/page-components/landing/landing-product-showcase-2";
import LandingTestimonials1 from "@/components/renderers/page-renderer/page-components/landing/landing-testimonials-1";
import LandingStandalone1 from "@/components/renderers/page-renderer/page-components/landing/landing-standalone-1";
import LandingCheckout1, {
  type LandingCheckout1Ref,
} from "@/components/renderers/page-renderer/page-components/landing/landing-checkout-1";
import LandingFooter1 from "@/components/renderers/page-renderer/page-components/landing/landing-footer-1";
import BlockRenderer from "@/components/renderers/block-renderer";

interface ProductData {
  title?: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  stock?: number;
  images?: string[];
  variants?: Array<{
    id: string;
    name: string;
    value: string;
    price?: number;
  }>;
  currency?: string;
}

interface ShopData {
  name?: string;
  logo?: string;
}

interface LandingPageRendererProps {
  sections: Section[];
  product?: ProductData;
  shop?: ShopData;
  className?: string;
  onOrderSubmit?: (orderData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    quantity: number;
    variant?: string;
    coupon?: string;
    notes?: string;
  }) => Promise<void>;
}

export default function LandingPageRenderer({
  sections,
  product,
  shop,
  className = "",
  onOrderSubmit,
}: LandingPageRendererProps) {
  const checkoutRef = useRef<LandingCheckout1Ref>(null);

  const scrollToCheckout = () => {
    if (checkoutRef.current) {
      checkoutRef.current.scrollToCheckout();
    } else {
      // Fallback - try to scroll to checkout-form element
      const element = document.getElementById("checkout-form");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const renderSection = (section: Section, index: number) => {
    if (section.enabled === false) return null;

    const key = section.id || `section-${index}`;

    switch (section.type) {
      case "landing-navbar-1":
        return (
          <div
            key={key}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <LandingNavbar1
              settings={section.settings || {}}
              shopLogo={shop?.logo}
              shopName={shop?.name}
              onScrollToCheckout={scrollToCheckout}
            />
          </div>
        );

      case "landing-top-banner-1":
        return (
          <div
            key={key}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <LandingTopBanner1
              settings={section.settings || {}}
              onScrollToCheckout={scrollToCheckout}
            />
          </div>
        );

      case "landing-featured-1":
        return (
          <div
            key={key}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <LandingFeatured1 settings={section.settings || {}} />
          </div>
        );

      case "landing-featured-2":
        // For now, use landing-featured-1 as fallback
        return (
          <div
            key={key}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <LandingFeatured1 settings={section.settings || {}} />
          </div>
        );

      case "landing-video-1":
        return (
          <div
            key={key}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <LandingVideo1
              settings={section.settings || {}}
              onScrollToCheckout={scrollToCheckout}
            />
          </div>
        );

      case "landing-product-showcase-1":
        return (
          <div
            key={key}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <LandingProductShowcase1
              settings={section.settings || {}}
              productImages={product?.images}
            />
          </div>
        );

      case "landing-product-showcase-2":
        return (
          <div
            key={key}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <LandingProductShowcase2
              settings={section.settings || {}}
              product={product}
              onScrollToCheckout={scrollToCheckout}
            />
          </div>
        );

      case "landing-testimonials-1":
        return (
          <div
            key={key}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <LandingTestimonials1 settings={section.settings || {}} />
          </div>
        );

      case "landing-standalone-1":
        return (
          <div
            key={key}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <LandingStandalone1
              settings={section.settings || {}}
              onScrollToCheckout={scrollToCheckout}
            />
          </div>
        );

      case "landing-checkout-1":
        return (
          <div
            key={key}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <LandingCheckout1
              ref={checkoutRef}
              settings={section.settings || {}}
              product={product}
              onSubmit={onOrderSubmit}
            />
          </div>
        );

      case "landing-footer-1":
        return (
          <div
            key={key}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <LandingFooter1
              settings={section.settings || {}}
              shopLogo={shop?.logo}
              shopName={shop?.name}
            />
          </div>
        );

      case "custom-sections":
        // Custom sections use BlockRenderer for V3.0 Schema blocks
        const customBlock = section.blocks?.[0];
        if (!customBlock) return null;
        return (
          <div
            key={key}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <BlockRenderer
              block={
                customBlock as unknown as import("@/components/renderers/block-renderer").Block
              }
              data={{}}
            />
          </div>
        );

      default:
        // Handle generic theme components via BlockRenderer
        // This includes: hero-*, static-banner-*, special-offers-slider-*, badges-*, reviews-*, etc.
        if (section.blocks && section.blocks.length > 0) {
          const block = section.blocks[0];
          const blockData = (block as unknown as { data?: Record<string, unknown> }).data || {};
          return (
            <div
              key={key}
              data-section-id={section.id}
              data-section-type={section.type}
            >
              <BlockRenderer
                block={block as unknown as import("@/components/renderers/block-renderer").Block}
                data={blockData}
              />
            </div>
          );
        }

        // Fallback: render dev warning for truly unknown components
        if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "DEV") {
          return (
            <div
              key={key}
              data-section-id={section.id}
              data-section-type={section.type}
              className="bg-yellow-50 border border-yellow-200 rounded p-4 my-4"
            >
              <p className="text-yellow-800 font-semibold">
                Landing component not found: {section.type}
              </p>
              <p className="text-yellow-600 text-sm mt-1">
                No blocks available for rendering. Settings: {JSON.stringify(section.settings || {}).slice(0, 100)}...
              </p>
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div className={`zatiq-landing-page ${className}`}>
      {sections.map((section, index) => renderSection(section, index))}
    </div>
  );
}
