/**
 * ========================================
 * COLLECTION DETAILS PAGE RENDERER
 * ========================================
 *
 * Renders collection detail page sections dynamically based on JSON configuration
 * Optimized for Next.js with React Query caching
 */

"use client";

import type { Section } from "@/lib/types";
import type { CollectionDetails } from "@/hooks/useCollectionDetails";
import {
  CollectionBreadcrumb1,
  CollectionBreadcrumb2,
  CollectionBanner1,
  CollectionBanner2,
  CollectionProducts1,
  CollectionProducts2,
  CollectionSubcategories1,
  CollectionSubcategories2,
} from "@/components/renderers/page-renderer/page-components/collection-details";
import { convertSettingsKeys } from "@/lib/settings-utils";

interface CollectionDetailsPageRendererProps {
  sections: Section[];
  collection: CollectionDetails;
  isLoading?: boolean;
  className?: string;
}

export default function CollectionDetailsPageRenderer({
  sections,
  collection,
  isLoading = false,
  className = "",
}: CollectionDetailsPageRendererProps) {
  const renderSection = (section: Section) => {
    if (section.enabled === false) return null;

    const settings = convertSettingsKeys(section.settings || {});

    switch (section.type) {
      case "collection-breadcrumb-1":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <CollectionBreadcrumb1
              settings={settings}
              collection={collection}
            />
          </div>
        );

      case "collection-breadcrumb-2":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <CollectionBreadcrumb2
              settings={settings}
              collection={collection}
            />
          </div>
        );

      case "collection-banner-1":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <CollectionBanner1 settings={settings} collection={collection} />
          </div>
        );

      case "collection-banner-2":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <CollectionBanner2 settings={settings} collection={collection} />
          </div>
        );

      case "collection-subcategories-1":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <CollectionSubcategories1
              settings={settings}
              collection={collection}
            />
          </div>
        );

      case "collection-subcategories-2":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <CollectionSubcategories2
              settings={settings}
              collection={collection}
            />
          </div>
        );

      case "collection-products-1":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <CollectionProducts1
              settings={settings}
              collection={collection}
              isLoading={isLoading}
            />
          </div>
        );

      case "collection-products-2":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <CollectionProducts2
              settings={settings}
              collection={collection}
              isLoading={isLoading}
            />
          </div>
        );

      default:
        if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "development") {
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
    <div className={`zatiq-collection-details-page ${className}`}>
      {sections.map(renderSection)}
    </div>
  );
}
