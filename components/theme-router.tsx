/**
 * Theme Router Component
 * Routes between Legacy Static Themes and Theme Builder based on legacy_theme flag
 *
 * - legacy_theme === true: Static themes (Basic, Aurora, Premium, Luxura, Sellora)
 * - legacy_theme === false: Theme Builder (Block Renderer)
 */

"use client";

import { useShopStore } from "@/stores";
import { ConditionalThemeHandler } from "@/app/lib/conditional-theme-handler";
import { BasicHomePage } from "@/app/_themes/basic";
import { AuroraHomePage } from "@/app/_themes/aurora";
import { LuxuraHomePage } from "@/app/_themes/luxura";
import { PremiumHomePage } from "@/app/_themes/premium";
import { SelloraHomePage } from "@/app/_themes/sellora";
import { usePathname } from "next/navigation";
import type { ComponentType, ReactNode } from "react";

interface ThemeRouterProps {
  children: ReactNode;
  /**
   * The theme builder content to render when legacy_theme === false
   * This should be the BlockRenderer content
   */
  themeBuilderContent?: ReactNode;
}

/**
 * Map theme names to their homepage components
 */
const STATIC_THEME_COMPONENTS: Record<string, ComponentType> = {
  Basic: BasicHomePage,
  Aurora: AuroraHomePage,
  Luxura: LuxuraHomePage,
  Premium: PremiumHomePage,
  Sellora: SelloraHomePage,
};

/**
 * Theme Router Component
 *
 * This component determines which rendering system to use based on the
 * shop's legacy_theme flag:
 *
 * 1. Legacy Mode (legacy_theme === true) + Homepage:
 *    - Uses ConditionalThemeHandler (static theme header/footer)
 *    - Renders theme-specific homepage component (Basic, Aurora, etc.)
 *    - Children (page.tsx) should return null
 *
 * 2. Legacy Mode + Non-Homepage:
 *    - Wraps children with ConditionalThemeHandler for theme context
 *    - Children render their own content (products, cart, etc.)
 *
 * 3. Theme Builder Mode (legacy_theme === false):
 *    - Renders children (page.tsx will provide BlockRenderer content for homepage)
 *    - Header/Footer handled by ThemeLayout
 */
export function ThemeRouter({
  children,
}: ThemeRouterProps) {
  const { shopDetails } = useShopStore();
  const pathname = usePathname();
  const isLegacyTheme = shopDetails?.legacy_theme ?? true;
  const themeName = shopDetails?.shop_theme?.theme_name || "Basic";

  // Check if current route is a homepage
  // Homepage routes: "/" or "/merchant/[shopId]"
  const isHomepageRoute =
    pathname === "/" ||
    /^\/merchant\/[^/]+$/.test(pathname);

  console.log("ThemeRouter - pathname:", pathname, "isLegacyTheme:", isLegacyTheme, "themeName:", themeName, "isHomepageRoute:", isHomepageRoute);

  // Legacy mode + Homepage: Render static theme component
  if (isLegacyTheme && isHomepageRoute) {
    console.log("ThemeRouter - Rendering static theme:", themeName);
    const StaticThemeComponent =
      STATIC_THEME_COMPONENTS[themeName] || BasicHomePage;
    return (
      <ConditionalThemeHandler>
        <StaticThemeComponent />
      </ConditionalThemeHandler>
    );
  }

  // Legacy mode + Non-Homepage: Wrap with ConditionalThemeHandler for theme context
  if (isLegacyTheme) {
    console.log("ThemeRouter - Legacy mode non-homepage, wrapping with ConditionalThemeHandler");
    return (
      <ConditionalThemeHandler>
        {children}
      </ConditionalThemeHandler>
    );
  }

  // Theme Builder mode: Render children
  console.log("ThemeRouter - Theme Builder mode, rendering children");
  return <>{children}</>;
}
