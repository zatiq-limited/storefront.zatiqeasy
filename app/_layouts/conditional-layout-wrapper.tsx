"use client";

import { ReactNode } from "react";
import { useShopStore } from "@/stores";
import ThemeLayout from "./theme/layout";
import { ConditionalThemeHandler } from "../lib/conditional-theme-handler";
import { BreadcrumbWrapper } from "../_themes/_components/breadcrumb-wrapper";

interface ConditionalLayoutWrapperProps {
  children: ReactNode;
}

/**
 * Conditional Layout Wrapper
 * Routes to the correct layout based on shop's legacy_theme property
 *
 * - legacy_theme = true: Renders static theme layout (Basic, Premium, Luxura, Aurora, Sellora)
 * - legacy_theme = false: Renders theme builder layout (dynamic JSON-driven)
 */
export function ConditionalLayoutWrapper({
  children,
}: ConditionalLayoutWrapperProps) {
  const { shopProfile } = useShopStore();

  // Check if shop uses legacy theme (static themes)
  const useLegacyTheme = shopProfile?.legacy_theme === true;

  if (useLegacyTheme) {
    // Render static theme layout (like merchant layout)
    return (
      <div className="min-h-screen bg-gray-50">
        <ConditionalThemeHandler>
          <BreadcrumbWrapper />
          {children}
        </ConditionalThemeHandler>
      </div>
    );
  }

  // Render theme builder layout (dynamic)
  return <ThemeLayout isStaticTheme={false}>{children}</ThemeLayout>;
}
