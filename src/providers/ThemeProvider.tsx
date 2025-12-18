/**
 * ========================================
 * THEME PROVIDER
 * ========================================
 *
 * Global theme provider that wraps the app with ThemeLayout
 * Handles loading theme.json and provides theme context to all pages
 */

"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { BlocksRenderer, type Block } from "@/components/BlockRenderer";

// Import theme JSON
import themeJson from "@/data/api-responses/theme.json";

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

interface ThemeContextType {
  theme: ThemeData | null;
  globalData: Record<string, unknown>;
  eventHandlers: {
    navigate: (url: string) => void;
    toggleDrawer: (target: string) => void;
    toggleTheme: () => void;
    search: (query: string) => void;
  };
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  darkMode: boolean;
  cartCount: number;
  setCartCount: (count: number) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

/**
 * Hook to access theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

/**
 * Theme Provider Component
 * Wraps the entire app and provides global theme data and handlers
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Extract theme data
  const theme = useMemo(() => {
    if (themeJson.success && themeJson.data) {
      return themeJson.data as unknown as ThemeData;
    }
    return null;
  }, []);

  // Global settings as data context
  const globalData = useMemo(() => {
    if (!theme) return {};
    return {
      colors: theme.global_settings.colors,
      fonts: theme.global_settings.fonts,
      border_radius: theme.global_settings.border_radius,
      cart_count: cartCount,
      dark_mode: darkMode,
    };
  }, [theme, cartCount, darkMode]);

  // Event handlers for global actions
  const eventHandlers = useMemo(
    () => ({
      navigate: (url: string) => {
        if (url.startsWith("http")) {
          window.open(url, "_blank");
        } else {
          router.push(url);
        }
      },
      toggleDrawer: (target: string) => {
        console.log("[ThemeProvider] toggleDrawer called with target:", target);
        switch (target) {
          case "mobile_menu":
            setMobileMenuOpen((prev) => {
              console.log("[ThemeProvider] mobileMenuOpen changing from", prev, "to", !prev);
              return !prev;
            });
            break;
          case "cart_drawer":
            setCartDrawerOpen((prev) => !prev);
            break;
          default:
            console.log("Toggle drawer:", target);
        }
      },
      toggleTheme: () => {
        setDarkMode((prev) => !prev);
        document.documentElement.classList.toggle("dark");
      },
      search: (query: string) => {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      },
    }),
    [router]
  );

  const contextValue = useMemo(
    () => ({
      theme,
      globalData,
      eventHandlers,
      mobileMenuOpen,
      setMobileMenuOpen,
      cartDrawerOpen,
      setCartDrawerOpen,
      darkMode,
      cartCount,
      setCartCount,
    }),
    [
      theme,
      globalData,
      eventHandlers,
      mobileMenuOpen,
      cartDrawerOpen,
      darkMode,
      cartCount,
    ]
  );

  if (!theme) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load theme</p>
      </div>
    );
  }

  const { announcement, header, footer } = theme.global_sections;

  // Extract data from the first block of each global section (where the actual data lives)
  const announcementData = useMemo(() => {
    const firstBlock = announcement?.blocks?.[0];
    const blockData = (firstBlock?.data as Record<string, unknown>) || {};
    return { ...globalData, ...announcement?.settings, ...blockData };
  }, [globalData, announcement]);

  const headerData = useMemo(() => {
    const firstBlock = header?.blocks?.[0];
    const blockData = (firstBlock?.data as Record<string, unknown>) || {};
    return { ...globalData, ...header?.settings, ...blockData };
  }, [globalData, header]);

  const footerData = useMemo(() => {
    const firstBlock = footer?.blocks?.[0];
    const blockData = (firstBlock?.data as Record<string, unknown>) || {};
    return { ...globalData, ...footer?.settings, ...blockData };
  }, [globalData, footer]);

  // Drawer states to pass to BlocksRenderer for synchronization
  const drawerStates = useMemo(() => ({
    mobile_menu: mobileMenuOpen,
    cart_drawer: cartDrawerOpen,
  }), [mobileMenuOpen, cartDrawerOpen]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <div
        className={`zatiq-theme-layout min-h-screen flex flex-col ${
          darkMode ? "dark" : ""
        }`}
      >
        {/* 1. Announcement Bar */}
        {announcement?.enabled &&
          announcement.blocks &&
          announcement.blocks.length > 0 && (
            <div className="zatiq-announcement">
              <BlocksRenderer
                blocks={announcement.blocks}
                data={announcementData}
                eventHandlers={eventHandlers}
              />
            </div>
          )}

        {/* 2. Header/Navbar */}
        {header?.enabled && header.blocks && header.blocks.length > 0 && (
          <header className="zatiq-header">
            <BlocksRenderer
              blocks={header.blocks}
              data={headerData}
              eventHandlers={eventHandlers}
              externalDrawerStates={drawerStates}
            />
          </header>
        )}

        {/* 3. Main Content (Page Components) */}
        <main className="zatiq-main flex-1">{children}</main>

        {/* 4. Footer */}
        {footer?.enabled && footer.blocks && footer.blocks.length > 0 && (
          <footer className="zatiq-footer">
            <BlocksRenderer
              blocks={footer.blocks}
              data={footerData}
              eventHandlers={eventHandlers}
            />
          </footer>
        )}

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Cart Drawer Overlay */}
        {cartDrawerOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setCartDrawerOpen(false)}
          />
        )}
      </div>
    </ThemeContext.Provider>
  );
}
