/**
 * Theme Builder Preview Layout
 * 
 * Standalone layout for /theme-builder route that:
 * 1. Fetches theme data from JSON Server (localhost:4321)
 * 2. Applies design system CSS variables
 * 3. Renders header/footer from theme.global_sections
 * 4. Uses same rendering approach as main storefront
 */

"use client";

import { useThemeBuilder } from "@/hooks/useThemeBuilder";
import { useThemeBuilderStore } from "@/stores/themeBuilderStore";
import BlockRenderer from "@/components/renderers/block-renderer";
import type { Block } from "@/components/renderers/block-renderer";
import { useMemo } from "react";

interface ThemeBuilderLayoutProps {
  children: React.ReactNode;
}

/**
 * Generate CSS variables from design system
 */
function generateCSSVariables(designSystem: Record<string, unknown> | undefined): React.CSSProperties {
  if (!designSystem) return {};

  const colors = designSystem.colors as Record<string, string> | undefined;
  const typography = designSystem.typography as Record<string, unknown> | undefined;
  const fonts = typography?.fonts as Record<string, string> | undefined;
  const borderRadius = designSystem.border_radius as Record<string, string> | undefined;

  return {
    // Colors
    "--theme-primary": colors?.primary,
    "--theme-secondary": colors?.secondary,
    "--theme-accent": colors?.accent,
    "--theme-background": colors?.background,
    "--theme-text": colors?.text,
    // Fonts
    "--theme-font-body": fonts?.body,
    "--theme-font-heading": fonts?.heading,
    // Border Radius
    "--theme-radius-sm": borderRadius?.small,
    "--theme-radius-md": borderRadius?.medium,
    "--theme-radius-lg": borderRadius?.large,
  } as React.CSSProperties;
}

export default function ThemeBuilderLayout({ children }: ThemeBuilderLayoutProps) {
  // Fetch theme data from JSON Server
  const { isLoading, error } = useThemeBuilder();
  const { theme } = useThemeBuilderStore();

  // Extract data from theme
  const globalSections = theme?.data?.global_sections;
  const designSystem = theme?.data?.design_system;

  // Generate CSS variables from design system
  const cssVariables = useMemo(
    () => generateCSSVariables(designSystem as Record<string, unknown> | undefined),
    [designSystem]
  );

  // Extract header block (first block in header.blocks)
  const headerBlock = useMemo(() => {
    if (!globalSections?.header?.enabled) return null;
    const blocks = globalSections.header.blocks;
    if (!blocks || blocks.length === 0) return null;
    return blocks[0] as Block;
  }, [globalSections]);

  // Extract announcement block
  const announcementBlock = useMemo(() => {
    if (!globalSections?.announcement?.enabled) return null;
    const blocks = globalSections.announcement.blocks;
    if (!blocks || blocks.length === 0) return null;
    return blocks[0] as Block;
  }, [globalSections]);

  // Extract footer block
  const footerBlock = useMemo(() => {
    if (!globalSections?.footer?.enabled) return null;
    const blocks = globalSections.footer.blocks;
    if (!blocks || blocks.length === 0) return null;
    return blocks[0] as Block;
  }, [globalSections]);

  // Loading state
  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-gray-50"
        style={cssVariables}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading theme...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-gray-50"
        style={cssVariables}
      >
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load theme</p>
          <p className="text-gray-500 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  // No theme data
  if (!theme) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-gray-50"
        style={cssVariables}
      >
        <div className="text-center">
          <p className="text-gray-600 mb-2">No theme data found</p>
          <p className="text-gray-400 text-sm">
            Publish a theme from the merchant dashboard first
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-builder-preview" style={cssVariables}>
      {/* Announcement Bar */}
      {announcementBlock && (
        <BlockRenderer
          block={announcementBlock}
          data={(announcementBlock.data as Record<string, unknown>) || {}}
        />
      )}

      {/* Header/Navbar */}
      {headerBlock && (
        <BlockRenderer
          block={headerBlock}
          data={(headerBlock.data as Record<string, unknown>) || {}}
        />
      )}

      {/* Main Content */}
      <main className="theme-builder-content">
        {children}
      </main>

      {/* Footer */}
      {footerBlock && (
        <BlockRenderer
          block={footerBlock}
          data={(footerBlock.data as Record<string, unknown>) || {}}
        />
      )}
    </div>
  );
}
