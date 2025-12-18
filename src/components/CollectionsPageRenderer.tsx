/**
 * ========================================
 * COLLECTIONS PAGE RENDERER
 * ========================================
 *
 * Simple renderer for collections page that passes collections data to components
 */

import React from "react";
import { getComponent } from "../lib/component-registry";
import type { Section } from "../lib/types";
import { convertSettingsKeys } from "../lib/settings-utils";

interface Collection {
  id: number;
  name: string;
  image_url: string;
  banner_url?: string;
  description?: string;
  product_count: number;
  children?: Collection[];
}

interface CollectionsPageRendererProps {
  sections: Section[];
  collections: Collection[];
  className?: string;
}

export default function CollectionsPageRenderer({
  sections,
  collections,
  className = "",
}: CollectionsPageRendererProps) {
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
      blocks: section.blocks,
    };

    // Inject collections data for collections-specific components
    if (
      section.type.includes("collections-grid") ||
      section.type.includes("collections-display")
    ) {
      componentProps.collections = collections;
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
  const showEmptyState = collections.length === 0;

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
          <a
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
          </a>
        </div>
      )}
    </div>
  );
}
