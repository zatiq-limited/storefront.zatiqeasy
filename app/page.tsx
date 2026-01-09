"use client";

import { useHomepage } from "@/hooks";
import { useHomepageStore } from "@/stores/homepageStore";
import { useShopStore } from "@/stores";
import BlockRenderer from "@/components/renderers/block-renderer";
import { usePathname } from "next/navigation";

/**
 * HomePage Component
 *
 * NOTE: Theme routing is handled by ThemeRouter component in the layout.
 * - If legacy_theme === true: ThemeRouter renders static theme, this returns null
 * - If legacy_theme === false: This renders Theme Builder content (BlockRenderer)
 *
 * This component should ONLY render theme builder content.
 */
export default function HomePage() {
  const { homepage } = useHomepageStore();
  const { isLoading, error } = useHomepage();
  const { shopDetails } = useShopStore();
  const pathname = usePathname();

  // Check if using legacy theme (static themes)
  const isLegacyTheme = shopDetails?.legacy_theme ?? true;

  // Check if current route is a homepage
  // Homepage routes: "/" or "/merchant/[shopId]"
  const isHomepageRoute =
    pathname === "/" ||
    /^\/merchant\/[^/]+$/.test(pathname);

  // Legacy mode + Homepage: ThemeRouter already rendered the static theme, skip this
  if (isLegacyTheme && isHomepageRoute) {
    return null;
  }

  // Theme Builder mode: Render blocks from homepage data
  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <p>Error loading homepage data</p>
      </main>
    );
  }

  // Extract sections from homepage data
  const pageData =
    (homepage as Record<string, unknown>)?.data || homepage || {};
  const sections = (pageData as Record<string, unknown>)?.sections || [];

  // Show placeholder when no sections exist (Theme Builder not configured)
  if (!sections || (sections as Array<unknown>).length === 0) {
    return (
      <main className="zatiq-homepage min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Theme Builder Mode Active
          </h2>
          <p className="text-gray-600 mb-4">
            No homepage sections configured yet. Use the Theme Builder in your
            merchant panel to add sections to this page.
          </p>
          <p className="text-sm text-gray-500">
            Shop: {shopDetails?.shop_name || "Unknown"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="zatiq-homepage">
      {(sections as Array<Record<string, unknown>>).map((section, index) => {
        // Get the first block from each section
        const block = (section.blocks as Array<Record<string, unknown>>)?.[0];
        if (!block || !section.enabled) return null;

        return (
          <BlockRenderer
            key={(section.id as string) || `section-${index}`}
            block={
              block as import("@/components/renderers/block-renderer").Block
            }
            data={(block.data as Record<string, unknown>) || {}}
          />
        );
      })}
    </main>
  );
}
