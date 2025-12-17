'use client';

/**
 * ========================================
 * THEME LAYOUT
 * ========================================
 *
 * Renders global sections from theme.json:
 * - Announcement bar (if enabled)
 * - Header/Navbar
 * - Main content (children)
 * - Footer (if enabled)
 *
 * Uses V3.0 Schema BlockRenderer for dynamic rendering
 */

'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import BlockRenderer, { BlocksRenderer, type Block } from './BlockRenderer';

// Types
export interface ThemeData {
  id: string;
  version: string;
  global_settings: {
    colors: Record<string, string>;
    fonts: Record<string, string>;
    border_radius: Record<string, string>;
    component_styles: Record<string, unknown>;
  };
  global_sections: {
    announcement?: GlobalSection;
    header?: GlobalSection;
    footer?: GlobalSection;
  };
  templates: Record<string, string>;
}

export interface GlobalSection {
  enabled: boolean;
  type: string;
  settings: Record<string, unknown>;
  blocks: Block[];
}

export interface ThemeLayoutProps {
  theme: ThemeData;
  children: React.ReactNode;
  className?: string;
}

/**
 * Theme Layout Component
 * Wraps content with global header, announcement, and footer from theme.json
 */
export default function ThemeLayout({
  theme,
  children,
  className = '',
}: ThemeLayoutProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Extract global sections
  const { announcement, header, footer } = theme.global_sections;

  // Global settings as data context
  const globalData = useMemo(() => ({
    colors: theme.global_settings.colors,
    fonts: theme.global_settings.fonts,
    border_radius: theme.global_settings.border_radius,
    cart_count: 0, // This would come from cart state
    dark_mode: darkMode,
  }), [theme.global_settings, darkMode]);

  // Event handlers for global actions
  const eventHandlers = useMemo(() => ({
    navigate: (url: string) => {
      if (url.startsWith('http')) {
        window.open(url, '_blank');
      } else {
        router.push(url);
      }
    },
    toggleDrawer: (target: string) => {
      switch (target) {
        case 'mobile_menu':
          setMobileMenuOpen(prev => !prev);
          break;
        case 'cart_drawer':
          setCartDrawerOpen(prev => !prev);
          break;
        default:
          console.log('Toggle drawer:', target);
      }
    },
    toggleTheme: () => {
      setDarkMode(prev => !prev);
      // Apply dark mode class to document
      document.documentElement.classList.toggle('dark');
    },
    search: (query: string) => {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    },
  }), [router]);

  return (
    <div className={`zatiq-theme-layout ${darkMode ? 'dark' : ''} ${className}`}>
      {/* Announcement Bar */}
      {announcement?.enabled && announcement.blocks && announcement.blocks.length > 0 && (
        <div className="zatiq-announcement">
          <BlocksRenderer
            blocks={announcement.blocks}
            data={{ ...globalData, ...announcement.settings }}
            eventHandlers={eventHandlers}
          />
        </div>
      )}

      {/* Header/Navbar */}
      {header?.enabled && header.blocks && header.blocks.length > 0 && (
        <header className="zatiq-header">
          <BlocksRenderer
            blocks={header.blocks}
            data={{ ...globalData, ...header.settings }}
            eventHandlers={eventHandlers}
          />
        </header>
      )}

      {/* Main Content */}
      <main className="zatiq-main">
        {children}
      </main>

      {/* Footer */}
      {footer?.enabled && footer.blocks && footer.blocks.length > 0 && (
        <footer className="zatiq-footer">
          <BlocksRenderer
            blocks={footer.blocks}
            data={{ ...globalData, ...footer.settings }}
            eventHandlers={eventHandlers}
          />
        </footer>
      )}

      {/* Mobile Menu Overlay (controlled by state) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Cart Drawer Overlay (controlled by state) */}
      {cartDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setCartDrawerOpen(false)}
        />
      )}
    </div>
  );
}

/**
 * Helper to extract theme from API response
 */
export function extractThemeData(response: { success: boolean; data: ThemeData }): ThemeData | null {
  if (response.success && response.data) {
    return response.data;
  }
  return null;
}
