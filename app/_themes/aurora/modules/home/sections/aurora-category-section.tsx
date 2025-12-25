"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { GridContainer } from "../../../components/core";
import { CategoryCard } from "../../../components/cards";
import SectionHeader from "./section-header";
import ViewAllButton from "./view-all-button";

export function AuroraCategorySection() {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();

  const baseUrl = shopDetails?.baseUrl || "";
  const selectedCategories =
    shopDetails?.shop_theme?.selected_categories?.slice(0, 8) || [];

  if (selectedCategories.length === 0) {
    return null;
  }

  return (
    <>
      <SectionHeader text={t("category")} />

      <GridContainer>
        {selectedCategories.map((category, index) => (
          <CategoryCard
            key={category.id || index}
            link={`${baseUrl}/categories/${category.id}`}
            imgUrl={category?.image_url ?? ""}
            name={category?.name || ""}
          />
        ))}
      </GridContainer>

      <ViewAllButton link={`${baseUrl}/categories`} text={t("view_more")} />
    </>
  );
}

export default AuroraCategorySection;
