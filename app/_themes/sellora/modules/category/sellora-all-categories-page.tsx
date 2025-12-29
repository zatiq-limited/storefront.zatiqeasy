"use client";

import { useTranslation } from "react-i18next";
import { useProductsStore } from "@/stores/productsStore";
import { CategoryGrid } from "../../components/category-grid";
import { GridContainer } from "../../components/core";

/**
 * Sellora All Categories Page
 * Displays all top-level categories in a grid layout
 * Matches old project: themes/sellora/page/all-categories.tsx
 */
export function SelloraAllCategoriesPage() {
  const { t } = useTranslation();
  const categories = useProductsStore((state) => state.categories);

  // Filter to get only top-level categories (no parent)
  const topLevelCategories = categories
    .filter((category) => !category.parent_id)
    .filter(
      (category) =>
        category.id?.toString() !== "all" &&
        category.id?.toString() !== "others"
    )
    .sort((a, b) => (a.serial ?? 0) - (b.serial ?? 0));

  const totalCategories = topLevelCategories.length;

  return (
    <div className="container pt-16 pb-8">
      {/* Page Header */}
      {totalCategories > 0 && (
        <h1 className="text-[38px] md:text-[64px] font-normal text-blue-zatiq mb-6 md:mb-9">
          {t("all_categories")}
          <span className="text-[18px] md:text-[30px] text-[#9CA3AF] ml-2">
            ({totalCategories})
          </span>
        </h1>
      )}

      {/* Categories Grid */}
      <GridContainer columns={{ mobile: 2, tablet: 2, desktop: 4 }}>
        {topLevelCategories.length > 0 ? (
          topLevelCategories.map((category) => (
            <CategoryGrid
              key={category.id}
              category={{
                id:
                  typeof category.id === "string"
                    ? parseInt(category.id, 10)
                    : category.id,
                name: category.name,
                image_url: category.image_url || null,
              }}
            />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {t("no_categories_found") || "No categories found"}
            </p>
          </div>
        )}
      </GridContainer>
    </div>
  );
}

export default SelloraAllCategoriesPage;
