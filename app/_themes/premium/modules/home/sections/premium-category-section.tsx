"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore } from "@/stores/productsStore";
import { PremiumCategoryCard } from "../../../components/cards";
import { SectionHeader } from "./section-header";
import { ViewAllButton } from "./view-all-button";
import { useMediaQuery } from "@/hooks/use-media-query";

interface PremiumCategorySectionProps {
  showHeader?: boolean;
}

export function PremiumCategorySection({ showHeader = true }: PremiumCategorySectionProps) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const categories = useProductsStore((state) => state.categories);
  const isXlScreen = useMediaQuery("(min-width: 1280px)");

  const baseUrl = shopDetails?.baseUrl || "";

  // Get featured categories from theme or use first categories
  const selectedCategories = (shopDetails?.shop_theme as unknown as { selected_categories?: Array<{ id: number; name: string; image_url?: string }> })?.selected_categories ||
    categories.slice(0, 8);

  // Number of categories to show based on screen size (matching old project)
  const numberOfCategories = isXlScreen ? 5 : 6;
  const featuredCategories = selectedCategories.slice(0, numberOfCategories);

  if (featuredCategories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[24px] lg:gap-[44px]">
      {showHeader && (
        <SectionHeader
          title={t("shop_by_category")}
          buttonLink={`${baseUrl}/categories`}
        />
      )}

      {/* Category Grid */}
      <div className="grid grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-5">
        {featuredCategories.map((category, index) => (
          <PremiumCategoryCard
            key={category.id}
            category={category}
            isLarge={index === 0}
          />
        ))}
      </div>

      <ViewAllButton
        button_text={t("view_all_categories")}
        button_link={`${baseUrl}/categories`}
      />
    </div>
  );
}

export default PremiumCategorySection;
