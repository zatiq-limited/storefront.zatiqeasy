/**
 * ========================================
 * COLLECTIONS PAGE
 * ========================================
 *
 * Collections listing page showing all product collections/categories
 * Uses React Query for caching
 */

"use client";

import { useCollections } from "@/hooks";
import CollectionsPageRenderer from "@/components/renderers/page-renderer/collections-page-renderer";
import type { Section } from "@/lib/types";

export default function CollectionsPage() {
  const { collections, sections, isLoading, isPageConfigLoading, error } =
    useCollections();

  // Show loading state while page config is loading
  if (isPageConfigLoading) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  // Show error state
  if (error) {
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
            Error loading collections
          </h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </main>
    );
  }

  // Default sections if none provided
  const defaultSections: Section[] = [
    {
      id: "collections_hero",
      type: "collections-hero-1",
      enabled: true,
      settings: {
        title: "Shop by Collection",
        subtitle: "Explore our curated collections crafted for every style",
        show_breadcrumb: true,
        show_collection_count: true,
        gradient_start: "#EBF4FF",
        gradient_end: "#F3E8FF",
      },
    },
    {
      id: "collections_grid",
      type: "collections-grid-1",
      enabled: true,
      settings: {
        columns: 3,
        columns_tablet: 2,
        columns_mobile: 1,
        gap: 6,
        show_product_count: true,
        show_description: true,
      },
    },
  ];

  const pageSections =
    sections.length > 0 ? (sections as Section[]) : defaultSections;

  return (
    <main className="zatiq-collections-page min-h-screen bg-gray-50">
      <CollectionsPageRenderer
        sections={pageSections}
        collections={collections}
        isLoading={isLoading}
      />
    </main>
  );
}
