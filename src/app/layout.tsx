/**
 * ========================================
 * ROOT LAYOUT
 * ========================================
 *
 * Global layout with header, footer, and announcement bar
 * Dynamically loads from theme.json
 * Uses BlockRenderer for V3.0 Schema rendering
 */

import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "@/styles/global.css";
import "./globals.css";
import { getTheme } from "@/api/server";
import { ThemeLayoutClient } from "./ThemeLayoutClient";
import { QueryProvider } from "@/providers/QueryProvider";
import { StoreHydration } from "@/providers/StoreHydration";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zatiq Store",
  description: "Shop the latest fashion trends",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Load theme data server-side
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let themeData: any = null;
  let designSystem: Record<string, unknown> | null = null;

  try {
    themeData = await getTheme();
    console.log("[Layout] ✅ Theme loaded successfully");
  } catch (error) {
    console.error("[Layout] ❌ Failed to load theme:", error);
  }

  // Load design system
  try {
    const themeInit = await import("@/data/api-responses/theme_init.json");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const themeInitData = (themeInit.default || themeInit) as any;
    designSystem = themeInitData?.data?.theme?.design || null;
  } catch {
    console.log("[Layout] Using default design system");
  }

  // Get global sections from theme
  const announcement =
    themeData?.globalSections?.announcement ||
    themeData?.global_sections?.announcement ||
    null;

  const header =
    themeData?.globalSections?.header ||
    themeData?.global_sections?.header ||
    null;

  const announcementAfterHeader =
    themeData?.globalSections?.announcementAfterHeader ||
    themeData?.global_sections?.announcement_after_header ||
    null;

  const footer =
    themeData?.globalSections?.footer ||
    themeData?.global_sections?.footer ||
    null;

  // Get the first block from each section
  const announcementBlock = announcement?.blocks?.[0] || null;
  const headerBlock = header?.blocks?.[0] || null;
  const announcementAfterHeaderBlock =
    announcementAfterHeader?.blocks?.[0] || null;
  const footerBlock = footer?.blocks?.[0] || null;

  // CSS variables for design system
  const colors = designSystem?.colors as Record<string, string> | undefined;
  const fonts = designSystem?.fonts as Record<string, string> | undefined;

  const cssVariables = {
    "--color-primary": colors?.primary || "#2563eb",
    "--color-secondary": colors?.secondary || "#1f2937",
    "--color-accent": colors?.accent || "#f59e0b",
    "--color-background": colors?.background || "#ffffff",
    "--color-text": colors?.text || "#111827",
    "--font-heading": fonts?.heading || "var(--font-poppins)",
    "--font-body": fonts?.body || "var(--font-inter)",
  } as React.CSSProperties;

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body style={cssVariables} className="font-sans antialiased">
        <QueryProvider>
          <StoreHydration>
            <ThemeLayoutClient
              announcement={announcement}
              announcementBlock={announcementBlock}
              header={header}
              headerBlock={headerBlock}
              announcementAfterHeader={announcementAfterHeader}
              announcementAfterHeaderBlock={announcementAfterHeaderBlock}
              footer={footer}
              footerBlock={footerBlock}
            >
              {children}
            </ThemeLayoutClient>
          </StoreHydration>
        </QueryProvider>
      </body>
    </html>
  );
}
