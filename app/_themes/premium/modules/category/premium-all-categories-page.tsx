"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore } from "@/stores/productsStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import ProductSkeleton from "@/components/shared/skeletons/product-skeleton";

export function PremiumAllCategoriesPage() {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const { categories, isLoading } = useProductsStore();

  // Filter parent categories (no parent_id)
  const parentCategories =
    categories?.filter((category) => !category.parent_id) ?? [];

  // Count total categories (excluding "all" and "others" if they exist)
  const totalCategories = parentCategories.length;

  const baseUrl = shopDetails?.baseUrl || "";

  return (
    <div className="container pt-6 pb-12 md:pb-21">
      {/* Page Header */}
      {totalCategories > 0 && (
        <h1 className="text-gray-700 dark:text-gray-200 text-3xl font-normal leading-9">
          {t("all_categories")} ({totalCategories})
        </h1>
      )}

      {/* Categories Grid */}
      <div className="w-full flex mt-9">
        <div className="w-full grid grid-cols-3 md:grid-cols-4 gap-5">
          {isLoading ? (
            [...Array(10)].map((_, index) => <ProductSkeleton key={index} />)
          ) : parentCategories.length > 0 ? (
            parentCategories.map((category, index) => (
              <a
                key={category.id}
                href={`${baseUrl}/categories/${category.id}`}
                className="flex flex-col items-center justify-center relative aspect-square"
              >
                <FallbackImage
                  src={category.image_url ?? ""}
                  alt={category.name}
                  height={310}
                  width={310}
                  priority={index < 4}
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  className="h-full w-full rounded-lg lg:rounded-none object-cover aspect-square"
                />
                <div className="absolute bottom-0 w-full bg-linear-to-t from-black-2/50 to-transparent pt-5 pl-3 lg:pl-6 pb-2 lg:pb-3 rounded-lg lg:rounded-none">
                  <h3 className="bottom-2 lg:bottom-3 text-white text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold">
                    {category.name}
                  </h3>
                </div>
              </a>
            ))
          ) : (
            // Show skeleton while waiting for data
            [...Array(10)].map((_, index) => <ProductSkeleton key={index} />)
          )}
        </div>
      </div>
    </div>
  );
}

export default PremiumAllCategoriesPage;
