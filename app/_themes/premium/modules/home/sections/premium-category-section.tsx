"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore } from "@/stores/productsStore";
import { PremiumCategoryCard } from "../../../components/cards";
import { SectionHeader } from "./section-header";

interface PremiumCategorySectionProps {
  showHeader?: boolean;
}

export function PremiumCategorySection({ showHeader = true }: PremiumCategorySectionProps) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const categories = useProductsStore((state) => state.categories);

  const baseUrl = shopDetails?.baseUrl || "";

  // Get featured categories from theme or use first 8 categories
  const featuredCategories = (shopDetails?.shop_theme as unknown as { selected_categories?: Array<{ id: number; name: string; image_url?: string }> })?.selected_categories ||
    categories.slice(0, 8);

  if (featuredCategories.length === 0) {
    return null;
  }

  return (
    <div>
      {showHeader && (
        <SectionHeader
          text={t("categories")}
          viewAllLink={`${baseUrl}/categories`}
          showViewAll={true}
        />
      )}

      {/* Category Grid - First category 2x2 on XL screens */}
      <div className="grid grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {featuredCategories.map((category, index) => (
          <PremiumCategoryCard
            key={category.id}
            category={category}
            isLarge={index === 0}
            className={index === 0 ? "col-span-2 row-span-2 xl:col-span-2 xl:row-span-2" : ""}
          />
        ))}
      </div>
    </div>
  );
}

export default PremiumCategorySection;
