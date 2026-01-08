"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore, Category } from "@/stores/productsStore";
import { useShopCategories } from "@/hooks";
import { GridContainer } from "../../components/core";
import { CategoryCard } from "../../components/cards";
import ProductSkeleton from "@/components/shared/skeletons/product-skeleton";
import PageHeader from "@/components/shared/page-header";

export function AuroraAllCategoriesPage() {
  const { shopDetails } = useShopStore();
  const storeCategories = useProductsStore((state) => state.categories);
  const storeIsLoading = useProductsStore((state) => state.isLoading);
  const { t } = useTranslation();

  // Fetch categories if store is empty (handles page reload scenario)
  const { data: fetchedCategories, isLoading: isFetchingCategories } =
    useShopCategories(
      { shopUuid: shopDetails?.shop_uuid || "" },
      { enabled: storeCategories.length === 0 && !!shopDetails?.shop_uuid }
    );

  // Use store categories if available, otherwise use fetched categories
  const categories = useMemo(
    () =>
      storeCategories.length > 0
        ? storeCategories
        : (fetchedCategories as Category[]) || [],
    [storeCategories, fetchedCategories]
  );

  // Show loading if either store is loading or fetching categories
  const isLoading =
    storeIsLoading || (isFetchingCategories && storeCategories.length === 0);

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
          // Show skeleton while waiting for data
          [...Array(10)].map((_, index) => <ProductSkeleton key={index} />)
        )}
      </GridContainer>
    </div>
  );
}

export default AuroraAllCategoriesPage;
