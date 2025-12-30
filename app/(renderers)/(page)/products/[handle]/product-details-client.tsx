/**
 * Product Details Client Component
 * Handles all client-side interactivity for the product page
 */

"use client";

import { useProductDetails } from "@/hooks";
import { useEffect } from "react";
import ProductDetailsPageRenderer from "@/components/renderers/page-renderer/product-details-page-renderer";
import type { Section } from "@/lib/types";
import Link from "next/link";

interface ProductDetailsClientProps {
  handle: string;
}

export default function ProductDetailsClient({
  handle,
}: ProductDetailsClientProps) {
  const {
    product,
    sections,
    isLoading,
    isPageConfigLoading,
    error,
    notFound,
    selectedVariants,
    quantity,
    computedPrice,
    selectVariant,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
  } = useProductDetails(handle);

  // Scroll to top when component mounts or handle changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [handle]);

  // Show loading state
  if (isLoading || isPageConfigLoading) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </main>
    );
  }

  // Show 404 state
  if (notFound || !product) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <svg
            className="w-24 h-24 text-gray-300 mx-auto mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  // Show error state
  if (error && !notFound) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-red-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error loading product
          </h2>
          <p className="text-gray-600 mb-4">Please try again later</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  // Default sections if none provided
  const defaultSections: Section[] = [
    {
      id: "product_breadcrumb",
      type: "product-breadcrumb-1",
      enabled: true,
      settings: {
        show_home: true,
        show_category: true,
      },
    },
    {
      id: "product_detail",
      type: "product-detail-1",
      enabled: true,
      settings: {
        show_brand: true,
        show_sku: true,
        show_rating: true,
        show_stock: true,
        show_variants: true,
        show_description: true,
        show_specifications: true,
        show_shipping: true,
        show_add_to_cart: true,
        show_buy_now: true,
        show_whats_app_buy: true,
        show_wishlist: true,
        accent_color: "#3B82F6",
      },
    },
    {
      id: "customer_reviews",
      type: "customer-reviews-1",
      enabled: true,
      settings: {
        title: "Customer Reviews",
        show_rating_summary: true,
        show_review_images: true,
        limit: 6,
      },
    },
    {
      id: "related_products",
      type: "related-products-1",
      enabled: true,
      settings: {
        title: "You May Also Like",
        subtitle: "Discover more products you'll love",
        limit: 8,
      },
    },
  ];

  const pageSections =
    sections.length > 0 ? (sections as Section[]) : defaultSections;

  return (
    <main className="zatiq-product-details-page min-h-screen bg-white">
      <ProductDetailsPageRenderer
        sections={pageSections}
        product={product}
        selectedVariants={selectedVariants}
        quantity={quantity}
        computedPrice={computedPrice}
        onSelectVariant={selectVariant}
        onQuantityChange={setQuantity}
        onIncrementQuantity={incrementQuantity}
        onDecrementQuantity={decrementQuantity}
      />
    </main>
  );
}
