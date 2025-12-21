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
import { usePathname } from "next/navigation";
import BlockRenderer, {
  type Block,
} from "@/components/renderers/block-renderer";

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
  const pathname = usePathname();

  // Check if we're on a static theme route (merchant pages use static themes)
  const isStaticThemeRoute = pathname?.startsWith('/merchant/');

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
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
      {/* Only render theme builder header/footer for non-static theme routes */}
      {!isStaticThemeRoute && (
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
                (announcementAfterHeaderBlock.data as Record<string, unknown>) || {}
              }
            />
          )}
        </>
      )}

      {/* Main Content */}
      <div className="main-content">{children}</div>

      {/* Only render theme builder footer for non-static theme routes */}
      {!isStaticThemeRoute && (
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
