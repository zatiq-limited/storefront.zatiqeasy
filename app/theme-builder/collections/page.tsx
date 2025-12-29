/**
 * ========================================
 * THEME BUILDER - COLLECTIONS PAGE
 * ========================================
 *
 * Renders the collections page using theme builder's published sections
 * combined with real collections data from the store API.
 */

"use client";

import { useThemeBuilder } from "@/hooks/useThemeBuilder";
import { useCollections } from "@/hooks";
import CollectionsPageRenderer from "@/components/renderers/page-renderer/collections-page-renderer";
import { useRoutePrefix } from "@/providers/RoutePrefixProvider";
import type { Section } from "@/lib/types";

export default function ThemeBuilderCollectionsPage() {
  const { routePrefix } = useRoutePrefix();
  const { collectionsPage, isLoading: isThemeLoading } = useThemeBuilder();
  const {
    collections,
    isLoading: isCollectionsLoading,
    error,
  } = useCollections();

  // Loading state
  if (isThemeLoading) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading theme...</p>
        </div>
      </main>
    );
  }

  // Error state
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

  // No default sections - only show what merchant configured
  const pageSections = (collectionsPage?.data?.sections || []) as Section[];

  // No sections configured - show empty state
  if (pageSections.length === 0) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No sections configured for collections page</p>
          <p className="text-gray-400 text-sm">
            Add sections to the collections page in the theme builder and publish
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="zatiq-theme-builder-collections-page min-h-screen bg-gray-50">
      <CollectionsPageRenderer
        sections={pageSections}
        collections={collections}
        isLoading={isCollectionsLoading}
        routePrefix={routePrefix}
      />
    </main>
  );
}
