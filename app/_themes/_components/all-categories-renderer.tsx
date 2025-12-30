"use client";

import { useShopStore } from "@/stores/shopStore";
import { AuroraAllCategoriesPage } from "@/app/_themes/aurora/modules/category";
import { PremiumAllCategoriesPage } from "@/app/_themes/premium/modules/category";
import { LuxuraAllCategoriesPage } from "@/app/_themes/luxura/modules/category";
import { SelloraAllCategoriesPage } from "@/app/_themes/sellora/modules/category";
import { BasicHomePage } from "@/app/_themes/basic";

/**
 * AllCategoriesRenderer - Theme-based categories page renderer
 * Renders the appropriate categories page based on shop theme
 * Follows old project pattern: ThemeHandler with theme-specific components
 */
export function AllCategoriesRenderer() {
  const { shopDetails } = useShopStore();
  const theme = shopDetails?.shop_theme?.theme_name || "Aurora";

  switch (theme) {
    case "Basic":
      // Use BasicHomePage for Basic theme categories (as per user request)
      return <BasicHomePage />;

    case "Aurora":
      return <AuroraAllCategoriesPage />;

    case "Premium":
      return <PremiumAllCategoriesPage />;

    case "Luxura":
      return <LuxuraAllCategoriesPage />;

    case "Sellora":
      return <SelloraAllCategoriesPage />;

    default:
      // Fallback to Aurora theme
      return <BasicHomePage />;
  }
}
