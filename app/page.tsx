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

  console.log("page.tsx - pathname:", pathname, "isLegacyTheme:", isLegacyTheme, "isHomepageRoute:", isHomepageRoute);

  // Legacy mode + Homepage: ThemeRouter already rendered the static theme, skip this
  if (isLegacyTheme && isHomepageRoute) {
    console.log("page.tsx - Legacy mode homepage, returning null");
    return null;
  }

  // Theme Builder mode: Render blocks from homepage data
  console.log("page.tsx - Theme Builder mode or non-homepage, rendering BlockRenderer");
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
