'use client';

/**
 * ========================================
 * THEME LAYOUT CLIENT COMPONENT
 * ========================================
 *
 * Client component for rendering theme blocks
 * Wraps children with announcement, header, and footer
 */

import BlockRenderer from "@/components/BlockRenderer";

interface ThemeLayoutClientProps {
  children: React.ReactNode;
  announcement: any;
  announcementBlock: any;
  header: any;
  headerBlock: any;
  announcementAfterHeader: any;
  announcementAfterHeaderBlock: any;
  footer: any;
  footerBlock: any;
}

export function ThemeLayoutClient({
  children,
  announcement,
  announcementBlock,
  header,
  headerBlock,
  announcementAfterHeader,
  announcementAfterHeaderBlock,
  footer,
  footerBlock,
}: ThemeLayoutClientProps) {
  return (
    <>
      {/* Announcement Bar (Global) */}
      {announcement?.enabled && announcementBlock && (
        <BlockRenderer
          block={announcementBlock}
          data={announcementBlock.data || {}}
        />
      )}

      {/* Header/Navbar (Global) */}
      {header?.enabled && headerBlock && (
        <BlockRenderer
          block={headerBlock}
          data={headerBlock.data || {}}
        />
      )}

      {/* Announcement Bar After Header (Global) */}
      {announcementAfterHeader?.enabled && announcementAfterHeaderBlock && (
        <BlockRenderer
          block={announcementAfterHeaderBlock}
          data={announcementAfterHeaderBlock.data || {}}
        />
      )}

      {/* Main Content */}
      <div className="zatiq-main-content">
        {children}
      </div>

      {/* Footer (Global) */}
      {footer?.enabled && footerBlock && (
        <BlockRenderer
          block={footerBlock}
          data={footerBlock.data || {}}
        />
      )}
    </>
  );
}
