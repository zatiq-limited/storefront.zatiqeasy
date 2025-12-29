/**
 * Theme Builder Preview - Home Page
 * 
 * Route: /theme-builder
 * 
 * Renders the home page from theme builder export data.
 * Uses the same rendering pattern as the main homepage.
 */

"use client";

import { useThemeBuilderStore } from "@/stores/themeBuilderStore";
import BlockRenderer from "@/components/renderers/block-renderer";
import type { Block } from "@/components/renderers/block-renderer";

export default function ThemeBuilderHomePage() {
  const { homePage, themeBuilderData } = useThemeBuilderStore();

  // No home page data
  if (!homePage) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No home page data found</p>
          <p className="text-gray-400 text-sm">
            Add components to the home page in the theme builder and publish
          </p>
        </div>
      </div>
    );
  }

  // Extract sections from home page data
  const sections = homePage.data?.sections || [];

  // No sections
  if (sections.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No sections on home page</p>
          <p className="text-gray-400 text-sm">
            Add components to the home page in the theme builder
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="theme-builder-homepage">
      {/* Debug info (optional - can be toggled) */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 z-50">
          <details className="bg-gray-900 text-white rounded-lg shadow-lg max-w-sm">
            <summary className="px-4 py-2 cursor-pointer text-sm font-medium">
              🎨 {themeBuilderData?.name || "Theme"} ({sections.length} sections)
            </summary>
            <div className="px-4 py-2 text-xs border-t border-gray-700 max-h-60 overflow-auto">
              <p className="text-gray-400">Last published: {themeBuilderData?.last_published}</p>
              <p className="text-gray-400 mt-1">Sections:</p>
              <ul className="list-disc list-inside text-gray-300">
                {sections.map((s) => (
                  <li key={s.id}>{s.type} {!s.enabled && "(disabled)"}</li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      )}

      {/* Render sections - same pattern as main homepage */}
      {sections.map((section, index) => {
        // Skip disabled sections
        if (!section.enabled) return null;

        // Get the first block from each section
        const block = section.blocks?.[0] as Block | undefined;
        if (!block) return null;

        return (
          <BlockRenderer
            key={section.id || `section-${index}`}
            block={block}
            data={(block.data as Record<string, unknown>) || {}}
          />
        );
      })}
    </main>
  );
}
