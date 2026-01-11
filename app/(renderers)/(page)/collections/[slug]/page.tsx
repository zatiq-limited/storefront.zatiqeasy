/**
 * ========================================
 * COLLECTION DETAILS PAGE
 * ========================================
 *
 * Single collection page with dynamic sections
 * Uses React Query for caching and follows product details pattern
 */

"use client";

import { use } from "react";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import { useCollectionDetails } from "@/hooks";
import CollectionDetailsPageRenderer from "@/components/renderers/page-renderer/collection-details-page-renderer";
import type { Section } from "@/lib/types";
import Link from "next/link";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = use(params);

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [slug]);

  const {
    collection,
    sections,
    isLoading,
    isPageConfigLoading,
    error,
    notFound: isNotFound,
    hasShopUuid,
  } = useCollectionDetails(slug);

  // Show loading state - also wait for shop UUID to be available
  if (!hasShopUuid || isLoading || isPageConfigLoading) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading collection...</p>
        </div>
      </main>
    );
  }

  // Show global 404 page - only after we have shop UUID and finished loading
  if (isNotFound || !collection) {
    notFound();
  }

  // Show error state
  if (error && !isNotFound) {
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
            Error loading collection
          </h2>
          <p className="text-gray-600 mb-4">Please try again later</p>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Collections
          </Link>
        </div>
      </main>
    );
  }

  // Default sections if none provided
  const defaultSections: Section[] = [
    {
      id: "collection_breadcrumb",
      type: "collection-breadcrumb-1",
      enabled: true,
      settings: {
        show_home: true,
        show_collections: true,
        show_product_count: true,
        background_color: "#ffffff",
        text_color: "#6b7280",
        active_color: "#111827",
      },
    },
    {
      id: "collection_banner",
      type: "collection-banner-1",
      enabled: true,
      settings: {
        show_banner: true,
        show_description: true,
        show_product_count: true,
        text_position: "center",
        height: "medium",
        overlay_opacity: "0.5",
        text_color: "#ffffff",
        badge_background_color: "#ffffff",
        badge_text_color: "#111827",
        banner_button_text: "Explore Collection",
        banner_button_link: "#products",
      },
    },
    {
      id: "collection_subcategories",
      type: "collection-subcategories-1",
      enabled: collection.children && collection.children.length > 0,
      settings: {
        title: "Shop by Category",
        show_title: true,
        columns: "6",
        columns_mobile: "3",
        columns_tablet: "4",
        show_product_count: true,
        background_color: "#ffffff",
        title_color: "#181D25",
        text_color: "#374151",
        hover_color: "#7c3aed",
      },
    },
    {
      id: "collection_products",
      type: "collection-products-1",
      enabled: true,
      settings: {
        card_style: "product-card-1",
        columns: "3",
        columns_mobile: "1",
        columns_tablet: "2",
        show_filters: true,
        show_sorting: true,
        show_pagination: true,
        products_per_page: "12",
        background_color: "#ffffff",
        button_bg_color: "#0c2c5f",
        button_text_color: "#eff2f6",
        load_more_button_text: "View More Products",
        load_more_gradient_from: "#4f46e5",
        load_more_gradient_to: "#9333ea",
        load_more_text_color: "#ffffff",
      },
    },
  ];

  const pageSections =
    sections.length > 0 ? (sections as Section[]) : defaultSections;

  return (
    <main className="zatiq-collection-details-page min-h-screen">
      <CollectionDetailsPageRenderer
        sections={pageSections}
        collection={collection}
        isLoading={isLoading}
      />
    </main>
  );
}
