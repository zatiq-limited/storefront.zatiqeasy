"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore } from "@/stores/productsStore";
import { PremiumProductCard } from "../../../components/cards";
import { SectionHeader } from "./section-header";
import { ViewAllButton } from "./view-all-button";
import { FallbackImage } from "@/components/ui/fallback-image";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { Product } from "@/stores/productsStore";

interface SelectedCategory {
  id: number;
  name: string;
  image_url?: string;
  banner_url?: string;
}

interface PremiumCategoryProductsSectionProps {
  setSelectedProduct: (product: Product | null) => void;
  navigateProductDetails: (id: number | string) => void;
}

export function PremiumCategoryProductsSection({
  setSelectedProduct,
  navigateProductDetails,
}: PremiumCategoryProductsSectionProps) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const allProducts = useProductsStore((state) => state.products);
  const isLgScreen = useMediaQuery("(min-width: 1024px)");

  const baseUrl = shopDetails?.baseUrl || "";

  // Get selected categories from shop theme
  const selectedCategories: SelectedCategory[] =
    ((shopDetails?.shop_theme as unknown as { selected_categories?: SelectedCategory[] })?.selected_categories) || [];

  // Number of products to show based on screen size
  const noOfProductsInFeaturedCategory = isLgScreen ? 5 : 6;

  if (selectedCategories.length === 0) {
    return null;
  }

  return (
    <div>
      {selectedCategories.map((category) => {
        // Filter products by category
        const filteredProducts = allProducts.filter((product) =>
          product.categories?.some((cat) => cat.id === category.id)
        );

        if (filteredProducts.length === 0) return null;

        return (
          <div
            className="w-full flex flex-col mb-[48px] md:mb-[60px] xl:mb-[84px]"
            key={category.id}
          >
            {/* Category Banner (if available) */}
            {category.banner_url && (
              <div className="mb-[48px] md:mb-[60px] xl:mb-[84px] w-full">
                <FallbackImage
                  src={category.banner_url}
                  alt={category.name}
                  height={380}
                  width={1300}
                  className="w-full aspect-[335/150] md:aspect-[1300/380] object-cover rounded-[8px] md:rounded-none"
                />
              </div>
            )}

            <div className="flex flex-col gap-[24px] lg:gap-[44px]">
              <SectionHeader
                title={category.name}
                buttonLink={`${baseUrl}/categories/${category.id}`}
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                {filteredProducts
                  .slice(0, noOfProductsInFeaturedCategory)
                  .map((product) => (
                    <PremiumProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={() => setSelectedProduct(product)}
                      onNavigate={() => navigateProductDetails(product.id)}
                    />
                  ))}
              </div>

              <ViewAllButton
                button_text={t("view_all_by_cat", { categoryName: category.name })}
                button_link={`${baseUrl}/categories/${category.id}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PremiumCategoryProductsSection;
