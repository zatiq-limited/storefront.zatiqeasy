"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore } from "@/stores/productsStore";
import { LuxuraCategoryCard } from "../../../components/cards";
import { SectionHeader } from "./section-header";

export function LuxuraCategorySection() {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const categories = useProductsStore((state) => state.categories);

  const baseUrl = shopDetails?.baseUrl || "";

  // Get selected categories from shop theme or use first 6 categories
  const selectedCategories = shopDetails?.shop_theme?.selected_categories?.slice(0, 6)
    || categories.slice(0, 6);

  if (selectedCategories.length === 0) {
    return null;
  }

  return (
    <div>
      <SectionHeader
        text={t("categories")}
        viewAllLink={`${baseUrl}/categories`}
        showViewAll={categories.length > 6}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {selectedCategories.map((category: { id: number | string; name: string; image_url?: string }) => (
          <LuxuraCategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            image_url={category.image_url}
          />
        ))}
      </div>
    </div>
  );
}

export default LuxuraCategorySection;
