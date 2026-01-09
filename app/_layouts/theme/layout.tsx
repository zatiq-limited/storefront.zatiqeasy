/**
 * ========================================
 * THEME LAYOUT
 * ========================================
 *
 * Client component that renders global theme sections
 * (announcement bar, header/navbar, footer)
 * Uses BlockRenderer for V3.0 Schema rendering
 *
 * Next.js Best Practice:
 * - layout.tsx is a Server Component (can't use hooks)
 * - ThemeLayout is a Client Component wrapper for dynamic theme rendering
 * - This pattern is recommended for client-side data fetching in layouts
 */

"use client";

import { useTheme } from "@/hooks";
import { useThemeStore } from "@/stores/themeStore";
import { useShopStore, useLandingStore } from "@/stores";
import BlockRenderer, {
  type Block,
} from "@/components/renderers/block-renderer";
import {
  HeaderSkeleton,
  FooterSkeleton,
} from "@/components/shared/skeletons/page-skeletons";

interface ThemeLayoutProps {
  children: React.ReactNode;
}

// Type definitions for theme sections
interface ThemeSection {
  enabled?: boolean;
  blocks?: Block[];
  [key: string]: unknown;
}

interface GlobalSections {
  announcement?: ThemeSection;
  header?: ThemeSection;
  announcementAfterHeader?: ThemeSection;
  announcement_after_header?: ThemeSection;
  footer?: ThemeSection;
}

interface ThemeData {
  data?: {
    globalSections?: GlobalSections;
    global_sections?: GlobalSections;
  };
  globalSections?: GlobalSections;
  global_sections?: GlobalSections;
}

export default function ThemeLayout({ children }: ThemeLayoutProps) {
  const { theme } = useThemeStore();
  const { isLoading, error } = useTheme();
  const { shopDetails } = useShopStore();
  const { isLegacyLandingPage } = useLandingStore();

  // Check if using legacy theme (static themes)
  const isLegacyTheme = shopDetails?.legacy_theme ?? true;

  // Don't render theme builder header/footer if:
  // 1. Using legacy theme (static themes handle their own header/footer)
  // 2. On a legacy landing page (single-product/[slug] with type: "legacy")
  const shouldRenderThemeBuilderHeader = !isLegacyTheme && !isLegacyLandingPage;

  // Extract theme data with proper typing
  const themeRaw = theme as ThemeData | null;
  const themeData = themeRaw?.data || themeRaw || {};

  // Get global sections from theme (support both camelCase and snake_case)
  const globalSections: GlobalSections =
    themeData?.globalSections || themeData?.global_sections || {};

  const announcement = globalSections?.announcement;
  const header = globalSections?.header;
  const announcementAfterHeader =
    globalSections?.announcementAfterHeader ||
    globalSections?.announcement_after_header;
  const footer = globalSections?.footer;

  // Get the first block from each section
  const announcementBlock = announcement?.blocks?.[0];
  const headerBlock = header?.blocks?.[0];
  const announcementAfterHeaderBlock = announcementAfterHeader?.blocks?.[0];
  const footerBlock = footer?.blocks?.[0];

  // Show skeleton loading state for theme builder mode
  if (isLoading && shouldRenderThemeBuilderHeader) {
    return (
      <>
        <HeaderSkeleton />
        <div className="main-content">{children}</div>
        <FooterSkeleton />
      </>
    );
  }

  // For legacy theme or while determining mode, don't block children
  if (isLoading) {
    return <div className="main-content">{children}</div>;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen">
        <div className="p-4 bg-red-100 text-red-700">Error loading theme</div>
        <div className="main-content">{children}</div>
      </div>
    );
  }

  return (
    <>
      {/* Only render theme builder header/footer when NOT using legacy theme */}
      {shouldRenderThemeBuilderHeader && (
        <>
          {/* Announcement Bar */}
          {announcement?.enabled && announcementBlock && (
            <BlockRenderer
              block={announcementBlock}
              data={(announcementBlock.data as Record<string, unknown>) || {}}
            />
          )}

          {/* Header/Navbar */}
          {header?.enabled && headerBlock && (
            <BlockRenderer
              block={headerBlock}
              data={(headerBlock.data as Record<string, unknown>) || {}}
            />
          )}

          {/* Announcement After Header */}
          {announcementAfterHeader?.enabled && announcementAfterHeaderBlock && (
            <BlockRenderer
              block={announcementAfterHeaderBlock}
              data={
                (announcementAfterHeaderBlock.data as Record<
                  string,
                  unknown
                >) || {}
              }
            />
          )}
        </>
      )}

      {/* Main Content */}
      <div className="main-content">{children}</div>

      {/* Only render theme builder footer when NOT using legacy theme */}
      {shouldRenderThemeBuilderHeader && (
        <>
          {/* Footer */}
          {footer?.enabled && footerBlock && (
            <BlockRenderer
              block={footerBlock}
              data={(footerBlock.data as Record<string, unknown>) || {}}
            />
          )}
        </>
      )}
    </>
  );
}
