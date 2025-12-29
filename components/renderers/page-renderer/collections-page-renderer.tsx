/**
 * ========================================
 * COLLECTIONS PAGE RENDERER
 * ========================================
 *
 * Renders collections page sections dynamically based on JSON configuration
 * Optimized for Next.js with React Query caching
 */

"use client";

import type { Section } from "@/lib/types";
import type { Collection } from "@/hooks/useCollections";
import {
  CollectionsHero1,
  CollectionsHero2,
  CollectionsGrid1,
  CollectionsGrid2,
} from "@/components/renderers/page-renderer/page-components/collections";
import Link from "next/link";

interface CollectionsPageRendererProps {
  sections: Section[];
  collections: Collection[];
  isLoading?: boolean;
  className?: string;
}

export default function CollectionsPageRenderer({
  sections,
  collections,
  isLoading = false,
  className = "",
}: CollectionsPageRendererProps) {
  const renderSection = (section: Section) => {
    if (section.enabled === false) return null;

    const settings = section.settings || {};

    switch (section.type) {
      case "collections-hero-1":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <CollectionsHero1
              settings={settings}
              collectionCount={collections.length}
            />
          </div>
        );

      case "collections-hero-2":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <CollectionsHero2
              settings={settings}
              collectionCount={collections.length}
            />
          </div>
        );

      case "collections-grid-1":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <CollectionsGrid1
              settings={settings}
              collections={collections}
              isLoading={isLoading}
            />
          </div>
        );

      case "collections-grid-2":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <CollectionsGrid2
              settings={settings}
              collections={collections}
              isLoading={isLoading}
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

  // Show empty state if no collections
  const showEmptyState = !isLoading && collections.length === 0;

  return (
    <div className={`zatiq-collections-page ${className}`}>
      {sections.map(renderSection)}

      {/* Show empty state if no collections */}
      {showEmptyState && (
        <div className="text-center py-24 bg-gray-50">
          <div className="inline-block p-6 bg-white rounded-full shadow-lg mb-6">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            No Collections Yet
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Our team is curating amazing collections. Check back soon!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
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
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}
