"use client";

import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore } from "@/stores/productsStore";
import { GridContainer } from "../../components/core";
import { CategoryCard } from "../../components/cards";
import ProductSkeleton from "@/components/shared/skeletons/product-skeleton";
import PageHeader from "@/components/shared/page-header";

export function AuroraAllCategoriesPage() {
  const { shopDetails } = useShopStore();
  const { categories, isLoading } = useProductsStore();
  const { t } = useTranslation();

  // Filter categories - only show parent categories (no parent_id) with products
  const parentCategories =
    categories?.filter((category) => !category.parent_id) ?? [];

  const totalCategories = parentCategories.length;
  const baseUrl = shopDetails?.baseUrl || "";

  return (
    <div className="container pt-6 md:pt-9 pb-12 md:pb-21">
      {/* Page Header */}
      {totalCategories > 0 && (
        <PageHeader
          titleElement={t("all_categories")}
          number={totalCategories}
          className="mb-6 md:mb-9"
        />
      )}

      {/* Categories Grid */}
      <GridContainer>
        {isLoading ? (
          // Loading Skeletons
          [...Array(10)].map((_, index) => <ProductSkeleton key={index} />)
        ) : parentCategories.length > 0 ? (
          // Category Cards
          parentCategories.map((category) => (
            <CategoryCard
              key={category.id}
              link={`${baseUrl}/categories/${category.id}`}
              imgUrl={category.image_url ?? ""}
              name={category.name}
            />
          ))
        ) : (
          // Empty State
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <svg
              className="w-20 h-20 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            <h3 className="text-lg text-gray-600 font-medium">
              {t("no_categories_found")}
            </h3>
          </div>
        )}
      </GridContainer>
    </div>
  );
}

export default AuroraAllCategoriesPage;
