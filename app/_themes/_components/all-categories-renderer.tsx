"use client";

import { useShopStore } from "@/stores/shopStore";
import { AuroraAllCategoriesPage } from "@/app/_themes/aurora/modules/category";
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
      // TODO: Create PremiumAllCategoriesPage when Premium theme is migrated
      return (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Premium Theme Categories
            </h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        </div>
      );

    case "Luxura":
      // TODO: Create LuxuraAllCategoriesPage when Luxura theme is migrated
      return (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Luxura Theme Categories
            </h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        </div>
      );

    case "Sellora":
      // TODO: Create SelloraAllCategoriesPage when Sellora theme is migrated
      return (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Sellora Theme Categories
            </h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        </div>
      );

    default:
      // Fallback to Aurora theme
      return <BasicHomePage />;
  }
}
