"use client";

import { useHomepage } from "@/hooks";
import { useHomepageStore } from "@/stores/homepageStore";
import { useShopStore } from "@/stores";
import BlockRenderer from "@/components/renderers/block-renderer";
import { usePathname } from "next/navigation";
import { PageLoader } from "@/components/shared/skeletons/page-skeletons";

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

  // Show minimal loader while loading
  if (isLoading) {
    return <PageLoader />;
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

  // Don't render anything when no sections exist
  if (!sections || (sections as Array<unknown>).length === 0) {
    return null;
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
