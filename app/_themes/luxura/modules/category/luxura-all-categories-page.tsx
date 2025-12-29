"use client";

import { useTranslation } from "react-i18next";
import { useProductsStore } from "@/stores/productsStore";
import { GridContainer } from "../../components/core";
import { LuxuraCategoryCard } from "../../components/cards";
import { PageHeader } from "../../../../../components/shared/page-header";

export function LuxuraAllCategoriesPage() {
  const { t } = useTranslation();
  const categories = useProductsStore((state) => state.categories);

  // Filter categories - only show parent categories (no parent_id)
  const parentCategories =
    categories
      ?.filter((item) => !item.parent_id)
      ?.sort((a, b) => (a.serial ?? 0) - (b.serial ?? 0)) || [];

  const totalCategories = parentCategories.length;

  return (
    <div className="container pt-6 md:pt-9 pb-12 md:pb-21">
      {totalCategories > 0 && (
        <PageHeader
          titleElement={t("all_categories")}
          number={totalCategories}
          className="mb-6 md:mb-9"
        />
      )}

      <GridContainer>
        {parentCategories.map((category) => (
          <LuxuraCategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            image_url={category.image_url}
            isOnSale={false}
          />
        ))}
      </GridContainer>
    </div>
  );
}

export default LuxuraAllCategoriesPage;
